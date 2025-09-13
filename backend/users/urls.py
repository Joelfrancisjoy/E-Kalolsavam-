from django.urls import path
from .views import (
    RegisterView, CurrentUserView, LoginView,
    AllowedEmailListCreateView, AllowedEmailDetailView,
    bulk_add_allowed_emails, check_email_allowed, toggle_email_status,
    google_auth,   # ✅ import google_auth here
    AdminUserListView, AdminUserDetailView, SchoolListView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('current/', CurrentUserView.as_view(), name='current-user'),
    path('google/', google_auth, name="google_auth"),  # ✅ added missing comma

    # Schools
    path('schools/', SchoolListView.as_view(), name='schools-list'),

    # Users (admin-only)
    path('users/', AdminUserListView.as_view(), name='admin-users-list'),
    path('users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-users-detail'),

    # Allowed Email Management
    path('allowed-emails/', AllowedEmailListCreateView.as_view(), name='allowed-emails-list'),
    path('allowed-emails/<int:pk>/', AllowedEmailDetailView.as_view(), name='allowed-email-detail'),
    path('allowed-emails/bulk-add/', bulk_add_allowed_emails, name='bulk-add-allowed-emails'),
    path('allowed-emails/check/', check_email_allowed, name='check-email-allowed'),
    path('allowed-emails/<int:pk>/toggle/', toggle_email_status, name='toggle-email-status'),
]
