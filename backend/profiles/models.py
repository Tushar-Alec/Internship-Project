from django.db import models
from django.conf import settings
from django_mongodb_backend.fields import ObjectIdAutoField

class Profile(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    # Step 1 - Education
    education = models.JSONField(default=list)
    # [{ degree, field, institution, year, status: completed/ongoing/planned }]

    # Step 2 - Skills & Interests
    skills = models.JSONField(default=list)
    # [{ name, level: beginner/intermediate/advanced }]
    interests = models.JSONField(default=list)
    # ["AI", "Design", "Finance"]

    # Step 3 - Career Goals
    career_goal = models.CharField(max_length=255, blank=True)
    goal_type = models.CharField(
        max_length=20,
        choices=[('clear', 'I know what I want'), ('confused', 'I need guidance')],
        default='confused'
    )
    target_role = models.CharField(max_length=255, blank=True)
    target_timeline = models.CharField(max_length=100, blank=True)
    # e.g. "2 years", "as soon as possible"

    # Step 4 - Preferences
    location = models.CharField(max_length=100, blank=True)
    preferred_work_type = models.CharField(
        max_length=20,
        choices=[('remote', 'Remote'), ('onsite', 'On-site'), ('hybrid', 'Hybrid')],
        blank=True
    )
    budget = models.CharField(
        max_length=20,
        choices=[('free', 'Free only'), ('low', 'Under $100'), ('medium', 'Under $500'), ('high', 'No limit')],
        blank=True
    )

    # Onboarding tracking
    onboarding_step = models.IntegerField(default=0)  # 0-4
    onboarding_completed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email}'s profile"