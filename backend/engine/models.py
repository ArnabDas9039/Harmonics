from django.db import models
from content.models import Song
# Create your models here.

# class SongFeature(models.Model):
#     song = models.ForeignKey(Song, on_delete=models.CASCADE)
#     tempo = models.FloatField()
#     energy = models.FloatField()
#     loudness = models.FloatField()
#     key = models.CharField(max_length=2)
#     mode = models.IntegerField()
#     danceability = models.FloatField()
#     valence = models.FloatField()
#     duration = models.FloatField()
#     cluster_label = models.IntegerField(default=-1)

#     def __str__(self):
#         return f"{self.song.title}"


class Song_Features(models.Model):
    id = models.BigAutoField(primary_key=True)
    song = models.ForeignKey(Song, unique=True, on_delete=models.CASCADE)


class Group(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.group}"
