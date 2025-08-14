import secrets
import string
from django.db import models
from django.contrib.auth.models import User
import content.models as cm


# Create your models here.
def generate_random_id(length=10):
    characters = string.ascii_letters + string.digits
    return "".join(secrets.choice(characters) for i in range(length))


class Playlist(models.Model):
    id = models.BigAutoField(primary_key=True)
    public_id = models.CharField(max_length=10, unique=True, blank=True, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail_url = models.ImageField(
        upload_to="images/playlist_thumbnail",
        blank=False,
        default="images/playlist_thumbnail/default_image.png",
    )
    duration = models.DurationField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now_add=True)
    privacy = models.CharField(
        max_length=10, choices=[("Private", "Private"), ("Public", "Public")]
    )

    def __str__(self):
        return f"{self.public_id}"

    def save(self, *args, **kwargs):
        if not self.public_id:
            while True:
                random_id = generate_random_id()
                if not Playlist.objects.filter(public_id=random_id).exists():
                    self.public_id = random_id
                    break
        super().save(*args, **kwargs)


class Playlist_Song(models.Model):
    id = models.BigAutoField(primary_key=True)
    song = models.ForeignKey(cm.Song, on_delete=models.CASCADE)
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()

    class Meta:
        unique_together = ("song", "playlist")
        ordering = ["order"]


class Playlist_Collaborator(models.Model):
    id = models.BigAutoField(primary_key=True)
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    collaborator = models.ForeignKey(User, on_delete=models.CASCADE)


# class Radio(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     seed = models.ManyToManyField(Song, blank=False, related_name="seeds")
#     results = models.ManyToManyField(Song, blank=False, related_name="results")


# class Room(models.Model):
#     room_id = models.CharField(max_length=20, primary_key=True)
#     host = models.ForeignKey(User, on_delete=models.CASCADE)
#     current_song = models.ForeignKey(
#         Song, blank=True, null=True, on_delete=models.CASCADE
#     )
#     participants = models.ManyToManyField(User, blank=True, related_name="participant")

#     def __str__(self):
#         return f"{self.room_id}"
