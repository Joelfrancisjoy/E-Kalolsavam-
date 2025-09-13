from rest_framework import serializers
from .models import User, AllowedEmail, School

# Extra imports for validation
import re
import socket
from typing import Optional
from PIL import Image


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone']
        read_only_fields = ['id']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    # Allow only safe roles from client
    role = serializers.ChoiceField(choices=[('student', 'Student'), ('judge', 'Judge'), ('volunteer', 'Volunteer')], default='student')

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'phone', 'role',
            'college_id_photo', 'school', 'school_category_extra'
        ]

    # -------------------- Helper validation functions --------------------
    def _domain_exists(self, domain: str) -> bool:
        try:
            # Try to resolve domain to any address (A/AAAA)
            socket.getaddrinfo(domain, None)
            return True
        except Exception:
            return False

    def _is_probably_fake_email(self, email: str) -> bool:
        try:
            local = email.split('@')[0]
        except Exception:
            return True
        # Reject patterns like zzzzzz@gmail.com (same char >=5)
        return bool(re.match(r'^(.)\1{4,}$', local))

    def _validate_phone(self, phone: str):
        if phone is None:
            raise serializers.ValidationError('Phone number is required')
        digits = re.sub(r'\D', '', phone)
        if len(digits) != 10:
            raise serializers.ValidationError('Phone number must be exactly 10 digits')
        if not re.match(r'^[789]', digits):
            raise serializers.ValidationError('Phone number must start with 7, 8, or 9')
        if digits == '0000000000':
            raise serializers.ValidationError('Phone number cannot be all zeros')
        # Reject long repetitive sequences (e.g., 4444422222)
        if re.search(r'(\d)\1{4,}', digits):
            raise serializers.ValidationError('Phone number has an invalid repetitive sequence')
        return digits

    def _is_jpeg(self, f) -> bool:
        try:
            f.seek(0)
        except Exception:
            pass
        try:
            img = Image.open(f)
            img.verify()  # Validate structure
            fmt = getattr(img, 'format', None)
            try:
                f.seek(0)
            except Exception:
                pass
            return fmt == 'JPEG'
        except Exception:
            try:
                f.seek(0)
            except Exception:
                pass
            return False

    # -------------------- Field-level validations --------------------
    def validate_email(self, value: str) -> str:
        # Normalize and basic sanity checks
        email = (value or '').strip().lower()
        if self._is_probably_fake_email(email):
            raise serializers.ValidationError('Please use a real email address')
        # Optional domain existence verification (recommended)
        parts = email.split('@')
        if len(parts) == 2:
            domain = parts[1]
            if not self._domain_exists(domain):
                raise serializers.ValidationError('Email domain does not seem to exist')
        return email

    def validate_phone(self, value: Optional[str]) -> str:
        return self._validate_phone(value)

    # -------------------- Object-level validation --------------------
    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError('Passwords do not match')

        # Role-specific requirements
        role = attrs.get('role') or 'student'

        # Student-specific: require JPEG college ID and a school
        if role == 'student':
            college_id = attrs.get('college_id_photo')
            if not college_id:
                raise serializers.ValidationError({'college_id_photo': 'College ID photo (JPEG) is required for students'})
            if not self._is_jpeg(college_id):
                raise serializers.ValidationError({'college_id_photo': 'Only JPEG images (.jpg, .jpeg) are allowed'})

            school = attrs.get('school')
            if not school:
                raise serializers.ValidationError({'school': 'School selection is required for students'})
            if isinstance(school, School) and not school.is_active:
                raise serializers.ValidationError({'school': 'Selected school is not active'})

            # If selected school's category is not LP, require additional dropdown value
            school_obj = school if isinstance(school, School) else None
            if school_obj and school_obj.category != 'LP':
                extra = attrs.get('school_category_extra')
                if extra not in ['UP', 'HS', 'HSS']:
                    raise serializers.ValidationError({'school_category_extra': 'This field is required and must be one of UP, HS, HSS'})
            else:
                # Ensure empty for LP
                attrs['school_category_extra'] = ''
        else:
            # Non-students: ensure no student-only requirements enforced
            attrs['college_id_photo'] = attrs.get('college_id_photo')  # allowed but not required
            # school and extra are optional for non-students

        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')

        # Disallow client from creating admin users via public registration
        role = validated_data.get('role') or 'student'
        if role not in ['student', 'judge', 'volunteer']:
            raise serializers.ValidationError({'role': 'Invalid role'})

        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class AllowedEmailSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = AllowedEmail
        fields = ['id', 'email', 'is_active', 'created_at', 'created_by', 'created_by_username']
        read_only_fields = ['id', 'created_at', 'created_by', 'created_by_username']

    def create(self, validated_data):
        # Normalize email and set creator
        validated_data['email'] = validated_data['email'].lower()
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class BulkAllowedEmailSerializer(serializers.Serializer):
    emails = serializers.ListField(
        child=serializers.EmailField(),
        allow_empty=False,
        help_text="List of email addresses to add to allowed list"
    )

    def validate_emails(self, value):
        # Remove duplicates while preserving order
        unique_emails = []
        seen = set()
        for email in value:
            if email.lower() not in seen:
                unique_emails.append(email.lower())
                seen.add(email.lower())
        return unique_emails

    def create(self, validated_data):
        emails = validated_data['emails']
        created_by = self.context['request'].user
        created_emails = []

        for email in emails:
            allowed_email, created = AllowedEmail.objects.get_or_create(
                email=email,
                defaults={'created_by': created_by, 'is_active': True}
            )
            if created:
                created_emails.append(allowed_email)

        return created_emails


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ['id', 'name', 'category', 'is_active']


# Admin-only serializer to restrict writable fields
class AdminUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['role', 'phone']
