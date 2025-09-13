from rest_framework import serializers
from .models import Event, Venue, EventRegistration

class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    venue_details = VenueSerializer(source='venue', read_only=True)
    judges_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def get_judges_details(self, obj):
        from users.serializers import UserSerializer
        return UserSerializer(obj.judges.all(), many=True).data

class EventRegistrationSerializer(serializers.ModelSerializer):
    event_details = EventSerializer(source='event', read_only=True)
    participant_details = serializers.SerializerMethodField()
    
    class Meta:
        model = EventRegistration
        fields = '__all__'
        read_only_fields = ['registration_date']
    
    def get_participant_details(self, obj):
        from users.serializers import UserSerializer
        return UserSerializer(obj.participant).data