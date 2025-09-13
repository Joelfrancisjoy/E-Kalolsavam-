from rest_framework import serializers
from .models import VolunteerShift, VolunteerAssignment

class VolunteerShiftSerializer(serializers.ModelSerializer):
    event_details = serializers.SerializerMethodField()
    volunteers_assigned = serializers.SerializerMethodField()
    
    class Meta:
        model = VolunteerShift
        fields = '__all__'
    
    def get_event_details(self, obj):
        from events.serializers import EventSerializer
        return EventSerializer(obj.event).data
    
    def get_volunteers_assigned(self, obj):
        assignments = VolunteerAssignment.objects.filter(shift=obj)
        from users.serializers import UserSerializer
        return UserSerializer([a.volunteer for a in assignments], many=True).data

class VolunteerAssignmentSerializer(serializers.ModelSerializer):
    volunteer_details = serializers.SerializerMethodField()
    shift_details = VolunteerShiftSerializer(source='shift', read_only=True)
    
    class Meta:
        model = VolunteerAssignment
        fields = '__all__'
    
    def get_volunteer_details(self, obj):
        from users.serializers import UserSerializer
        return UserSerializer(obj.volunteer).data