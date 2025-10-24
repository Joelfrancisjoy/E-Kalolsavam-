from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    """Allow access only to authenticated users with role == 'admin' or specific admin users."""

    def has_permission(self, request, view):
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return False
        # Allow if role is admin
        if getattr(user, 'role', None) == 'admin':
            return True
        # Allow specific admin users
        if user.email == 'joelfrancisjoy@gmail.com' or user.username.lower() == 'cenadmin':
            return True
        return False