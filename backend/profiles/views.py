from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import Profile
from .serializers import (
    OnboardingStep1Serializer,
    OnboardingStep2Serializer,
    OnboardingStep3Serializer,
    OnboardingStep4Serializer,
    ProfileSerializer,
)

STEP_SERIALIZERS = {
    1: OnboardingStep1Serializer,
    2: OnboardingStep2Serializer,
    3: OnboardingStep3Serializer,
    4: OnboardingStep4Serializer,
}


class ProfileMeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)


class OnboardingStepView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def patch(self, request, step):
        if step not in STEP_SERIALIZERS:
            return Response({'error': 'Invalid step'}, status=status.HTTP_400_BAD_REQUEST)

        profile, created = Profile.objects.get_or_create(user=request.user)

        # Prevent skipping steps
        if step > profile.onboarding_step + 1:
            return Response(
                {'error': f'Please complete step {profile.onboarding_step + 1} first'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer_class = STEP_SERIALIZERS[step]
        serializer = serializer_class(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            'message': f'Step {step} completed',
            'onboarding_step': profile.onboarding_step,
            'onboarding_completed': profile.onboarding_completed,
        })