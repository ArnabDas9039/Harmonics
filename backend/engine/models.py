import secrets
import string
from django.db import models
from content.models import Song


# Create your models here.
def generate_random_id(length=10):
    characters = string.ascii_letters + string.digits
    return "".join(secrets.choice(characters) for i in range(length))


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


class Radio(models.Model):
    id = models.BigAutoField(primary_key=True)
    public_id = models.CharField(max_length=10, unique=True, blank=True, editable=False)
    title = models.CharField(max_length=255)
    thumbnail_url = models.ImageField(
        upload_to="images/radio_thumbnail",
        blank=False,
        default="images/radio_thumbnail/default_image.png",
    )
    # owner =
    variables = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.public_id}"

    def save(self, *args, **kwargs):
        if not self.public_id:
            while True:
                random_id = generate_random_id()
                if not Radio.objects.filter(public_id=random_id).exists():
                    self.public_id = random_id
                    break
        super().save(*args, **kwargs)


class Radio_Seed(models.Model):
    id = models.BigAutoField(primary_key=True)
    radio = models.ForeignKey(Radio, on_delete=models.CASCADE)
    seed = models.ForeignKey(Song, on_delete=models.CASCADE)


class Radio_Queue(models.Model):
    id = models.BigAutoField(primary_key=True)
    radio = models.ForeignKey(Radio, on_delete=models.CASCADE)
    queue = models.ForeignKey(Song, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()
