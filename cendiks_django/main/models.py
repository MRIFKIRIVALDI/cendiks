from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Certification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_number = models.IntegerField()
    score = models.IntegerField()
    passed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - Session {self.session_number} - {'Passed' if self.passed else 'Failed'}"
