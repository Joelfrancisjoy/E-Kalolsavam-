"""
Adapter views to bridge frontend and backend data format differences.
This file provides compatibility layers without modifying existing code.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.shortcuts import get_object_or_404
from .models import Score
from .serializers import ScoreSerializer
from .scoring_criteria import get_criteria_for_event
from events.models import Event


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_scores_bundle_adapter(request):
    """
    Adapter endpoint that accepts frontend's items-based format and converts it
    to the backend's expected field-based format.
    
    Frontend sends:
    {
      "event": <event_id>,
      "participant": <user_id>,
      "items": [
        {"criteria": "Technical Skill", "score": 20.8, "comments": "..."},
        {"criteria": "Artistic Expression", "score": 18.0, "comments": "..."},
        {"criteria": "Stage Presence", "score": 20.1, "comments": "..."},
        {"criteria": "Overall Impression", "score": 14.8, "comments": "..."}
      ]
    }
    
    Backend expects:
    {
      "event": <event_id>,
      "participant": <user_id>,
      "technical_skill": 20.8,
      "artistic_expression": 18.0,
      "stage_presence": 20.1,
      "overall_impression": 14.8,
      "notes": "..."
    }
    """
    user = request.user
    if getattr(user, 'role', None) != 'judge':
        return Response(
            {"error": "Only judges can submit scores"}, 
            status=status.HTTP_403_FORBIDDEN
        )

    # Accept both legacy keys and new keys
    event_id = request.data.get('event') or request.data.get('eventId')
    participant_id = request.data.get('participant') or request.data.get('participantId')
    items = request.data.get('items', [])

    if not event_id or not participant_id or not items:
        return Response(
            {"error": "Missing required fields: event, participant, or items"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    # Resolve event and expected criteria
    event = get_object_or_404(Event, pk=event_id)
    expected = get_criteria_for_event(event.name, event.category)
    # Build label -> id mapping from expected criteria
    label_to_id = {c['label']: c['id'] for c in expected}

    # Transform items to criteria_scores JSON and aggregate notes
    criteria_scores = {}
    notes = ''
    for item in items:
        label = item.get('criteria', '')
        score = item.get('score')
        comments = item.get('comments', '')
        criterion_id = label_to_id.get(label)
        if criterion_id is not None and score is not None:
            try:
                criteria_scores[criterion_id] = float(score)
            except (TypeError, ValueError):
                return Response(
                    {"error": f"Invalid score value for '{label}'"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        if comments:
            # Keep the latest non-empty comment or append
            notes = comments if not notes else notes + "\n" + comments

    # Validate that all expected criteria are present
    missing = [c['label'] for c in expected if c['id'] not in criteria_scores]
    if missing:
        return Response(
            {"error": f"Missing scores for: {', '.join(missing)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        with transaction.atomic():
            # Upsert by unique_together (event, participant, judge)
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
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
