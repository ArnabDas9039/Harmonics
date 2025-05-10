from rest_framework import serializers
from .models import Song_Features


class SongFeaturesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song_Features
        fields = "__all__"
