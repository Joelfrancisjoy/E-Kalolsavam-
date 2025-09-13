from rest_framework import serializers
from .models import Score, Result

class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = '__all__'
        read_only_fields = ['judge', 'submitted_at']

class ResultSerializer(serializers.ModelSerializer):
    participant_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Result
        fields = '__all__'
    
    def get_participant_details(self, obj):
        from users.serializers import UserSerializer
        return UserSerializer(obj.participant).data