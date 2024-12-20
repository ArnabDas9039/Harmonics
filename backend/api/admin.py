from django.contrib import admin
from .models import *
# Register your models here.

myModels = [
    Genre,
    Song,
    Artist,
    Album,
    Playlist,
    UserListeningHistory,
    UserLibrary,
    UserFeed,
    CreatedFeed,
    Radio,
]

admin.site.register(myModels)
