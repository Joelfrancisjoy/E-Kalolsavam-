from django.core.management.base import BaseCommand
from events.models import Venue


VENUE_NAMES = [
    "Central Stadium (Palayam)",
    "Government College for Women, Vazhuthacaud",
    "Tagore Theatre, Vazhuthacaud",
    "Karthika Thirunal Theatre, East Fort",
    "Government Higher Secondary School, Manacaud",
    "St. Joseph’s Higher Secondary School, Palayam",
    "Government Model Girls HSS, Pattom",
    "Nirmala Bhavan HSS, Kowdiar",
    "Government Higher Secondary School for Girls, Cotton Hill",
    "Swathi Thirunal College of Music",
    "The Institution of Engineers, Vellayambalam",
    "Samskarika Kendram, Poojappura",
    "Carmel Higher Secondary School, Vazhuthacaud",
    "Bharat Bhavan, Thycaud",
    "Nishagandhi Auditorium (Nanthancode)",
    "Sisu Kshema Samithi Hall, Thycaud",
    "Government Model Boys HSS, Thycaud",
    "Government Model LPS, Thycaud",
    "Mahatma Ayyankali Hall, Palayam",
    "Government HSS, Chala",
    "St. Mary’s HSS, Pattom",
]


class Command(BaseCommand):
    help = "Seed default venues for Event Management dropdown (idempotent)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--capacity",
            type=int,
            default=1000,
            help="Default seating capacity to use for new venues.",
        )
        parser.add_argument(
            "--event-limit",
            type=int,
            default=10,
            help="Default event_limit to use for new venues.",
        )

    def handle(self, *args, **options):
        default_capacity = options["capacity"]
        default_event_limit = options["event_limit"]

        created = 0
        skipped = 0
        for name in VENUE_NAMES:
            # Use the venue name as location fallback since precise address is not provided
            obj, was_created = Venue.objects.get_or_create(
                name=name,
                defaults={
                    "location": name,
                    "capacity": default_capacity,
                    "event_limit": default_event_limit,
                },
            )
            if was_created:
                created += 1
            else:
                # Optionally update missing fields if they were empty
                updated = False
                if not obj.location:
                    obj.location = name
                    updated = True
                if not obj.capacity:
                    obj.capacity = default_capacity
                    updated = True
                if updated:
                    obj.save()
                skipped += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Venues seeding complete. Created: {created}, Existing: {skipped}."
            )
        )


