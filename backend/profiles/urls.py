from django.urls import path
from .views import ProfileMeView, OnboardingStepView

urlpatterns = [
    path('me/', ProfileMeView.as_view(), name='profile-me'),
    path('onboarding/<int:step>/', OnboardingStepView.as_view(), name='onboarding-step'),
]