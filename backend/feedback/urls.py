from django.urls import path
from .views import FeedbackListView, FeedbackCreateView

urlpatterns = [
    path('', FeedbackListView.as_view(), name='feedback-list'),
    path('submit/', FeedbackCreateView.as_view(), name='feedback-submit'),
]