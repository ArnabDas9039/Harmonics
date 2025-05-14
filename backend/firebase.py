import firebase_admin
from firebase_admin import credentials, storage
from django.conf import settings

# Initialize Firebase Admin SDK (do this once)
cred = credentials.Certificate(settings.FIREBASE_CERT_PATH)
firebase_admin.initialize_app(cred, {"storageBucket": settings.FIREBASE_STORAGE_BUCKET})


# def upload_media(file_path, destination_path):
#     bucket = storage.bucket()
#     blob = bucket.blob(destination_path)
#     blob.upload_from_filename(file_path)
#     return blob.public_url


# def get_media_url(file_path):
#     bucket = storage.bucket()
#     blob = bucket.blob(file_path)
#     return blob.public_url
