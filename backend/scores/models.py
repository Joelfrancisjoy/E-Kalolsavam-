from django.db import models
from users.models import User
from events.models import Event

class Score(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    participant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scores')
    judge = models.ForeignKey(User, on_delete=models.CASCADE, related_name='judged_scores')
    score = models.DecimalField(max_digits=5, decimal_places=2)
    criteria = models.CharField(max_length=100)  # e.g., "Creativity", "Technique"
    comments = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'participant', 'judge', 'criteria')

    def __str__(self):
        return f"{self.participant.username} - {self.event.name} - {self.criteria}: {self.score}"

class Result(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    participant = models.ForeignKey(User, on_delete=models.CASCADE)
    total_score = models.DecimalField(max_digits=6, decimal_places=2)
    rank = models.IntegerField()
    published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('event', 'participant')
        ordering = ['rank']

    def __str__(self):
        return f"{self.event.name} - {self.participant.username} - Rank: {self.rank}"