from rest_framework import serializers
from .models import Certificate

class CertificateSerializer(serializers.ModelSerializer):
    participant_details = serializers.SerializerMethodField()
    event_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Certificate
        fields = '__all__'
    
    def get_participant_details(self, obj):
        from users.serializers import UserSerializer
        return UserSerializer(obj.participant).data
    
    def get_event_details(self, obj):
        from events.serializers import EventSerializer
        return EventSerializer(obj.event).data