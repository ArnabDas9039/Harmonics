from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from engine.models import Group


class User_Data(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, unique=True, on_delete=models.CASCADE)
    profile_image_url = models.ImageField(
        upload_to="images/user_profile",
        blank=False,
        default="images/user_profile/default_image.png",
    )
    user_settings = models.JSONField(default=dict, blank=True)
    queue = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.user.username}"


class User_History(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")
    created_at = models.DateTimeField(auto_now_add=True)


class User_Library(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")
    created_at = models.DateTimeField(auto_now_add=True)


class User_Feed(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class User_Content_Interaction(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")
    interaction_type = models.CharField(
        max_length=10,
        choices=[
            ("Like", "Like"),
            ("Dislike", "Dislike"),
            ("Play", "Play"),
            ("Save", "Save"),
        ],
    )
    created_at = models.DateTimeField(auto_now_add=True)
