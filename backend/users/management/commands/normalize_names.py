from django.core.management.base import BaseCommand
from users.models import User

class Command(BaseCommand):
    help = 'Normalize existing user first_name and last_name to title case'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be changed without actually changing it',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']

        users = User.objects.all()
        updated_count = 0

        self.stdout.write(f'Processing {users.count()} users...')

        for user in users:
            original_first = user.first_name
            original_last = user.last_name

            # Normalize to title case
            new_first = original_first.title() if original_first else ''
            new_last = original_last.title() if original_last else ''

            # Check if any changes are needed
            if new_first != original_first or new_last != original_last:
                if dry_run:
                    self.stdout.write(
                        f'Would update: {user.username} - '
                        f'"{original_first} {original_last}" -> "{new_first} {new_last}"'
                    )
                else:
                    user.first_name = new_first
                    user.last_name = new_last
                    user.save(update_fields=['first_name', 'last_name'])
                    self.stdout.write(
                        f'Updated: {user.username} - '
                        f'"{original_first} {original_last}" -> "{new_first} {new_last}"'
                    )
                updated_count += 1

        if dry_run:
            self.stdout.write(
                self.style.SUCCESS(f'Dry run complete. Would update {updated_count} users.')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(f'Successfully updated {updated_count} users.')
            )