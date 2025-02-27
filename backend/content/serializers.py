from django.conf import settings
from rest_framework import serializers
from .models import (
    Genre,
    Artist,
    Song,
    Album,
    Artist_Song,
    Album_Song,
)


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name", "cover_image_url"]


class SongSerializer(serializers.ModelSerializer):
    # genre = GenreSerializer(many=True)
    artists = serializers.SerializerMethodField()
    albums = serializers.SerializerMethodField()

    class Meta:
        model = Song
        # fields = "__all__"
        # extra_fields = ["artists", "albums"]
        fields = [
            "public_id",
            "title",
            "file_url",
            "thumbnail_url",
            "release_date",
            "play_count",
            "like_count",
            "dislike_count",
            "duration",
            "is_explicit",
            "version",
            # "genre",
            "artists",
            "albums",
        ]

    def get_file_url(self, obj):
        if obj.file_url:
            return f"{settings.MEDIA_FULL_URL}{obj.file_url}"
        return None

    def get_thumbnail_url(self, obj):
        if obj.thumbnail_url:
            return f"{settings.MEDIA_FULL_URL}{obj.thumbnail_url}"
        return None

    def get_artists(self, obj):
        artists = Artist_Song.objects.filter(song_id=obj.id)
        if artists is not None:
            return [
                {
                    "public_id": artist.artist_id.public_id,
                    "name": artist.artist_id.name,
                    "profile_image_url": f"{settings.MEDIA_FULL_URL}{artist.artist_id.profile_image_url}",
                    "follower_count": artist.artist_id.follower_count,
                }
                for artist in artists
            ]
        return None

    def get_albums(self, obj):
        albums = Album_Song.objects.filter(song_id=obj.id)
        if albums is not None:
            return [
                {
                    "public_id": album.album_id.public_id,
                    "title": album.album_id.title,
                    "cover_image_url": f"{settings.MEDIA_FULL_URL}{album.album_id.cover_image_url}",
                    "release_date": album.album_id.release_date,
                }
                for album in albums
            ]
        return None


class AlbumSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True)

    class Meta:
        model = Album
        fields = [
            "public_id",
            "title",
            "thumbnail_urlrelease_date",
            "release_type",
            "play_count",
            "like_count",
            "dislike_count",
            "duration",
            "is_explicit",
            "artists",
            "songs",
        ]

    def get_thumbnail_url(self, obj):
        if obj.thumbnail_url:
            return f"{settings.MEDIA_FULL_URL}{obj.thumbnail_url}"
        return None

    def get_artists(self, obj):
        artists = obj.album_artist.filter(album_id=obj.id)
        if artists is not None:
            return [
                {
                    "public_id": artists.artist_id.public_id,
                    "name": artist.artist_id.name,
                    "profile_image_url": f"{settings.MEDIA_FULL_URL}{artist.artist_id.profile_image_url}",
                    "follower_count": artist.artist_id.follower_count,
                }
                for artist in artists
            ]
        return None


class ArtistSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()
    genre = GenreSerializer(many=True)
    songs = SongSerializer(many=True)
    albums = AlbumSerializer(many=True)

    class Meta:
        model = Artist
        fields = [
            "public_id",
            "name",
            "bio",
            "profile_image_url",
            "follower_count",
            "genre",
            "songs",
            "albums",
        ]

    def get_profile_image_url(self, obj):
        if obj.profile_image_url:
            return f"{settings.MEDIA_FULL_URL}{obj.profile_image_url}"
        return None
