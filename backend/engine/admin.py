from django.contrib import admin
from .models import Song_Features, Group
# Register your models here.

myModels = [Song_Features, Group]

admin.site.register(myModels)
