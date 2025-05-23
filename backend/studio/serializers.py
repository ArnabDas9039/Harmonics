from django.contrib.auth.models import User
from django.utils.dateparse import parse_duration
from rest_framework import serializers
from django.db import models, transaction
from content import models as cm
from analytics import models as alm
from engine import models as em
from user import models as um
from content import serializers as cs
from analytics import serializers as als
from engine import serializers as es
from user import serializers as us
import json


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


class SongSerializer(serializers.Serializer):
    def to_representation(self, instance):
        data = cs.SongSerializer(instance, context=self.context).data
        try:
            analytics_instance = alm.Song_Data.objects.get(song=instance.id)
            analytics_data = als.SongAnalyticsSerializer(analytics_instance).data
            data["analytics"] = analytics_data
        except alm.Song_Data.DoesNotExist:
            data["analytics"] = None
        return data

    title = serializers.CharField(max_length=255)
    file_url = serializers.FileField(required=False)
    thumbnail_url = serializers.ImageField(required=False)
    release_date = serializers.DateField()
    duration = serializers.CharField()
    is_explicit = serializers.BooleanField()
    version_id = serializers.IntegerField()
    genre_ids = serializers.CharField(required=False, write_only=True)
    artists = serializers.CharField(required=False, write_only=True)
    albums = serializers.CharField(required=False, write_only=True)
    refer_song_id = serializers.CharField(required=False, write_only=True)

    def validate_duration(self, value):
        data = parse_duration(value)
        if data is None:
            raise serializers.ValidationError("Invalid duration format.")
        return data

    def validate_artists(self, value):
        try:
            data = json.loads(value)
            if not isinstance(data, list):
                raise serializers.ValidationError("Expected a list of artist entries.")
            for entry in data:
                if not isinstance(entry, dict):
                    raise serializers.ValidationError(
                        "Each artist must be a dictionary."
                    )
                if "public_id" not in entry:
                    raise serializers.ValidationError(
                        "Each artist must include 'public_id'."
                    )
            return data
        except json.JSONDecodeError:
            raise serializers.ValidationError("Invalid JSON format for artists.")

    def validate_albums(self, value):
        try:
            data = json.loads(value)
            if not isinstance(data, list):
                raise serializers.ValidationError("Expected a list of album entries.")
            for entry in data:
                if not isinstance(entry, dict):
                    raise serializers.ValidationError(
                        "Each album must be a dictionary."
                    )
                if "public_id" not in entry:
                    raise serializers.ValidationError(
                        "Each album must include 'public_id'."
                    )
                order = entry.get("order")
                if order is not None and not isinstance(order, int):
                    raise serializers.ValidationError("Order must be an integer.")
            return data
        except json.JSONDecodeError:
            raise serializers.ValidationError("Invalid JSON format for albums.")

    def validate_genre_ids(self, value):
        try:
            genre_ids = json.loads(value)
            if not isinstance(genre_ids, list):
                raise serializers.ValidationError("Expected a list of Genre ids.")
            return genre_ids
        except json.JSONDecodeError:
            raise serializers.ValidationError("Invalid JSON format for genres.")

    def create(self, validated_data):
        with transaction.atomic():
            version_id = validated_data.pop("version_id")
            genre_ids = validated_data.pop("genre_ids", None)
            artists = validated_data.pop("artists", None)
            albums = validated_data.pop("albums", None)
            refer_song_id = validated_data.pop("refer_song_id", None)

            song = cm.Song.objects.create(
                title=validated_data["title"],
                file_url=validated_data["file_url"],
                thumbnail_url=validated_data["thumbnail_url"],
                release_date=validated_data["release_date"],
                duration=validated_data["duration"],
                is_explicit=validated_data["is_explicit"],
                version_id=version_id,
            )

            if artists:
                for artist_data in artists:
                    public_id = artist_data.get("public_id")
                    role = artist_data.get("role")

                    try:
                        artist = cm.Artist.objects.get(public_id=public_id)
                    except cm.Artist.DoesNotExist:
                        raise serializers.ValidationError(
                            {
                                "artist_ids": f"Artist with public_id '{public_id}' does not exist."
                            }
                        )

                    if role is not None:
                        cm.Artist_Song.objects.create(
                            song=song, artist=artist, role=role
                        )
                    else:
                        cm.Artist_Song.objects.create(song=song, artist=artist)

            if genre_ids:
                for genre_id in genre_ids:
                    cm.Genre_Song.objects.create(song=song, genre_id=genre_id)

            if albums:
                for album_data in albums:
                    public_id = album_data.get("public_id")
                    order = album_data.get("order")
                    try:
                        album = cm.Album.objects.get(public_id=public_id)
                    except cm.Album.DoesNotExist:
                        raise serializers.ValidationError(
                            {
                                "album_ids": f"Album with public_id '{public_id}' does not exist."
                            }
                        )

                    if cm.Album_Song.objects.filter(album=album, song=song).exists():
                        raise serializers.ValidationError(
                            "This song already exists in the album."
                        )

                    if order is None:
                        last_index = (
                            cm.Album_Song.objects.filter(album=album).aggregate(
                                max_order=models.Max("order")
                            )["max_order"]
                            or 0
                        )
                        order = last_index + 1

                    if cm.Album_Song.objects.filter(album=album, order=order).exists():
                        raise serializers.ValidationError(
                            f"A song already exists at {order} in the album."
                        )

                    cm.Album_Song.objects.create(song=song, album=album, order=order)

            if refer_song_id:
                try:
                    refer_song = cm.Song.objects.get(public_id=refer_song_id)
                    cm.Song_Version.objects.create(song=song, refer_song=refer_song)
                except cm.Song.DoesNotExist:
                    raise serializers.ValidationError(
                        {"refer_song_id": "Invalid refer_song_id"}
                    )

        return song

    def update(self, instance, validated_data):
        with transaction.atomic():
            instance.title = validated_data.get("title", instance.title)
            new_file_url = validated_data.get("file_url")
            if new_file_url is not None:
                instance.file_url = new_file_url

            new_thumbnail_url = validated_data.get("thumbnail_url")
            if new_thumbnail_url is not None:
                instance.thumbnail_url = new_thumbnail_url

            instance.release_date = validated_data.get(
                "release_date", instance.release_date
            )
            instance.duration = validated_data.get("duration", instance.duration)
            instance.is_explicit = validated_data.get(
                "is_explicit", instance.is_explicit
            )
            instance.version_id = validated_data.get("version_id", instance.version_id)

            instance.save()

            if "artists" in validated_data:
                artists_data = validated_data.get("artists")

                cm.Artist_Song.objects.filter(song=instance).delete()

                if artists_data:
                    for artist_entry in artists_data:
                        public_id = artist_entry.get("public_id")
                        role = artist_entry.get("role")
                        try:
                            artist = cm.Artist.objects.get(public_id=public_id)
                            cm.Artist_Song.objects.create(
                                song=instance, artist=artist, role=role
                            )
                        except cm.Artist.DoesNotExist:
                            raise serializers.ValidationError(
                                {
                                    "artists": f"Artist with public_id '{public_id}' does not exist."
                                }
                            )

            if "genre_ids" in validated_data:
                genre_ids_data = validated_data.get("genre_ids")
                # instance.genre_song_set.all().delete()
                cm.Genre_Song.objects.filter(song=instance).delete()

                if genre_ids_data:
                    for genre_id_val in genre_ids_data:
                        try:
                            genre = cm.Genre.objects.get(pk=genre_id_val)
                            cm.Genre_Song.objects.create(song=instance, genre=genre)
                        except cm.Genre.DoesNotExist:
                            raise serializers.ValidationError(
                                {
                                    "genre_ids": f"Genre with id '{genre_id_val}' does not exist."
                                }
                            )

            if "albums" in validated_data:
                albums_data = validated_data.get("albums")
                # instance.album_song_set.all().delete()
                cm.Album_Song.objects.filter(song=instance).delete()

                if albums_data:
                    for album_entry in albums_data:
                        public_id = album_entry.get("public_id")
                        order = album_entry.get("order")
                        try:
                            album = cm.Album.objects.get(public_id=public_id)

                            # Note: Duplicate song in album check might be less relevant here
                            # if we've just cleared all associations. However, order conflict is still important.
                            if order is None:
                                last_song_in_album = cm.Album_Song.objects.filter(
                                    album=album
                                ).aggregate(max_order=models.Max("order"))
                                order = (last_song_in_album["max_order"] or 0) + 1
                            elif cm.Album_Song.objects.filter(
                                album=album, order=order
                            ).exists():
                                # This check is important to prevent two songs at the same order after update
                                raise serializers.ValidationError(
                                    f"Cannot update: a song already exists at order {order} in album '{album.title}'."
                                )
                            cm.Album_Song.objects.create(
                                song=instance, album=album, order=order
                            )
                        except cm.Album.DoesNotExist:
                            raise serializers.ValidationError(
                                {
                                    "albums": f"Album with public_id '{public_id}' does not exist."
                                }
                            )

            # Handle Song Version (refer_song_id)
            if "refer_song_id" in validated_data:
                refer_song_id_data = validated_data.get("refer_song_id")
                # instance.song_version_set.all().delete()
                cm.Song_Version.objects.filter(song=instance).delete()

                if refer_song_id_data:
                    try:
                        refer_song = cm.Song.objects.get(public_id=refer_song_id_data)
                        cm.Song_Version.objects.create(
                            song=instance, refer_song=refer_song
                        )
                    except cm.Song.DoesNotExist:
                        raise serializers.ValidationError(
                            {
                                "refer_song_id": f"Song with public_id '{refer_song_id_data}' (for refer_song_id) does not exist."
                            }
                        )

            return instance


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
