from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import models
from django.contrib.auth.models import User
from analytics import models as alm
from content import models as cm
from user import models as um
# from .process import process as process
# from .process import learn as learn


# @receiver(post_save, sender=Song)
# def process_audio_file(sender, instance, created, **kwargs):
#     if created and instance.file_url:
#         print(f"Processing audio file {instance.file_url.path}")
#         features = process.extract_audio_features(instance.file_url.path)

#         if features:
#             SongFeature.objects.create(
#                 song=instance,
#                 tempo=features["tempo"],
#                 energy=features["energy"],
#                 loudness=features["loudness"],
#                 key=features["key"],
#                 mode=features["mode"],
#                 danceability=features["danceability"],
#                 valence=features["valence"],
#                 duration=features["duration"],
#             )

#         learn.cluster()


# @receiver(post_save, sender=um.User_Content_Interaction)
# def update_interact_data(sender, instance, created, **kwargs):
#     if created:
#         song_instance = instance.content_object
#         if not isinstance(song_instance, cm.Song):
#             print(f"Error: Interaction content_object is not a Song instance.")
#             return
#         song_data, data_created = alm.Content_Data.objects.get_or_create(
#             song=song_instance,
#             defaults={
#                 # "last_updated": timezone.now()
#             },
#         )
#         if instance.interaction_type == "Play":
#             song_data.play_count = models.F("play_count") + 1
#             alm.Song_Data.objects.filter(pk=song_data.pk).update(
#                 play_count=models.F("play_count") + 1,
#                 # last_updated=timezone.now()
#             )
#         elif instance.interaction_type == "Like":
#             song_data.like_count = models.F("like_count") + 1
#             alm.Song_Data.objects.filter(pk=song_data.pk).update(
#                 like_count=models.F("like_count") + 1,
#                 # last_updated=timezone.now()
#             )
#         elif instance.interaction_type == "Dislike":
#             song_data.dislike_count = models.F("dislike_count") + 1
#             alm.Song_Data.objects.filter(pk=song_data.pk).update(
#                 dislike_count=models.F("dislike_count") + 1,
#                 # last_updated=timezone.now()
#             )


# @receiver(post_save, sender=Radio)
# def create_user_recommend(sender, instance, created, **kwargs):
#     print(instance.seed)
#     if created and instance.seed:
#         learn.process_radio(instance.seed)
#     # if UserFeed.objects.get(user=instance.user).recommended_songs.count() == 0:
#     #     UserFeed.objects.get(user=instance.user).recommended_songs.set(
#     #         instance.results.all()
#     #     )
#     # if UserLibrary.objects.get(user=instance.user).followed_artists.count() != 0:
#     #     songs = Song.objects.filter(
#     #         artist__in=UserLibrary.objects.get(
#     #             user=instance.user
#     #         ).followed_artists.all()
#     #     )[:10]
#     #     UserFeed.objects.get(user=instance.user).latest_from_following.set(songs)
