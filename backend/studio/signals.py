# from django.db.models.signals import post_save
# from django.dispatch import receiver

# # ...existing code...

# # Add these signal handlers after all model definitions:

# @receiver(post_save, sender=Song)
# def create_song_relations(sender, instance, created, **kwargs):
#     if created:
#         # Create analytics entry
#         from analytics.models import Song_Data
#         Song_Data.objects.create(song=instance)

#         # Create engine features entry
#         from engine.models import Song_Features
#         Song_Features.objects.create(song=instance)

# @receiver(post_save, sender=Artist)
# def create_artist_relations(sender, instance, created, **kwargs):
#     if created:
#         # Create analytics entry
#         from analytics.models import Artist_Data
#         Artist_Data.objects.create(artist=instance)

# @receiver(post_save, sender=Album)
# def create_album_relations(sender, instance, created, **kwargs):
#     if created:
#         # Calculate duration from associated songs
#         total_duration = datetime.timedelta()
#         album_songs = Album_Song.objects.filter(album=instance)
#         for album_song in album_songs:
#             total_duration += album_song.song.duration
#         instance.duration = total_duration
#         instance.save()
