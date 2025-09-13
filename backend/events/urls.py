from django.urls import path
from .views import (
    VenueListCreateView, VenueDetailView,
    EventListCreateView, EventDetailView,
    EventRegistrationView, UserEventRegistrationsView
)

urlpatterns = [
    path('venues/', VenueListCreateView.as_view(), name='venue-list'),
    path('venues/<int:pk>/', VenueDetailView.as_view(), name='venue-detail'),
    path('', EventListCreateView.as_view(), name='event-list'),
    path('<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('registrations/', EventRegistrationView.as_view(), name='event-registration'),
    path('my-registrations/', UserEventRegistrationsView.as_view(), name='my-registrations'),
]