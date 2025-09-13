from django.db import models
from users.models import User
from events.models import Event

class VolunteerShift(models.Model):
    SHIFT_STATUS = [
        ('available', 'Available'),
        ('assigned', 'Assigned'),
        ('completed', 'Completed'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    description = models.TextField()
    required_volunteers = models.IntegerField()
    status = models.CharField(max_length=20, choices=SHIFT_STATUS, default='available')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.event.name} - {self.date}"

class VolunteerAssignment(models.Model):
    volunteer = models.ForeignKey(User, on_delete=models.CASCADE)
    shift = models.ForeignKey(VolunteerShift, on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)
    checked_in = models.BooleanField(default=False)
    checked_out = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('volunteer', 'shift')
    
    def __str__(self):
        return f"{self.volunteer.username} - {self.shift}"