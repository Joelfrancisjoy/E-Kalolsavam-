from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Score, Result
from .serializers import ScoreSerializer, ResultSerializer

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