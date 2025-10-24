from social_core.exceptions import AuthForbidden
from .models import AllowedEmail, User

def check_email_allowed(backend, details, user=None, *args, **kwargs):
    """
    Custom social auth pipeline to check if the email is in the allowed list or if user is already registered
    """
    if backend.name == 'google-oauth2':
        email = details.get('email')
        if email:
            # Allow if user is already registered (existing user)
            if User.objects.filter(email__iexact=email).exists():
                return None
            
            # For new users, check if email is in allowed list and is active
            if not AllowedEmail.objects.filter(email=email, is_active=True).exists():
                raise AuthForbidden(backend, f'Email {email} is not authorized for Google signup')
    
    return None

def assign_default_role(backend, details, user=None, is_new=False, *args, **kwargs):
    """
    Assign default role to new users created via Google OAuth
    """
    if is_new and user and backend.name == 'google-oauth2':
        # Set default role for Google OAuth users
        if not user.role:
            user.role = 'student'  # Default role
            user.save()
    
    return None