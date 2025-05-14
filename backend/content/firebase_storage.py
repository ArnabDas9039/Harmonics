import firebase_admin
from firebase_admin import credentials, storage
from django.core.files.storage import Storage
from django.core.files.base import ContentFile
from django.conf import settings


class FirebaseStorage(Storage):
    def __init__(self):
        if not firebase_admin._apps:
            cred = credentials.Certificate(settings.FIREBASE_CERT_PATH)
            firebase_admin.initialize_app(
                cred, {"storageBucket": settings.FIREBASE_STORAGE_BUCKET}
            )
            print("Firebase initialized")
        self.bucket = storage.bucket()

    def _open(self, name, mode="rb"):
        blob = self.bucket.blob(name)
        content = blob.download_as_bytes()
        return ContentFile(content)

    def _save(self, name, content):
        # print("Saving to Firebase")
        blob = self.bucket.blob(name)
        content_type = getattr(content, "content_type", None)
        # print(content_type)
        blob.upload_from_file(content.file, content_type=content_type)
        return name

    def exists(self, name):
        return self.bucket.blob(name).exists()

    def url(self, name):
        # print("Getting url")
        return self.bucket.blob(name).generate_signed_url(expiration=3600)

    def delete(self, name):
        blob = self.bucket.blob(name)
        blob.delete()

    def size(self, name):
        return self.bucket.blob(name).size
