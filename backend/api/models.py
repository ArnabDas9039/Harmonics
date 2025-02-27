from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


# Create your models here.
class Genre(models.Model):
    id = models.CharField(max_length=16, primary_key=True)
    name = models.CharField(max_length=64)
    cover_image_url = models.ImageField(
        upload_to="images/genre_cover_image",
        default="images/genre_cover_image/default_image.png",
    )

    def __str__(self):
        return f"{self.name}"


class Artist(models.Model):
    id = models.CharField(max_length=16, primary_key=True)
    name = models.CharField(max_length=64)
    bio = models.TextField()
    genre = models.ManyToManyField(Genre, related_name="artist_genres")
    profile_image_url = models.ImageField(
        upload_to="images/artist_profile_image",
        blank=False,
        default="images/artist_profile_image/default_image.png",
    )
    follower_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name}"


class Song(models.Model):
    id = models.CharField(max_length=16, primary_key=True)
    title = models.CharField(max_length=64)
    artist = models.ManyToManyField(Artist, related_name="songs")
    genre = models.ManyToManyField(Genre, related_name="song_genres")
    file_url = models.FileField(
        upload_to="tracks",
        blank=False,
        default="tracks/default.mp3",
    )
    cover_image_url = models.ImageField(
        upload_to="images/song_cover_image",
        blank=False,
        default="images/song_cover_image/default_image.png",
    )
    release_date = models.DateField()
    play_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.title}"


class Album(models.Model):
    id = models.CharField(max_length=16, primary_key=True)
    title = models.CharField(max_length=64)
    release_date = models.DateField()
    artist = models.ManyToManyField(Artist, related_name="artists")
    songs = models.ManyToManyField(Song, related_name="songs")
    cover_image_url = models.ImageField(
        upload_to="images/album_cover_image",
        blank=False,
        default="images/album_cover_image/default_image.png",
    )

    def __str__(self):
        return f"{self.title}"


class Playlist(models.Model):
    id = models.CharField(max_length=16, primary_key=True)
    name = models.CharField(max_length=64)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    songs = models.ManyToManyField(Song, related_name="tracks")
    created_at = models.DateTimeField()
    last_updated = models.DateTimeField()
    cover_image_url = models.ImageField(
        upload_to="images/playlist_cover_image",
        blank=False,
        default="images/playlist_cover_image/default_image.png",
    )
    private = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name}"


class UserListeningHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    listened_at = models.DateTimeField(auto_now_add=True)


class UserLibrary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    liked_songs = models.ManyToManyField(Song, blank=True, related_name="library_songs")
    liked_albums = models.ManyToManyField(
        Album, blank=True, related_name="library_albums"
    )
    followed_artists = models.ManyToManyField(
        Artist, blank=True, related_name="library_artists"
    )
    saved_playlists = models.ManyToManyField(
        Playlist, blank=True, related_name="library_playlists"
    )


class UserFeed(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quick_picks = models.ManyToManyField(Song, related_name="quick_picks")
    recommended_songs = models.ManyToManyField(Song, related_name="recommended_songs")
    latest_from_following = models.ManyToManyField(Song, related_name="latest_releases")
    mixes = models.ManyToManyField(Playlist, related_name="mixes")


class CreatedFeed(models.Model):
    # user_class = models.ForeignKey(UserClass, on_delete = models.CASCADE)
    # quick_picks = models.ManyToManyField(Song, related_name = "quick_picks")
    playlists = models.ManyToManyField(
        Playlist, blank=True, related_name="community_playlist"
    )
    season_playlist = models.ManyToManyField(
        Playlist, blank=True, related_name="season_playlist"
    )
    day_playlist = models.ManyToManyField(
        Playlist, blank=True, related_name="day_playlist"
    )
    event_playlist = models.ManyToManyField(
        Playlist, blank=True, related_name="event_playlist"
    )


class Radio(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    seed = models.ManyToManyField(Song, blank=False, related_name="seeds")
    results = models.ManyToManyField(Song, blank=False, related_name="results")


class Room(models.Model):
    room_id = models.CharField(max_length=20, primary_key=True)
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    current_song = models.ForeignKey(
        Song, blank=True, null=True, on_delete=models.CASCADE
    )
    participants = models.ManyToManyField(User, blank=True, related_name="participant")

    def __str__(self):
        return f"{self.room_id}"


class SongFeature(models.Model):
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    tempo = models.FloatField()
    energy = models.FloatField()
    loudness = models.FloatField()
    key = models.CharField(max_length=2)
    mode = models.IntegerField()
    danceability = models.FloatField()
    valence = models.FloatField()
    duration = models.FloatField()
    cluster_label = models.IntegerField(default=-1)

    def __str__(self):
        return f"{self.song.title}"
