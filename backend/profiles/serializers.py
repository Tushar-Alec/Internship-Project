from rest_framework import serializers
from .models import Profile


class EducationItemSerializer(serializers.Serializer):
    degree = serializers.CharField()
    field = serializers.CharField()
    institution = serializers.CharField()
    year = serializers.CharField()
    status = serializers.ChoiceField(choices=['completed', 'ongoing', 'planned'])


class SkillItemSerializer(serializers.Serializer):
    name = serializers.CharField()
    level = serializers.ChoiceField(choices=['beginner', 'intermediate', 'advanced'])




class OnboardingStep1Serializer(serializers.ModelSerializer):
    education = EducationItemSerializer(many=True)

    class Meta:
        model = Profile
        fields = ('education',)

    def update(self, instance, validated_data):
        instance.education = validated_data.get('education', instance.education)
        instance.onboarding_step = max(instance.onboarding_step, 1)
        instance.save()
        return instance


class OnboardingStep2Serializer(serializers.ModelSerializer):
    skills = SkillItemSerializer(many=True)

    class Meta:
        model = Profile
        fields = ('skills', 'interests')

    def update(self, instance, validated_data):
        instance.skills = validated_data.get('skills', instance.skills)
        instance.interests = validated_data.get('interests', instance.interests)
        instance.onboarding_step = max(instance.onboarding_step, 2)
        instance.save()
        return instance


class OnboardingStep3Serializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('career_goal', 'goal_type', 'target_role', 'target_timeline')

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.onboarding_step = max(instance.onboarding_step, 3)
        instance.save()
        return instance


class OnboardingStep4Serializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('location', 'preferred_work_type', 'budget')

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.onboarding_step = 4
        instance.onboarding_completed = True
        instance.save()
        return instance


class ProfileSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    """Full profile — used for GET /profile/me/"""
    class Meta:
        model = Profile
        exclude = ('user',)