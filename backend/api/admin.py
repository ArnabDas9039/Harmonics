from django.contrib import admin
from .models import *
# Register your models here.

myModels = [
    #     Genre,
    #     Song,
    #     Artist,
    #     Album,
    Playlist,
    Playlist_Song,
    Playlist_Collaborator,
    #     UserListeningHistory,
    #     UserLibrary,
    #     UserFeed,
    #     CreatedFeed,
    #     Radio,
    #     Room,
    #     SongFeature,
]

admin.site.register(myModels)
