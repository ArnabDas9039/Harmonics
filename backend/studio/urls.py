from django.urls import path
from . import views

urlpatterns = [
    path("content/", views.ContentView.as_view(), name="content"),
    path("song/<public_id>", views.SongView.as_view(), name="song_info"),
    path("artist/<public_id>", views.ArtistView.as_view(), name="artist_info"),
    path("album/<public_id>", views.AlbumView.as_view(), name="album_info"),
    path("song/create/", views.CreateSongView.as_view(), name="song_info"),
    path("artist/post/", views.CreateArtistView.as_view(), name="artist_info"),
    path("album/post/", views.CreateAlbumView.as_view(), name="album_info"),
    path("song/<public_id>/update/", views.UpdateSongView.as_view(), name="song_info"),
    path("artist/edit/", views.UpdateArtistView.as_view(), name="artist_info"),
    path("album/edit/", views.UpdateAlbumView.as_view(), name="album_info"),
]
