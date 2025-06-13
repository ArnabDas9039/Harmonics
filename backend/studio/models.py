from django.db import models
from django.contrib.auth.models import User
import content.models as cm


# Create your models here.
class Song_Owner(models.Model):
    id = models.BigAutoField(primary_key=True)
    song = models.ForeignKey(cm.Song, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


# class Song_Collaborator(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     song = models.ForeignKey(cm.Song, on_delete=models.CASCADE)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     # permission


class Album_Owner(models.Model):
    id = models.BigAutoField(primary_key=True)
    album = models.ForeignKey(cm.Album, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


# class Album_Collaborator(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     album = models.ForeignKey(cm.Album, on_delete=models.CASCADE)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     # permission


class Artist_Owner(models.Model):
    id = models.BigAutoField(primary_key=True)
    artist = models.ForeignKey(cm.Artist, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
