from django.db.models.signals import post_save
from django.dispatch import receiver
from . import models as cm
from analytics import models as am

from mutagen import File as AudioFile
import datetime


@receiver(post_save, sender=cm.Song)
def set_song(sender, instance, created, **kwargs):
    if created and instance.file_url:
        try:
            audio = AudioFile(instance.file_url.path)
            if audio and audio.info:
                duration_seconds = int(audio.info.length)
                instance.duration = datetime.timedelta(seconds=duration_seconds)
                instance.save(update_fields=["duration"])
        except Exception as e:
            print(f"[post_save set_song_duration] Error: {e}")

        am.Song_Data.objects.create(song=instance)

        # features = process.extract_audio_features(instance.file_url.path)

        # if features:
        #     SongFeature.objects.create(
        #         song=instance,
        #         tempo=features["tempo"],
        #         energy=features["energy"],
        #         loudness=features["loudness"],
        #         key=features["key"],
        #         mode=features["mode"],
        #         danceability=features["danceability"],
        #         valence=features["valence"],
        #         duration=features["duration"],
        #     )

        # learn.cluster()


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
# if UserFeed.objects.get(user=instance.user).recommended_songs.count() == 0:
#     UserFeed.objects.get(user=instance.user).recommended_songs.set(
#         instance.results.all()
#     )
# if UserLibrary.objects.get(user=instance.user).followed_artists.count() != 0:
#     songs = Song.objects.filter(
#         artist__in=UserLibrary.objects.get(
#             user=instance.user
#         ).followed_artists.all()
#     )[:10]
#     UserFeed.objects.get(user=instance.user).latest_from_following.set(songs)
