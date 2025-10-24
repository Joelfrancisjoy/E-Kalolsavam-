from django.urls import path
from .views import (
    RegisterView, CurrentUserView, LoginView,
    AllowedEmailListCreateView, AllowedEmailDetailView,
    bulk_add_allowed_emails, check_email_allowed, check_email_registered, toggle_email_status,
    google_auth, accept_pending_password, set_new_password,
    AdminUserListView, AdminUserDetailView, SchoolListView,
    admin_toggle_user_active, admin_set_role, admin_set_approval,
    admin_bulk_activate, admin_bulk_set_approval,
    check_email_exists, check_username_exists,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('current/', CurrentUserView.as_view(), name='current-user'),
    path('google/', google_auth, name="google_auth"),

    # Schools
    path('schools/', SchoolListView.as_view(), name='schools-list'),

    # Users (admin-only)
    path('users/', AdminUserListView.as_view(), name='admin-users-list'),
    path('users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-users-detail'),
    path('users/<int:pk>/toggle-active/', admin_toggle_user_active, name='admin-users-toggle-active'),
    path('users/<int:pk>/set-role/', admin_set_role, name='admin-users-set-role'),
    path('users/<int:pk>/set-approval/', admin_set_approval, name='admin-users-set-approval'),
    path('users/bulk/activate/', admin_bulk_activate, name='admin-bulk-activate'),
    path('users/bulk/set-approval/', admin_bulk_set_approval, name='admin-bulk-set-approval'),

    # Allowed Email Management
    path('allowed-emails/', AllowedEmailListCreateView.as_view(), name='allowed-emails-list'),
    path('allowed-emails/<int:pk>/', AllowedEmailDetailView.as_view(), name='allowed-email-detail'),
    path('allowed-emails/bulk-add/', bulk_add_allowed_emails, name='bulk-add-allowed-emails'),
    path('allowed-emails/check/', check_email_allowed, name='check-email-allowed'),
    path('allowed-emails/check-registered/', check_email_registered, name='check-email-registered'),
    path('allowed-emails/<int:pk>/toggle/', toggle_email_status, name='toggle-email-status'),
    
    # Password management
    path('password/accept-pending/', accept_pending_password, name='accept-pending-password'),
    path('password/set-new/', set_new_password, name='set-new-password'),
    
    # Email and username validation
    path('emails/exists/', check_email_exists, name='check-email-exists'),
    path('usernames/exists/', check_username_exists, name='check-username-exists'),
]
