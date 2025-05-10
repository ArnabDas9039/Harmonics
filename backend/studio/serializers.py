from django.contrib.auth.models import User

from rest_framework import serializers
from content import models as cm
from analytics import models as alm
from engine import models as em
from user import models as um

from content import serializers as cs
from analytics import serializers as als
from engine import serializers as es
from user import serializers as us


class SongSerializer(serializers.Serializer):
    def to_representation(self, instance):
        data = cs.SongSerializer(instance).data
        analytics_instance = alm.Song_Data.objects.get(song=instance.id)
        engine_instance = em.Song_Features.objects.get(song=instance.id)
        if analytics_instance:
            analytics_data = als.SongAnalyticsSerializer(analytics_instance).data
            data["analytics"] = analytics_data
        if engine_instance:
            features = es.SongFeaturesSerializer(engine_instance).data
            data["features"] = features
        return data


class AlbumSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = cs.AlbumSerializer(instance).data
        for song in data["songs"]:
            song_instance = cm.Song.objects.get(public_id=song["public_id"])
            analytics_instance = alm.Song_Data.objects.get(song=song_instance.id)
            engine_instance = em.Song_Features.objects.get(song=song_instance.id)
            if analytics_instance:
                analytics_data = als.SongAnalyticsSerializer(analytics_instance).data
                song["analytics"] = analytics_data
            if engine_instance:
                features = es.SongFeaturesSerializer(engine_instance).data
                song["features"] = features
        return data
