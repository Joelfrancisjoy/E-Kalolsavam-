from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.db import transaction
from .models import Score, Result
from .serializers import ScoreSerializer, ResultSerializer
from django.db.models import Avg, Count
from .scoring_criteria import get_criteria_for_event, validate_score_data
from events.models import Event
from django.shortcuts import get_object_or_404

class ScoreListCreateView(generics.ListCreateAPIView):
    serializer_class = ScoreSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Score.objects.all()
        elif user.role == 'judge':
            return Score.objects.filter(judge=user)
        else:
            return Score.objects.filter(participant=user)

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'judge':
            serializer.save(judge=user)
        else:
            raise PermissionError("Only judges can submit scores")

class ResultListView(generics.ListAPIView):
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        event_id = self.request.query_params.get('event', None)
        queryset = Result.objects.filter(published=True)
        if event_id:
            queryset = queryset.filter(event_id=event_id)
        return queryset

class JudgeResultsView(generics.ListAPIView):
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'judge':
            # Get results for events assigned to this judge
            return Result.objects.filter(
                event__judges=user,
                published=True
            )
        return Result.objects.none()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_scores_bundle(request):
    """
    Accepts a score submission from a judge for a participant in an event.
    Supports both legacy format and new dynamic criteria format.
    
    New format payload:
    {
      "eventId": <event_id>,
      "participantId": <user_id>,
      "items": [
        {"criteria": "Technical Skill", "score": 20.5, "comments": ""},
        {"criteria": "Artistic Expression", "score": 18.0, "comments": ""},
        ...
      ]
    }
    
    Legacy format still supported for backward compatibility.
    """
    user = request.user
    if getattr(user, 'role', None) != 'judge':
        return Response({"error": "Only judges can submit scores"}, status=status.HTTP_403_FORBIDDEN)

    # Check if new format (with items array)
    if 'items' in request.data:
        return _submit_dynamic_scores(request, user)
    else:
        return _submit_legacy_scores(request, user)


def _submit_dynamic_scores(request, user):
    """Handle new dynamic criteria format."""
    event_id = request.data.get('eventId')
    participant_id = request.data.get('participantId')
    items = request.data.get('items', [])
    
    if not event_id or not participant_id or not items:
        return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        event = get_object_or_404(Event, pk=event_id)
        
        # Get expected criteria for this event
        expected_criteria = get_criteria_for_event(event.name, event.category)
        
        # Build criteria_scores dict from items
        criteria_scores = {}
        notes_parts = []
        
        for item in items:
            criteria_label = item.get('criteria', '')
            score = item.get('score', 0)
            comments = item.get('comments', '')
            
            # Find matching criterion ID
            criterion_id = None
            for c in expected_criteria:
                if c['label'] == criteria_label:
                    criterion_id = c['id']
                    break
            
            if criterion_id:
                criteria_scores[criterion_id] = float(score)
                if comments:
                    notes_parts.append(f"{criteria_label}: {comments}")
        
        notes = "\n".join(notes_parts) if notes_parts else ""
        
        with transaction.atomic():
            obj, created = Score.objects.update_or_create(
                event_id=event_id,
                participant_id=participant_id,
                judge=user,
                defaults={
                    'criteria_scores': criteria_scores,
                    'notes': notes,
                }
            )
            
            serializer = ScoreSerializer(obj)
            return Response({
                "status": "ok",
                "created": created,
                "score": serializer.data
            }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


def _submit_legacy_scores(request, user):
    """Handle legacy format for backward compatibility."""
    event_id = request.data.get('event')
    participant_id = request.data.get('participant')
    technical_skill = request.data.get('technical_skill')
    artistic_expression = request.data.get('artistic_expression')
    stage_presence = request.data.get('stage_presence')
    overall_impression = request.data.get('overall_impression')
    notes = request.data.get('notes', '')

    if not all([event_id, participant_id, technical_skill is not None, 
                artistic_expression is not None, stage_presence is not None, 
                overall_impression is not None]):
        return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            obj, created = Score.objects.update_or_create(
                event_id=event_id,
                participant_id=participant_id,
                judge=user,
                defaults={
                    'technical_skill': technical_skill,
                    'artistic_expression': artistic_expression,
                    'stage_presence': stage_presence,
                    'overall_impression': overall_impression,
                    'notes': notes,
                }
            )
            
            serializer = ScoreSerializer(obj)
            return Response({
                "status": "ok", 
                "created": created,
                "score": serializer.data
            }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def scores_summary(request):
    """
    Returns per-participant per-event summary for the requesting judge, including:
    - my_scores_total: my total score for that participant in that event
    - judges_submitted: number of distinct judges who have submitted scores for that participant
    - judges_totals: list of total scores per judge
    - current_final: current final score after dropping extremes (if 5+ judges)
    Query params: event=<id>
    """
    user = request.user
    if getattr(user, 'role', None) != 'judge':
        return Response({"error": "Only judges can view this summary"}, status=status.HTTP_403_FORBIDDEN)

    event_id = request.query_params.get('event')
    if not event_id:
        return Response({"error": "Missing event id"}, status=status.HTTP_400_BAD_REQUEST)

    # Get all scores for this event
    scores = Score.objects.filter(event_id=event_id).select_related('participant', 'judge')

    # Build participant -> list of judge totals
    participant_to_judges = {}
    participant_to_mine = {}
    
    for score in scores:
        pid = score.participant_id
        jid = score.judge_id
        tot = float(score.total_score)
        
        if pid not in participant_to_judges:
            participant_to_judges[pid] = []
        participant_to_judges[pid].append({"judge": jid, "total": tot})
        
        if jid == user.id:
            participant_to_mine[pid] = tot

    # Prepare response array
    data = []
    for pid, judges in participant_to_judges.items():
        judges_totals = [j['total'] for j in judges]
        
        # Calculate current final score (drop highest and lowest if 5+ judges)
        current_final = None
        if len(judges_totals) >= 5:
            sorted_totals = sorted(judges_totals)
            # Drop highest and lowest
            dropped_totals = sorted_totals[1:-1]
            current_final = sum(dropped_totals) / len(dropped_totals) if dropped_totals else None
        elif judges_totals:
            current_final = sum(judges_totals) / len(judges_totals)
        
        data.append({
            'participant': pid,
            'my_scores_total': participant_to_mine.get(pid),
            'judges_submitted': len(judges_totals),
            'judges_totals': judges_totals,
            'current_final': current_final,
        })

    return Response({'results': data}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_event_criteria(request):
    """
    Get scoring criteria for a specific event.
    Query params: event=<id>
    """
    event_id = request.query_params.get('event')
    if not event_id:
        return Response({"error": "Missing event id"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        event = get_object_or_404(Event, pk=event_id)
        criteria = get_criteria_for_event(event.name, event.category)
        
        return Response({
            'event_id': event.id,
            'event_name': event.name,
            'category': event.category,
            'criteria': criteria
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)