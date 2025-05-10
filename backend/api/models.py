# from django.db import models
# from django.contrib.auth.models import User
# from django.contrib.contenttypes.fields import GenericForeignKey
# from django.contrib.contenttypes.models import ContentType


# # Create your models here.
# class Playlist(models.Model):
#     id = models.CharField(max_length=16, primary_key=True)
#     name = models.CharField(max_length=64)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     description = models.TextField()
#     songs = models.ManyToManyField(Song, related_name="tracks")
#     created_at = models.DateTimeField()
#     last_updated = models.DateTimeField()
#     cover_image_url = models.ImageField(
#         upload_to="images/playlist_cover_image",
#         blank=False,
#         default="images/playlist_cover_image/default_image.png",
#     )
#     private = models.BooleanField(default=False)

#     def __str__(self):
#         return f"{self.name}"


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
