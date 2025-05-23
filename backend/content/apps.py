from django.apps import AppConfig
from django.conf import settings
from django.utils.module_loading import import_string


class ContentConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "content"

    def ready(self):
        import content.signals
