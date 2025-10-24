from rest_framework import serializers
from .models import Score, Result

class ScoreSerializer(serializers.ModelSerializer):
    judge_name = serializers.CharField(source='judge.username', read_only=True)
    participant_name = serializers.CharField(source='participant.username', read_only=True)
    event_name = serializers.CharField(source='event.name', read_only=True)
    
    class Meta:
        model = Score
        fields = [
            'id', 'event', 'event_name', 'participant', 'participant_name', 
            'judge', 'judge_name', 'technical_skill', 'artistic_expression', 
            'stage_presence', 'overall_impression', 'criteria_scores', 
            'total_score', 'notes', 'submitted_at', 'updated_at'
        ]
        read_only_fields = ['judge', 'total_score', 'submitted_at', 'updated_at']

class ResultSerializer(serializers.ModelSerializer):
    participant_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Result
        fields = '__all__'
    
    def get_participant_details(self, obj):
        from users.serializers import UserSerializer
        return UserSerializer(obj.participant).data