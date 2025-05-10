# from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import serializers
from content import serializers as cs
from content import models as cm
from analytics import models as alm
from engine import models as em
from analytics import serializers as als
from user import models as um


# class UserSerializer(serializers.Serializer):


# class GenreSerializer(serializers.ModelSerializer):
#     artist_genres = ArtistShortSerializer(many=True)

#     class Meta:
#         model = Genre
#         fields = "__all__"


class ArtistSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = cs.ArtistSerializer(instance).data
        analytics_instance = alm.Artist_Data.objects.get(artist=instance.id)
        if analytics_instance:
            analytics_data = als.ArtistAnalyticsSerializer(analytics_instance).data
            data["analytics"] = analytics_data
        for song in data["songs"]:
            song_instance = cm.Song.objects.get(public_id=song["public_id"])
            song_analytics_instance = alm.Song_Data.objects.get(song=song_instance.id)
            if song_analytics_instance:
                song_analytics_data = als.SongAnalyticsSerializer(
                    song_analytics_instance
                ).data
                song["analytics"] = song_analytics_data
        return data


class SongSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = cs.SongSerializer(instance, context=self.context).data
        analytics_instance = alm.Song_Data.objects.get(song=instance.id)
        if analytics_instance:
            analytics_data = als.SongAnalyticsSerializer(analytics_instance).data
            data["analytics"] = analytics_data
            return data
        return data


class AlbumSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = cs.AlbumSerializer(instance, context=self.context).data
        for song in data["songs"]:
            song_instance = cm.Song.objects.get(public_id=song["public_id"])
            analytics_instance = alm.Song_Data.objects.get(song=song_instance.id)
            if analytics_instance:
                analytics_data = als.SongAnalyticsSerializer(analytics_instance).data
                song["analytics"] = analytics_data
        return data


# class PlaylistSerializer(serializers.ModelSerializer):
#     user = UserSerializer(many=False)
#     songs = SongSerializer(many=True)

#     class Meta:
#         model = Playlist
#         fields = "__all__"


# class CreatePlaylistSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Playlist
#         fields = ["songs"]
#         read_only_fields = ["id", "user", "name"]


class LibrarySerializer(serializers.ModelSerializer):
    content_object = serializers.SerializerMethodField()
    content_type = serializers.SerializerMethodField()

    class Meta:
        model = um.User_Library
        fields = [
            "content_type",
            "content_object",
            "created_at",
        ]
        read_only_fields = ["created_at"]

    def get_content_type(self, obj):
        return obj.content_type.model

    def get_content_object(self, obj):
        if isinstance(obj.content_object, cm.Song):
            return SongSerializer(obj.content_object, context=self.context).data
        elif isinstance(obj.content_object, cm.Album):
            return AlbumSerializer(obj.content_object, context=self.context).data
        elif isinstance(obj.content_object, cm.Artist):
            return ArtistSerializer(obj.content_object, context=self.context).data
        return None

    def create(self, validated_data):
        request = self.context.get("request")
        if not request:
            raise serializers.ValidationError("No request found in context")

        content_type = request.parser_context.get("kwargs", {}).get("content_type")
        object_id = request.parser_context.get("kwargs", {}).get("object_id")

        if not content_type or not object_id:
            raise serializers.ValidationError("Missing content_type or object_id")

        instance = um.User_Library.objects.create(
            user=request.user, content_type=content_type, object_id=object_id
        )
        return instance


class HistorySerializer(serializers.ModelSerializer):
    content_object = serializers.SerializerMethodField()
    content_type = serializers.SerializerMethodField()

    class Meta:
        model = um.User_History
        fields = [
            "content_type",
            "content_object",
            "created_at",
        ]
        read_only_fields = ["created_at"]

    def get_content_type(self, obj):
        return obj.content_type.model

    def get_content_object(self, obj):
        if isinstance(obj.content_object, cm.Song):
            return SongSerializer(obj.content_object, context=self.context).data
        elif isinstance(obj.content_object, cm.Album):
            return AlbumSerializer(obj.content_object, context=self.context).data
        return None

    def create(self, validated_data):
        request = self.context.get("request")
        if not request:
            raise serializers.ValidationError("No request found in context")

        content_type = request.parser_context.get("kwargs", {}).get("content_type")
        object_id = request.parser_context.get("kwargs", {}).get("object_id")

        if not content_type or not object_id:
            raise serializers.ValidationError("Missing content_type or object_id")

        instance = um.User_History.objects.create(
            user=request.user, content_type=content_type, object_id=object_id
        )
        return instance


class GroupedFeedSerializer(serializers.ListSerializer):
    def to_representation(self, instances):
        request = self.context.get("request")
        limit = int(request.query_params.get("limit", 0)) if request else 0
        offset = int(request.query_params.get("offset", 0)) if request else 0
        filter_groups = (
            request.query_params.get("group", None).split(",")
            if request and request.query_params.get("group")
            else None
        )
        order = request.query_params.get("order", "desc").lower()

        grouped = {}
        # print(type(instances))
        for instance in instances:
            group = instance.group.group if instance.group else "other"
            if filter_groups and group not in filter_groups:
                continue
            if group not in grouped:
                grouped[group] = []
            grouped[group].append(self.child.to_representation(instance))

        result = []
        for group, items in grouped.items():
            if order == "asc":
                items = sorted(items, key=lambda x: x.get("created_at"))
            else:
                items = sorted(items, key=lambda x: x.get("created_at"), reverse=True)
            paginated_items = (
                items[offset : offset + limit] if limit else items[offset:]
            )

            result.append(
                {
                    "group": group,
                    "items": paginated_items,
                    "count": len(items),
                }
            )
        return result


class UserFeedSerializer(serializers.ModelSerializer):
    content_object = serializers.SerializerMethodField()
    content_type = serializers.SerializerMethodField()

    class Meta:
        model = um.User_Feed
        fields = [
            "content_type",
            "content_object",
            "created_at",
        ]
        read_only_fields = ["created_at"]
        list_serializer_class = GroupedFeedSerializer

    def get_group(self, obj):
        group = em.Group.objects.get(id=obj.group.id)
        if group is not None:
            return f"{group.group}"

    def get_content_type(self, obj):
        return obj.content_type.model

    def get_content_object(self, obj):
        if isinstance(obj.content_object, cm.Song):
            return SongSerializer(obj.content_object, context=self.context).data
        elif isinstance(obj.content_object, cm.Album):
            return AlbumSerializer(obj.content_object, context=self.context).data
        elif isinstance(obj.content_object, cm.Artist):
            return ArtistSerializer(obj.content_object, context=self.context).data
        return None


# class RadioSerializer(serializers.ModelSerializer):
#     results = SongSerializer(many=True)

#     class Meta:
#         model = Radio
#         fields = "__all__"


# class CreateRadioSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Radio
#         fields = "__all__"
#         read_only_fields = ["user"]


# class RoomSerializer(serializers.ModelSerializer):
#     current_song = SongShortSerializer(many=False)
#     host = UserSerializer(many=False)
#     participants = UserSerializer(many=True)

#     class Meta:
#         model = Room
#         fields = "__all__"
#         read_only_fields = ["host"]


# class CreateRoomSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Room
#         fields = "__all__"
#         read_only_fields = ["host"]


# class UpdateRoomSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Room
#         fields = "__all__"
#         read_only_fields = ["host", "room_id"]

# [{'group': 'Recommended', 'items': [{'content_type': 'song', 'content_object': {'public_id': 'BlRgPJlHGH', 'title': 'Unity', 'file_url': 'http://127.0.0.1:8000/media/tracks/Unity__lxS-x7DACQ_140_AiL4Vbt.mp3', 'thumbnail_url': 'http://127.0.0.1:8000/media/images/song_thumbnail/unity_TC0FsME.jpg', 'release_date': '2025-03-09', 'duration': '00:00:12', 'is_explicit': False, 'version': 'Original', 'genres': ['Pop', 'Electronic'], 'artists': [{'public_id': 'u9iTzTGZOO', 'name': 'Alan Walker', 'role': 'Artist', 'profile_image_url': 'http://127.0.0.1:8000/media/images/artist_profile_image/alone.jpg'}], 'albums': [{'public_id': 'LfoXlvL8ur', 'title': 'Unity', 'thumbnail_url': 'http://127.0.0.1:8000/media/images/album_thumbnail/unity.jpg', 'release_date': datetime.date(2025, 3, 9), 'is_explicit': False}], 'analytics': {'play_count': 0, 'like_count': 0, 'dislike_count': 0}}, 'created_at': '2025-05-05T10:41:20.018510Z'}, {'content_type': 'album', 'content_object': {'public_id': 'LfoXlvL8ur', 'title': 'Unity', 'thumbnail_url': 'http://127.0.0.1:8000/media/images/album_thumbnail/unity.jpg', 'release_date': '2025-03-09', 'release_type': 'single', 'duration': '00:00:12', 'is_explicit': False, 'artists': [{'public_id': 'u9iTzTGZOO', 'name': 'Alan Walker', 'role': 'Artist', 'profile_image_url': 'http://127.0.0.1:8000/media/images/artist_profile_image/alone.jpg'}], 'songs': [{'order': 1, 'public_id': 'BlRgPJlHGH', 'title': 'Unity', 'file_url': 'http://127.0.0.1:8000/media/tracks/Unity__lxS-x7DACQ_140_AiL4Vbt.mp3', 'thumbnail_url': 'http://127.0.0.1:8000/media/images/song_thumbnail/unity_TC0FsME.jpg', 'release_date': datetime.date(2025, 3, 9), 'duration': datetime.timedelta(seconds=12), 'is_explicit': False, 'artists': [{'public_id': 'u9iTzTGZOO', 'name': 'Alan Walker', 'role': 'Artist'}], 'analytics': {'play_count': 0, 'like_count': 0, 'dislike_count': 0}}]}, 'created_at': '2025-05-05T14:56:15.598802Z'}]}]
