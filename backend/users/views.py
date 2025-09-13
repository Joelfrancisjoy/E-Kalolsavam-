import os
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from rest_framework.parsers import MultiPartParser, FormParser

from .models import User, AllowedEmail, School
from .serializers import (
    UserSerializer, UserRegistrationSerializer, AllowedEmailSerializer,
    BulkAllowedEmailSerializer, AdminUserUpdateSerializer, SchoolSerializer
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Send confirmation email (do not block registration on failure)
        try:
            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
            login_url = f"{frontend_url.rstrip('/')}/login"
            subject = 'Successful Registration in E-Kalolsavam'
            message = 'Successful Registration in E-Kalolsavam visit the site for more details on Event Participation'
            html_message = f"""
                <div style='font-family: Arial, sans-serif; line-height: 1.6;'>
                    <h2>Successful Registration in E-Kalolsavam</h2>
                    <p>Successful Registration in E-Kalolsavam visit the site for more details on Event Participation</p>
                    <p>
                        <a href='{login_url}'
                           style='display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;'>
                           Click Here
                        </a>
                    </p>
                </div>
            """
            send_mail(
                subject,
                message,
                'joelfrancisjoy@gmail.com',  # Sender
                [user.email],
                fail_silently=True,
                html_message=html_message,
            )
        except Exception:
            pass

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            else:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'error': 'Username and password required'
            }, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        if getattr(request.user, 'role', None) != 'admin':
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        return super().list(request, *args, **kwargs)


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if getattr(request.user, 'role', None) != 'admin':
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        # Return full user serializer for GET
        instance = self.get_object()
        return Response(UserSerializer(instance).data)

    def patch(self, request, *args, **kwargs):
        if getattr(request.user, 'role', None) != 'admin':
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        return super().patch(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if getattr(request.user, 'role', None) != 'admin':
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        return super().delete(request, *args, **kwargs)


class SchoolListView(generics.ListAPIView):
    queryset = School.objects.filter(is_active=True)
    serializer_class = SchoolSerializer
    permission_classes = [AllowAny]


# Allowed Email Management Views
class AllowedEmailListCreateView(generics.ListCreateAPIView):
    queryset = AllowedEmail.objects.all().order_by('-created_at')
    serializer_class = AllowedEmailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only admin users can view all allowed emails
        if getattr(self.request.user, 'role', None) == 'admin':
            return AllowedEmail.objects.all().order_by('-created_at')
        else:
            # Non-admin users can only see emails they created
            return AllowedEmail.objects.filter(created_by=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Only admin users can create allowed emails
        if getattr(self.request.user, 'role', None) != 'admin':
            raise PermissionDenied("Only admin users can add allowed emails")
        serializer.save()


class AllowedEmailDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AllowedEmail.objects.all()
    serializer_class = AllowedEmailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only admin users can manage all allowed emails
        if getattr(self.request.user, 'role', None) == 'admin':
            return AllowedEmail.objects.all()
        else:
            # Non-admin users can only manage emails they created
            return AllowedEmail.objects.filter(created_by=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_add_allowed_emails(request):
    """
    Bulk add multiple email addresses to the allowed list
    """
    if getattr(request.user, 'role', None) != 'admin':
        return Response(
            {'error': 'Only admin users can bulk add allowed emails'},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = BulkAllowedEmailSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        created_emails = serializer.save()
        return Response({
            'message': f'Successfully added {len(created_emails)} email addresses',
            'created_emails': AllowedEmailSerializer(created_emails, many=True).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def check_email_allowed(request):
    """
    Check if an email is in the allowed list (public endpoint for frontend validation)
    """
    email = request.GET.get('email')
    if not email:
        return Response({'error': 'Email parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

    is_allowed = AllowedEmail.objects.filter(email=email.lower(), is_active=True).exists()
    return Response({'email': email, 'is_allowed': is_allowed})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_email_status(request, pk):
    """
    Toggle the active status of an allowed email
    """
    if getattr(request.user, 'role', None) != 'admin':
        return Response(
            {'error': 'Only admin users can toggle email status'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        allowed_email = AllowedEmail.objects.get(pk=pk)
        allowed_email.is_active = not allowed_email.is_active
        allowed_email.save()

        return Response({
            'message': f'Email {allowed_email.email} is now {"active" if allowed_email.is_active else "inactive"}',
            'email': AllowedEmailSerializer(allowed_email).data
        })
    except AllowedEmail.DoesNotExist:
        return Response({'error': 'Allowed email not found'}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """
    Verify Google ID token, enforce AllowedEmail whitelist, then issue JWT pair.
    Expects: { "token": "<GoogleIDToken>" }
    Returns: { access, refresh, user }
    """
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests

    token = request.data.get("token")
    if not token:
        return JsonResponse({"error": "No token provided"}, status=400)

    try:
        # Verify token with Google
        id_info = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            os.getenv('SOCIAL_AUTH_GOOGLE_OAUTH2_KEY')
        )
        # token is valid
        email = id_info.get('email')
        if not email:
            return JsonResponse({"error": "Email not present in Google token"}, status=400)

        # Enforce allowed emails whitelist
        from .models import AllowedEmail, User
        if not AllowedEmail.objects.filter(email=email.lower(), is_active=True).exists():
            return JsonResponse({"error": "This email is not authorized for Google login"}, status=403)

        # Get or create user
        first_name = id_info.get('given_name', '')
        last_name = id_info.get('family_name', '')
        # Try to find user by email
        user = User.objects.filter(email__iexact=email).first()
        if not user:
            # Create a username from email local-part; ensure uniqueness
            base_username = email.split('@')[0]
            username = base_username
            suffix = 1
            while User.objects.filter(username__iexact=username).exists():
                username = f"{base_username}{suffix}"
                suffix += 1
            user = User.objects.create(
                username=username,
                email=email.lower(),
                first_name=first_name,
                last_name=last_name,
                role='student',  # default role for Google sign-in
            )
            user.set_unusable_password()
            user.save()

        # Issue JWT tokens
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })

    except ValueError as e:
        # Invalid token
        return JsonResponse({"error": "Invalid Google token", "detail": str(e)}, status=400)
    except Exception as e:
        return JsonResponse({"error": "Google authentication error", "detail": str(e)}, status=500)