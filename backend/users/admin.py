from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, AllowedEmail

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at')
    list_filter = ('role', 'is_active', 'is_staff', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-created_at',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('role', 'phone', 'created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')

@admin.register(AllowedEmail)
class AllowedEmailAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'created_by', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('email', 'created_by__username')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating a new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
    
    actions = ['activate_emails', 'deactivate_emails']
    
    def activate_emails(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} email(s) activated successfully.')
    activate_emails.short_description = "Activate selected emails"
    
    def deactivate_emails(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} email(s) deactivated successfully.')
    deactivate_emails.short_description = "Deactivate selected emails"