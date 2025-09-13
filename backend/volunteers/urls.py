from django.urls import path
from .views import VolunteerShiftListView, VolunteerAssignmentView

urlpatterns = [
    path('shifts/', VolunteerShiftListView.as_view(), name='volunteer-shift-list'),
    path('assignments/', VolunteerAssignmentView.as_view(), name='volunteer-assignment-list'),
    
]