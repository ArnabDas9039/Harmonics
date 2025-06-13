from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


class Content_Data(models.Model):
    id = models.BigAutoField(primary_key=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")
    play_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)
    dislike_count = models.PositiveIntegerField(default=0)
    save_count = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now_add=True)
