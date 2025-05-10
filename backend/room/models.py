import secrets
import string
from django.db import models
from django.contrib.auth.models import User


def generate_random_id(length=4):
    characters = string.digits
    return "".join(secrets.choice(characters) for i in range(length))


class Room(models.Model):
    id = models.BigAutoField(primary_key=True)
    room_id = models.CharField(max_length=6, unique=True, blank=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    controls = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.room_id}"

    def save(self, *args, **kwargs):
        if not self.room_id:
            while True:
                random_id = generate_random_id()
                if not Room.objects.filter(room_id=random_id).exists():
                    self.room_id = random_id
                    break
        super().save(*args, **kwargs)


class Room_User(models.Model):
    id = models.BigAutoField(primary_key=True)
    room_id = models.ForeignKey(Room, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(
        max_length=10, choices=[("admin", "admin"), ("user", "user")], default="user"
    )
    joined_at = models.DateTimeField(auto_now_add=True)
