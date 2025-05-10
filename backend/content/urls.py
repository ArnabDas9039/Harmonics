from django.urls import path
from . import views

urlpatterns = [
    path("song/<public_id>", views.SongView.as_view(), name="song_info"),
    path("artist/<public_id>", views.ArtistView.as_view(), name="artist_info"),
    path("album/<public_id>", views.AlbumView.as_view(), name="album_info"),
    path("search/", views.SearchView.as_view(), name="search"),
    # path("songs/top/", views.TopSongsListView.as_view(), name="top_songs"),
    # path("artists/top/", views.TopArtistListView.as_view(), name="top_artists"),
    # path("album/top/", views.TopSongsListView.as_view(), name="top_songs"),
]
