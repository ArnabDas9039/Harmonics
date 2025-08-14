from django.conf import settings
from django.utils.dateparse import parse_duration
from django.contrib.auth.models import User
from django.db import models, transaction
from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers
from .models import Playlist, Playlist_Song, Playlist_Collaborator
from content import serializers as cs
from content import models as cm
from analytics import models as alm
from engine import models as em
from analytics import serializers as als
from user import models as um
from user import serializers as us
import json


class ArtistSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        request = self.context.get("request")
        data = cs.ArtistSerializer(instance).data
        content_type = ContentType.objects.get(app_label="content", model="artist")
        song_content_type = ContentType.objects.get(app_label="content", model="song")
        try:
            analytics_instance = alm.Content_Data.objects.get(
                content_type=content_type, object_id=instance.id
            )
            analytics_data = als.AnalyticsSerializer(analytics_instance).data
            data["analytics"] = analytics_data
        except alm.Content_Data.DoesNotExist:
            data["analytics"] = None
        # if request.user.is_authenticated:
        #     try:
        for song in data["songs"]:
            song_instance = cm.Song.objects.get(public_id=song["public_id"])
            try:
                song_analytics_instance = alm.Content_Data.objects.get(
                    content_type=song_content_type, object_id=song_instance.id
                )
                song_analytics_data = als.AnalyticsSerializer(
                    song_analytics_instance
                ).data
                song["analytics"] = song_analytics_data
            except alm.Content_Data.DoesNotExist:
                song["analytics"] = None
        return data


class SongSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        request = self.context.get("request")
        data = cs.SongSerializer(instance, context=self.context).data
        content_type = ContentType.objects.get(app_label="content", model="song")
        try:
            analytics_instance = alm.Content_Data.objects.get(
                content_type=content_type, object_id=instance.id
            )
            analytics_data = als.AnalyticsSerializer(analytics_instance).data
            data["analytics"] = analytics_data
        except alm.Content_Data.DoesNotExist:
            data["analytics"] = None
        if request.user.is_authenticated:
            try:
                interactions = um.User_Content_Interaction.objects.filter(
                    content_type=content_type,
                    object_id=instance.id,
                    user=request.user,
                )
                interactions_data = ContentInteractionSerializer(
                    interactions, many=True
                ).data
                data["interactions"] = interactions_data
            except um.User_Content_Interaction.DoesNotExist:
                data["interactions"] = None
        return data


class AlbumSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        request = self.context.get("request")
        data = cs.AlbumSerializer(instance, context=self.context).data
        content_type = ContentType.objects.get(app_label="content", model="album")
        song_content_type = ContentType.objects.get(app_label="content", model="song")
        try:
            analytics_instance = alm.Content_Data.objects.get(
                content_type=content_type, object_id=instance.id
            )
            analytics_data = als.AnalyticsSerializer(analytics_instance).data
            data["analytics"] = analytics_data
        except alm.Content_Data.DoesNotExist:
            data["analytics"] = None
        if request.user.is_authenticated:
            try:
                interactions = um.User_Content_Interaction.objects.filter(
                    content_type=content_type,
                    object_id=instance.id,
                    user=request.user,
                )
                interactions_data = ContentInteractionSerializer(
                    interactions, many=True
                ).data
                data["interactions"] = interactions_data
            except um.User_Content_Interaction.DoesNotExist:
                data["interactions"] = None
        for song in data["songs"]:
            song_instance = cm.Song.objects.get(public_id=song["public_id"])
            try:
                song_analytics_instance = alm.Content_Data.objects.get(
                    content_type=song_content_type, object_id=song_instance.id
                )
                song_analytics_data = als.AnalyticsSerializer(
                    song_analytics_instance
                ).data
                song["analytics"] = song_analytics_data
            except alm.Content_Data.DoesNotExist:
                song["analytics"] = None
            if request.user.is_authenticated:
                try:
                    song_interactions = um.User_Content_Interaction.objects.filter(
                        content_type=song_content_type,
                        object_id=song_instance.id,
                        user=request.user,
                    )
                    song_interactions_data = ContentInteractionSerializer(
                        song_interactions, many=True
                    ).data
                    song["interactions"] = song_interactions_data
                except um.User_Content_Interaction.DoesNotExist:
                    song["interactions"] = None
        return data


class ContentInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = um.User_Content_Interaction
        fields = [
            "interaction_type",
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

    def validate_interaction_type(self, value):
        allowed = [
            "Like",
            "Dislike",
            "Play",
            "Save",
        ]
        if value not in allowed:
            raise serializers.ValidationError(
                f"'{value}' is not a valid interaction type. Choose from {allowed}."
            )
        return value

    def create(self, validated_data):
        request = self.context.get("request")
        if not request:
            raise serializers.ValidationError("")

        content_type = request.parser_context.get("kwargs", {}).get("content_type")
        object_id = request.parser_context.get("kwargs", {}).get("object_id")
        interaction_type = validated_data.get("interaction_type")

        if not content_type or not object_id:
            raise serializers.ValidationError("Missing content_type or object_id")

        if not interaction_type:
            raise serializers.ValidationError("Missing interaction_type")

        instance = um.User_Content_Interaction.objects.create(
            user=request.user,
            content_type=content_type,
            object_id=object_id,
            interaction_type=interaction_type,
        )
        return instance

    def delete(self):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated")

        content_type = request.parser_context.get("kwargs", {}).get("content_type")
        object_id = request.parser_context.get("kwargs", {}).get("object_id")
        interaction_type = self.validated_data.get("interaction_type")

        if not content_type or not object_id:
            raise serializers.ValidationError("Missing content_type or object_id")

        if not interaction_type:
            raise serializers.ValidationError("Missing interaction_type")

        deleted_count, _ = um.User_Content_Interaction.objects.filter(
            user=request.user,
            content_type=content_type,
            object_id=object_id,
            interaction_type=interaction_type,
        ).delete()

        if deleted_count == 0:
            raise serializers.ValidationError("No matching interaction to delete")

        return {"deleted": deleted_count}


class PlaylistSerializer(serializers.Serializer):
    public_id = serializers.CharField(read_only=True)
    owner = serializers.SerializerMethodField(read_only=True)
    # collaborator = serializers.SerializerMethodField()

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get("request")

        playlist_songs = (
            Playlist_Song.objects.filter(playlist=instance.id)
            .select_related("song")
            .order_by("order")
        )
        songs_with_order = []
        song_serializer = SongSerializer(context={"request": request})

        for playlist_song in playlist_songs:
            song_data = song_serializer.to_representation(playlist_song.song)
            song_data["order"] = playlist_song.order
            songs_with_order.append(song_data)

        rep["songs"] = songs_with_order
        return rep

    def get_thumbnail_url(self, obj):
        if obj.thumbnail_url:
            return f"{settings.MEDIA_FULL_URL}{obj.thumbnail_url}"
        return None

    def get_owner(self, obj):
        return obj.owner.username

    def get_collaborator(self, obj):
        users = Playlist_Collaborator.objects.filter(playlist=obj.id)
        if users is not None:
            return [
                {
                    "username": user.user.username,
                    "profile_image_url": f"{settings.MEDIA_FULL_URL}{user.user.profile_image_url}",
                }
                for user in users
            ]
        return None

    title = serializers.CharField(max_length=255)
    description = serializers.CharField()
    thumbnail_url = serializers.ImageField(required=False)
    duration = serializers.CharField(required=False)
    created_at = serializers.DateTimeField(required=False)
    last_updated = serializers.DateTimeField(required=False)
    privacy = serializers.CharField(max_length=10)
    songs = serializers.CharField(required=False, write_only=True)
    is_added = serializers.BooleanField(read_only=True, default=False)

    def validate_duration(self, value):
        data = parse_duration(value)
        if data is None:
            raise serializers.ValidationError("Invalid duration format.")
        return data

    def validate_songs(self, value):
        try:
            data = json.loads(value)
            if not isinstance(data, list):
                raise serializers.ValidationError("Expected a list of song entries.")
            for entry in data:
                if not isinstance(entry, dict):
                    raise serializers.ValidationError("Each song must be a dictionary.")
                if "public_id" not in entry:
                    raise serializers.ValidationError(
                        "Each song must include 'public_id'."
                    )
                order = entry.get("order")
                if order is not None and not isinstance(order, int):
                    raise serializers.ValidationError("Order must be an integer.")
            return data
        except json.JSONDecodeError:
            raise serializers.ValidationError("Invalid JSON format for songs.")

    def create(self, validated_data):
        request = self.context.get("request")
        with transaction.atomic():
            songs = validated_data.pop("songs", None)
            thumbnail = validated_data.get("thumbnail_url")

            playlist = Playlist.objects.create(
                title=validated_data["title"],
                description=validated_data["description"],
                thumbnail_url=thumbnail,
                duration=validated_data["duration"],
                owner=request.user,
                privacy=validated_data["privacy"],
            )

            if songs:
                for song_data in songs:
                    public_id = song_data.get("public_id")
                    order = song_data.get("order")
                    try:
                        song = cm.Song.objects.get(public_id=public_id)
                    except cm.Song.DoesNotExist:
                        raise serializers.ValidationError(
                            {
                                "song_ids": f"Song with public_id '{public_id}' does not exist."
                            }
                        )

                    if Playlist_Song.objects.filter(
                        playlist=playlist, song=song
                    ).exists():
                        raise serializers.ValidationError(
                            "This song already exists in the album."
                        )

                    if order is None:
                        last_index = (
                            Playlist_Song.objects.filter(playlist=playlist).aggregate(
                                max_order=models.Max("order")
                            )["max_order"]
                            or 0
                        )
                        order = last_index + 1

                    if Playlist_Song.objects.filter(
                        playlist=playlist, order=order
                    ).exists():
                        raise serializers.ValidationError(
                            f"A song already exists at {order} in the playlist."
                        )

                    Playlist_Song.objects.create(
                        song=song, playlist=playlist, order=order
                    )
        return playlist

    def update(self, instance, validated_data):
        with transaction.atomic():
            instance.title = validated_data.get("title", instance.title)
            instance.description = validated_data.get(
                "description", instance.description
            )

            new_thumbnail_url = validated_data.get("thumbnail_url")
            if new_thumbnail_url is not None:
                instance.thumbnail_url = new_thumbnail_url

            # instance.last_updated = timezone.now()
            instance.privacy = validated_data.get("privacy", instance.privacy)

            instance.save()

            if "songs" in validated_data:
                songs_data = validated_data.get("songs")
                Playlist_Song.objects.filter(playlist=instance).delete()

                if songs_data:
                    for song_entry in songs_data:
                        public_id = song_entry.get("public_id")
                        order = song_entry.get("order")
                        try:
                            song = cm.Song.objects.get(public_id=public_id)

                            if order is None:
                                last_song_in_playlist = Playlist_Song.objects.filter(
                                    playlist=instance
                                ).aggregate(max_order=models.Max("order"))
                                order = (last_song_in_playlist["max_order"] or 0) + 1
                            elif Playlist_Song.objects.filter(
                                playlist=instance, order=order
                            ).exists():
                                raise serializers.ValidationError(
                                    f"Cannot update: a song already exists at order {order} in playlist '{instance.title}'."
                                )
                            Playlist_Song.objects.create(
                                song=song, playlist=instance, order=order
                            )
                        except cm.Song.DoesNotExist:
                            raise serializers.ValidationError(
                                {
                                    "songs": f"Song with public_id '{public_id}' does not exist."
                                }
                            )

            return instance


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
        elif isinstance(obj.content_object, Playlist):
            return PlaylistSerializer(obj.content_object, context=self.context).data
        return None


class RadioSerializer(serializers.Serializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get("request")

        radio_queue = (
            em.Radio_Queue.objects.filter(radio=instance.id)
            .select_related("queue")
            .order_by("order")
        )
        songs_with_order = []
        song_serializer = SongSerializer(context={"request": request})

        for queue_song in radio_queue:
            song_data = song_serializer.to_representation(queue_song.queue)
            song_data["order"] = queue_song.order
            songs_with_order.append(song_data)

        rep["queue"] = songs_with_order
        return rep

    def get_thumbnail_url(self, obj):
        if obj.thumbnail_url:
            return f"{settings.MEDIA_FULL_URL}{obj.thumbnail_url}"
        return None

    public_id = serializers.CharField(read_only=True)
    title = serializers.CharField(required=False)
    thumbnail_url = serializers.ImageField(required=False)
    seeds = serializers.JSONField(required=False, write_only=True)
    queue = serializers.JSONField(required=False)
    created_at = serializers.DateTimeField(required=False)

    def validate_seeds(self, data):
        if not isinstance(data, list):
            raise serializers.ValidationError(
                "Expected a list of content_object entries."
            )
        for entry in data:
            if not isinstance(entry, dict):
                raise serializers.ValidationError(
                    "Each content_object must be a dictionary."
                )
            if "content_type" not in entry or "object_id" not in entry:
                raise serializers.ValidationError(
                    "Each content_object must include 'content_type' and 'object_id'."
                )
        return data

    def create(self, validated_data):
        with transaction.atomic():
            seeds = validated_data.pop("seeds", None)

            radio = em.Radio.objects.create(title="Radio")
            if seeds:
                for seed_data in seeds:
                    content_type = seed_data.get("content_type")
                    object_id = seed_data.get("object_id")
                    if content_type == "song":
                        try:
                            seed_song = cm.Song.objects.get(public_id=object_id)
                        except cm.Song.DoesNotExist:
                            raise serializers.ValidationError(
                                {
                                    "object_id": f"Song with id {object_id} does not exist."
                                }
                            )
                        em.Radio_Seed.objects.create(radio=radio, seed=seed_song)
                    if content_type == "album":
                        try:
                            seed_album = cm.Album.objects.get(public_id=object_id)
                        except cm.Album.DoesNotExist:
                            raise serializers.ValidationError(
                                {
                                    "object_id": f"Album with id {object_id} does not exist."
                                }
                            )

                        em.Radio_Seed.objects.create(radio=radio, seed=seed_song)
        return radio


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
