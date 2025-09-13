from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class AllowedEmail(models.Model):
    email = models.EmailField(
        max_length=254,
        unique=True,
        verbose_name='Email Address'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Is Active'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Created At'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='allowedemail_set',
        verbose_name='Created By',
        blank=True,
        null=True
    )

    class Meta:
        verbose_name = 'Allowed Email'
        verbose_name_plural = 'Allowed Emails'
        ordering = ['-created_at']

    def __str__(self):
        return self.email

class School(models.Model):
    CATEGORY_CHOICES = [
        ('LP', 'Lower Primary'),
        ('UP', 'Upper Primary'),
        ('HS', 'High School'),
        ('HSS', 'Higher Secondary School'),
    ]
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=3, choices=CATEGORY_CHOICES)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('judge', 'Judge'),
        ('admin', 'Admin'),
        ('volunteer', 'Volunteer')
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=15, blank=True)
    college_id_photo = models.ImageField(upload_to='college_id_photos/', blank=True, null=True)
    school = models.ForeignKey(School, on_delete=models.SET_NULL, null=True, blank=True)
    school_category_extra = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
