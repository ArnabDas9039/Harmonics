from django.conf import settings
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import User_Data


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = User_Data
        fields = ["username", "profile_image_url", "user_settings"]

    def get_username(self, obj):
        user = User.objects.get(id=obj.user_id)
        if user is not None:
            return user.username
        return None

    def get_profile_image_url(self, obj):
        if obj.profile_image_url:
            return f"{settings.MEDIA_FULL_URL}{obj.profile_image_url}"
        return None
