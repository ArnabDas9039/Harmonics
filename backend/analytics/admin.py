from django.contrib import admin
from .models import Song_Data, Artist_Data

myModels = [Song_Data, Artist_Data]

admin.site.register(myModels)
