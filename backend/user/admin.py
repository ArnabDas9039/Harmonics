from django.contrib import admin
from .models import User_Data, User_History, User_Library, User_Feed

myModels = [User_Data, User_History, User_Library, User_Feed]

admin.site.register(myModels)
