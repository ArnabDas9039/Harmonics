from django.contrib import admin
from .models import Content_Data

myModels = [
    Content_Data,
]

admin.site.register(myModels)
