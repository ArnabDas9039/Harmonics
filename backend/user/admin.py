from django.contrib import admin
from .models import (
    User_Data,
    User_History,
    User_Library,
    User_Feed,
    User_Content_Interaction,
)

myModels = [User_Data, User_History, User_Library, User_Feed, User_Content_Interaction]

admin.site.register(myModels)
