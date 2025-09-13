from django.urls import path
from .views import ScoreListCreateView, ResultListView, JudgeResultsView

urlpatterns = [
    path('', ScoreListCreateView.as_view(), name='score-list'),
    path('results/', ResultListView.as_view(), name='result-list'),
    path('judge-results/', JudgeResultsView.as_view(), name='judge-results'),
]