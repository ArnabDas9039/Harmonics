from django.conf import settings
from rest_framework import serializers
from .models import (
    Genre,
    Artist,
    Song,
    Album,
    Genre_Song,
    Artist_Song,
    Album_Artist,
    Album_Song,
    Version,
)


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["name", "cover_image_url"]


class SongSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    genres = serializers.SerializerMethodField()
    version = serializers.SerializerMethodField()
    artists = serializers.SerializerMethodField()
    albums = serializers.SerializerMethodField()

    class Meta:
        model = Song
        fields = [
            "public_id",
            "title",
            "file_url",
            "thumbnail_url",
            "lyrics_url",
            "release_date",
            "duration",
            "is_explicit",
            "version",
            "genres",
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

    def get_lyrics_url(self, obj):
        if obj.lyrics_url:
            return f"{settings.MEDIA_FULL_URL}{obj.lyrics_url}"
        return None

    def get_genres(self, obj):
        genres = Genre_Song.objects.filter(song_id=obj.id)
        if genres is not None:
            return [genre.genre.name for genre in genres]
        return None

    def get_version(self, obj):
        version = Version.objects.get(id=obj.version_id)
        if version is not None:
            return version.name
        return None

    def get_artists(self, obj):
        artists = Artist_Song.objects.filter(song=obj.id)
        if artists is not None:
            return [
                {
                    "public_id": artist.artist.public_id,
                    "name": artist.artist.name,
                    "role": artist.role,
                    "profile_image_url": f"{settings.MEDIA_FULL_URL}{artist.artist.profile_image_url}",
                }
                for artist in artists
            ]
        return None

    def get_albums(self, obj):
        albums = Album_Song.objects.filter(song=obj.id)
        if albums is not None:
            return [
                {
                    "public_id": album.album.public_id,
                    "title": album.album.title,
                    "thumbnail_url": f"{settings.MEDIA_FULL_URL}{album.album.thumbnail_url}",
                    "release_date": album.album.release_date,
                    "is_explicit": album.album.is_explicit,
                }
                for album in albums
            ]
        return None


class AlbumSerializer(serializers.ModelSerializer):
    thumbnail_url = serializers.SerializerMethodField()
    songs = serializers.SerializerMethodField()
    artists = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = [
            "public_id",
            "title",
            "thumbnail_url",
            "release_date",
            "release_type",
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
        artists = Album_Artist.objects.filter(album=obj.id)
        if artists is not None:
            return [
                {
                    "public_id": artist.artist.public_id,
                    "name": artist.artist.name,
                    "role": artist.role,
                    "profile_image_url": f"{settings.MEDIA_FULL_URL}{artist.artist.profile_image_url}",
                }
                for artist in artists
            ]
        return None

    def get_songs(self, obj):
        songs = Album_Song.objects.filter(album=obj.id)
        if songs is not None:
            return [
                {
                    "order": song.order,
                    "public_id": song.song.public_id,
                    "title": song.song.title,
                    "file_url": f"{settings.MEDIA_FULL_URL}{song.song.file_url}",
                    "thumbnail_url": f"{settings.MEDIA_FULL_URL}{song.song.thumbnail_url}",
                    "lyrics_url": f"{settings.MEDIA_FULL_URL}{song.song.lyrics_url}",
                    "release_date": song.song.release_date,
                    "duration": song.song.duration,
                    "is_explicit": song.song.is_explicit,
                    "artists": [
                        {
                            "public_id": artist.artist.public_id,
                            "name": artist.artist.name,
                            "role": artist.role,
                        }
                        for artist in Artist_Song.objects.filter(song_id=song.song.id)
                    ]
                    if Artist_Song.objects.filter(song_id=song.song.id) is not None
                    else None,
                }
                for song in songs
            ]
        return None


class ArtistSerializer(serializers.ModelSerializer):
    profile_image_url = serializers.SerializerMethodField()
    genres = serializers.SerializerMethodField()
    songs = serializers.SerializerMethodField()
    albums = serializers.SerializerMethodField()

    class Meta:
        model = Artist
        fields = [
            "public_id",
            "name",
            "bio",
            "profile_image_url",
            "genres",
            "songs",
            "albums",
        ]

    def get_profile_image_url(self, obj):
        if obj.profile_image_url:
            return f"{settings.MEDIA_FULL_URL}{obj.profile_image_url}"
        return None

    def get_genres(self, obj):
        genres = Genre_Song.objects.filter(song=obj.id)
        if genres is not None:
            return [genre.genre.name for genre in genres]
        return None

    def get_songs(self, obj):
        songs = Artist_Song.objects.filter(artist_id=obj.id)
        if songs is not None:
            return [
                {
                    "public_id": song.song.public_id,
                    "title": song.song.title,
                    "file_url": f"{settings.MEDIA_FULL_URL}{song.song.file_url}",
                    "thumbnail_url": f"{settings.MEDIA_FULL_URL}{song.song.thumbnail_url}",
                    "lyrics_url": f"{settings.MEDIA_FULL_URL}{song.song.lyrics_url}",
                    "release_date": song.song.release_date,
                    "duration": song.song.duration,
                    "is_explicit": song.song.is_explicit,
                    "version": Version.objects.get(id=song.song.version_id).name,
                    "genres": [
                        genre.genre.name
                        for genre in Genre_Song.objects.filter(song_id=song.song.id)
                    ]
                    if Genre_Song.objects.filter(song_id=song.song.id) is not None
                    else None,
                    "artists": [
                        {
                            "public_id": artist.artist.public_id,
                            "name": artist.artist.name,
                            "role": artist.role,
                        }
                        for artist in Artist_Song.objects.filter(song_id=song.song.id)
                    ]
                    if Artist_Song.objects.filter(song_id=song.song.id) is not None
                    else None,
                }
                for song in songs
            ]
        return None

    def get_albums(self, obj):
        albums = Album_Artist.objects.filter(artist_id=obj.id)
        if albums is not None:
            return [
                {
                    "public_id": album.album.public_id,
                    "title": album.album.title,
                    "thumbnail_url": f"{settings.MEDIA_FULL_URL}{album.album.thumbnail_url}",
                    "release_date": album.album.release_date,
                    "release_type": album.album.release_type,
                    "duration": album.album.duration,
                    "is_explicit": album.album.is_explicit,
                    "artists": [
                        {
                            "public_id": artist.artist.public_id,
                            "name": artist.artist.name,
                            "role": artist.role,
                        }
                        for artist in Album_Artist.objects.filter(
                            album_id=album.album.id
                        )
                    ]
                    if Album_Artist.objects.filter(album_id=album.album.id) is not None
                    else None,
                }
                for album in albums
            ]
