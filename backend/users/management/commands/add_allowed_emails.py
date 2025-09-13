from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from users.models import AllowedEmail
import csv
import os

User = get_user_model()

class Command(BaseCommand):
    help = 'Add allowed emails for Google signup'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            help='Single email address to add',
        )
        parser.add_argument(
            '--emails',
            nargs='+',
            help='Multiple email addresses to add',
        )
        parser.add_argument(
            '--file',
            type=str,
            help='Path to CSV file containing email addresses',
        )
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

        emails_to_add = []

        # Handle single email
        if options['email']:
            emails_to_add.append(options['email'])

        # Handle multiple emails
        if options['emails']:
            emails_to_add.extend(options['emails'])

        # Handle CSV file
        if options['file']:
            if not os.path.exists(options['file']):
                raise CommandError(f'File {options["file"]} does not exist')
            
            try:
                with open(options['file'], 'r', newline='', encoding='utf-8') as csvfile:
                    # Try to detect if it has headers
                    sample = csvfile.read(1024)
                    csvfile.seek(0)
                    sniffer = csv.Sniffer()
                    has_header = sniffer.has_header(sample)
                    
                    reader = csv.reader(csvfile)
                    if has_header:
                        next(reader)  # Skip header row
                    
                    for row in reader:
                        if row and row[0].strip():  # Skip empty rows
                            emails_to_add.append(row[0].strip())
                            
            except Exception as e:
                raise CommandError(f'Error reading CSV file: {e}')

        if not emails_to_add:
            raise CommandError('No emails provided. Use --email, --emails, or --file')

        # Remove duplicates while preserving order
        unique_emails = []
        seen = set()
        for email in emails_to_add:
            email_lower = email.lower()
            if email_lower not in seen:
                unique_emails.append(email_lower)
                seen.add(email_lower)

        # Add emails to database
        added_count = 0
        skipped_count = 0
        
        for email in unique_emails:
            try:
                allowed_email, created = AllowedEmail.objects.get_or_create(
                    email=email,
                    defaults={
                        'created_by': admin_user,
                        'is_active': True
                    }
                )
                
                if created:
                    added_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'Added: {email}')
                    )
                else:
                    skipped_count += 1
                    self.stdout.write(
                        self.style.WARNING(f'Already exists: {email}')
                    )
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error adding {email}: {e}')
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
                    'Google signup is now restricted to the allowed email addresses.'
                )
            )