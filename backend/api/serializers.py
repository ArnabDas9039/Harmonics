from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class GenreShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ["id", "name"]


class ArtistShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ["id", "name", "profile_image_url"]


class SongShortSerializer(serializers.ModelSerializer):
    artist = ArtistShortSerializer(many=True)

    class Meta:
        model = Song
        fields = ["id", "title", "artist", "file_url", "cover_image_url"]


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = "__all__"


class ArtistSerializer(serializers.ModelSerializer):
    songs = SongShortSerializer(many=True)

    class Meta:
        model = Artist
        fields = "__all__"
        extra_fields = ["songs"]


class SongSerializer(serializers.ModelSerializer):
    artist = ArtistShortSerializer(many=True)
    genre = GenreShortSerializer(many=True)

    class Meta:
        model = Song
        fields = "__all__"


class AlbumSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(many=True)
    songs = SongSerializer(many=True)

    class Meta:
        model = Album
        fields = "__all__"


class PlaylistSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)
    songs = SongSerializer(many=True)

    class Meta:
        model = Playlist
        fields = "__all__"


class CreatePlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = ["songs"]
        read_only_fields = ["id", "user", "name"]


class LibrarySerializer(serializers.ModelSerializer):
    liked_songs = SongShortSerializer(many=True)
    followed_artists = ArtistShortSerializer(many=True)
    liked_albums = AlbumSerializer(many=True)
    saved_playlists = PlaylistSerializer(many=True)

    class Meta:
        model = UserLibrary
        fields = "__all__"


class CreateLibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLibrary
        fields = "__all__"
        read_only_fields = ["user"]


class CreatedFeedSerializer(serializers.ModelSerializer):
    playlists = PlaylistSerializer(many=True)
    season_playlist = PlaylistSerializer(many=True)
    day_playlist = PlaylistSerializer(many=True)
    event_playlist = PlaylistSerializer(many=True)

    class Meta:
        model = CreatedFeed
        fields = "__all__"


class UserFeedSerializer(serializers.ModelSerializer):
    quick_picks = SongSerializer(many=True)
    recommended_songs = SongSerializer(many=True)
    latest_from_following = SongSerializer(many=True)
    mixes = PlaylistSerializer(many=True)

    class Meta:
        model = UserFeed
        fields = "__all__"


class CreateHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserListeningHistory
        fields = "__all__"
        read_only_fields = ["user"]


class HistorySerializer(serializers.ModelSerializer):
    song = SongSerializer(many=False)

    class Meta:
        model = UserListeningHistory
        fields = "__all__"


class RadioSerializer(serializers.ModelSerializer):
    results = SongSerializer(many=True)

    class Meta:
        model = Radio
        fields = ["results"]


class CreateRadioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Radio
        fields = "__all__"
        read_only_fields = ["user"]
