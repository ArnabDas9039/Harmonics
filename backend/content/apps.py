from django.apps import AppConfig
from django.conf import settings
from django.utils.module_loading import import_string


class ContentConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "content"

    # def ready(self):
    #     # Force re-import of custom default_storage
    #     from django.core.files.storage import default_storage as global_default_storage
    #     from django.core.files.storage import storages

    #     storage_class = import_string(settings.DEFAULT_FILE_STORAGE)
    #     storage_instance = storage_class()
    #     storages._storages["default"] = storage_instance  # override the default
    #     print("🔥 FirebaseStorage forced into default_storage")
