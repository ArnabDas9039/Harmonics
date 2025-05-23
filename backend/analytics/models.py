from django.db import models
from django.contrib.auth.models import User
from content.models import Artist, Song


class Artist_Data(models.Model):
    id = models.BigAutoField(primary_key=True)
    artist = models.ForeignKey(Artist, unique=True, on_delete=models.CASCADE)
    follower_count = models.PositiveIntegerField(default=0)


class Song_Data(models.Model):
    id = models.BigAutoField(primary_key=True)
    song = models.ForeignKey(Song, unique=True, on_delete=models.CASCADE)
    play_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)
    dislike_count = models.PositiveIntegerField(default=0)
