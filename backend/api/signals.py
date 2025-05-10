# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from .models import Song, SongFeature, UserFeed, UserLibrary, Radio
# from django.contrib.auth.models import User
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


# @receiver(post_save, sender=User)
# def create_user_data(sender, instance, created, **kwargs):
#     if created:
#         songs = Song.objects.all()[:16]
#         UserFeed.objects.create(user=instance)
#         UserFeed.objects.get(user=instance).quick_picks.set(songs)
#         UserLibrary.objects.create(user=instance)


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
