from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import AllowedEmail

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate AllowedEmail table with all existing users\' emails'

    def add_arguments(self, parser):
        parser.add_argument(
            '--admin-user',
            type=str,
            help='Username of admin user to set as creator (optional)',
        )

    def handle(self, *args, **options):
        admin_user = None

        # Get admin user if specified
        if options['admin_user']:
            try:
                admin_user = User.objects.get(username=options['admin_user'])
                if admin_user.role != 'admin':
                    self.stdout.write(
                        self.style.WARNING(f'User {options["admin_user"]} is not an admin')
                    )
            except User.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'User {options["admin_user"]} does not exist')
                )
                return

        # Get all unique emails from existing users
        existing_emails = User.objects.values_list('email', flat=True).distinct()

        added_count = 0
        skipped_count = 0

        for email in existing_emails:
            if email:  # Skip empty emails
                email_lower = email.lower()
                try:
                    allowed_email, created = AllowedEmail.objects.get_or_create(
                        email=email_lower,
                        defaults={
                            'created_by': admin_user,
                            'is_active': True
                        }
                    )

                    if created:
                        added_count += 1
                        self.stdout.write(
                            self.style.SUCCESS(f'Added: {email_lower}')
                        )
                    else:
                        skipped_count += 1
                        self.stdout.write(
                            self.style.WARNING(f'Already exists: {email_lower}')
                        )

                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'Error adding {email_lower}: {e}')
                    )

        # Summary
        self.stdout.write(
            self.style.SUCCESS(
                f'\nSummary: {added_count} emails added, {skipped_count} already existed'
            )
        )

        if added_count > 0:
            self.stdout.write(
                self.style.SUCCESS(
                    'All existing users\' emails are now allowed for Google signup.'
                )
            )