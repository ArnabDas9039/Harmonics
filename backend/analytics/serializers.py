from rest_framework import serializers
from .models import Content_Data


class AnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content_Data
        fields = [
            "play_count",
            "like_count",
            "dislike_count",
            "save_count",
        ]
