from django.contrib import admin
from .models import (
    Genre,
    Version,
    Artist,
    Song,
    Song_Version,
    Artist_Genre,
    Genre_Song,
    Artist_Song,
    Album,
    Album_Artist,
    Album_Song,
)
# Register your models here.

myModels = [
    Genre,
    Version,
    Artist,
    Song,
    Song_Version,
    Artist_Genre,
    Genre_Song,
    Artist_Song,
    Album,
    Album_Artist,
    Album_Song,
]

admin.site.register(myModels)
