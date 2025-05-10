import secrets
import string
from django.db import models

# Release Type choices=["Single", "Album", "EP"]
# Version choices=["Acapella", "Acoustic", "Cover", "Extended Version", "Instrumental", "Live", "Original", "Remastered", "Remix", "Single Edit"]


def generate_random_id(length=10):
    characters = string.ascii_letters + string.digits
    return "".join(secrets.choice(characters) for i in range(length))


class Genre(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    cover_image_url = models.ImageField(
        upload_to="images/genre_cover_image",
        default="images/genre_cover_image/default_image.png",
    )

    def __str__(self):
        return f"{self.name}"


class Version(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name}"


class Artist(models.Model):
    id = models.BigAutoField(primary_key=True)
    public_id = models.CharField(max_length=10, unique=True, blank=True, editable=False)
    name = models.CharField(max_length=255)
    bio = models.TextField()
    profile_image_url = models.ImageField(
        upload_to="images/artist_profile_image",
        blank=False,
        default="images/artist_profile_image/default_image.png",
    )

    def __str__(self):
        return f"{self.public_id}"

    def save(self, *args, **kwargs):
        if not self.public_id:
            while True:
                random_id = generate_random_id()
                if not Artist.objects.filter(public_id=random_id).exists():
                    self.public_id = random_id
                    break
        super().save(*args, **kwargs)


class Song(models.Model):
    id = models.BigAutoField(primary_key=True)
    public_id = models.CharField(max_length=10, unique=True, blank=True, editable=False)
    title = models.CharField(max_length=255)
    file_url = models.FileField(
        upload_to="tracks",
        blank=False,
        default="tracks/default.mp3",
    )
    thumbnail_url = models.ImageField(
        upload_to="images/song_thumbnail",
        blank=False,
        default="images/song_thumbnail/default_image.png",
    )
    release_date = models.DateField()
    duration = models.DurationField()
    is_explicit = models.BooleanField(default=False)
    version = models.ForeignKey(Version, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.public_id}"

    def save(self, *args, **kwargs):
        if not self.public_id:
            while True:
                random_id = generate_random_id()
                if not Song.objects.filter(public_id=random_id).exists():
                    self.public_id = random_id
                    break
        super().save(*args, **kwargs)


class Song_Version(models.Model):
    id = models.BigAutoField(primary_key=True)
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name="song")
    refer_song = models.ForeignKey(
        Song, on_delete=models.CASCADE, related_name="refer_song"
    )


class Artist_Genre(models.Model):
    id = models.BigAutoField(primary_key=True)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)


class Genre_Song(models.Model):
    id = models.BigAutoField(primary_key=True)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)


class Artist_Song(models.Model):
    id = models.BigAutoField(primary_key=True)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    role = models.CharField(max_length=255)


class Album(models.Model):
    id = models.BigAutoField(primary_key=True)
    public_id = models.CharField(max_length=10, unique=True, blank=True, editable=False)
    title = models.CharField(max_length=255)
    thumbnail_url = models.ImageField(
        upload_to="images/album_thumbnail",
        blank=False,
        default="images/album_thumbnail/default_image.png",
    )
    release_date = models.DateField()
    release_type = models.CharField(
        max_length=10,
        choices=[("Single", "Single"), ("Album", "Album"), ("EP", "EP")],
    )
    duration = models.DurationField()
    is_explicit = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.public_id}"

    def save(self, *args, **kwargs):
        if not self.public_id:
            while True:
                random_id = generate_random_id()
                if not Song.objects.filter(public_id=random_id).exists():
                    self.public_id = random_id
                    break
        super().save(*args, **kwargs)


class Album_Song(models.Model):
    id = models.BigAutoField(primary_key=True)
    song = models.ForeignKey(Song, on_delete=models.CASCADE)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()


class Album_Artist(models.Model):
    id = models.BigAutoField(primary_key=True)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    role = models.CharField(max_length=255)
