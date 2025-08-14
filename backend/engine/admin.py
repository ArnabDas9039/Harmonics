from django.contrib import admin
from .models import Song_Features, Group, Radio, Radio_Queue, Radio_Seed
# Register your models here.

myModels = [Song_Features, Group, Radio, Radio_Queue, Radio_Seed]

admin.site.register(myModels)
