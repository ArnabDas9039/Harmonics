from rest_framework import serializers
from .models import Song_Data, Artist_Data


class SongAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song_Data
        fields = [
            "play_count",
            "like_count",
            "dislike_count",
        ]


class ArtistAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist_Data
        fields = ["follower_count"]
