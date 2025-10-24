from django.urls import path
from .views import ScoreListCreateView, ResultListView, JudgeResultsView, submit_scores_bundle, scores_summary, get_event_criteria
from .adapters import submit_scores_bundle_adapter

urlpatterns = [
    path('', ScoreListCreateView.as_view(), name='score-list'),
    path('results/', ResultListView.as_view(), name='result-list'),
    path('judge-results/', JudgeResultsView.as_view(), name='judge-results'),
    path('submit-bundle/', submit_scores_bundle_adapter, name='submit-scores-bundle'),  # Using adapter
    path('submit-bundle-original/', submit_scores_bundle, name='submit-scores-bundle-original'),  # Keep original
    path('summary/', scores_summary, name='scores-summary'),
    path('event-criteria/', get_event_criteria, name='event-criteria'),
]