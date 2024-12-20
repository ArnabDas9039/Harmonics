from django.urls import path
from . import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path("general/", views.CreatedFeedView.as_view(), name="general"),
    path("explore/", views.ExploreView.as_view(), name="explore"),
    path("user/<username>", views.UserView.as_view(), name="profile"),
    path("user/recommendation/", views.UserFeedView.as_view(), name="recommendation"),
    path("song/<id>", views.SongView.as_view(), name="song_info"),
    path("songs/top/", views.TopSongsListView.as_view(), name="top_songs"),
    path("artists/top/", views.TopArtistListView.as_view(), name="top_artists"),
    path("artist/<id>", views.ArtistView.as_view(), name="artist_info"),
    path("album/<id>", views.AlbumView.as_view(), name="album_info"),
    path("playlist/<id>", views.PlaylistView.as_view(), name="playlist_info"),
    path(
        "playlist/<id>/update/",
        views.UpdatePlaylistView.as_view(),
        name="playlist_info",
    ),
    path("playlists/feed/", views.PlaylistListView.as_view(), name="from_community"),
    path(
        "library/playlists/",
        views.PlaylistListSecureView.as_view(),
        name="user_playlist",
    ),
    path("library/", views.LibraryView.as_view(), name="library"),
    path("library/post/", views.UpdateLibraryView.as_view(), name="library_post"),
    path("radio/", views.RadioView.as_view(), name="radio"),
    path("radio/post/", views.CreateRadioView.as_view(), name="radio_post"),
    path("history/post/", views.CreateHistoryView.as_view(), name="history_post"),
    path("history/get/", views.HistoryView.as_view(), name="history_get"),
    path("room/<room_id>", views.RoomView.as_view(), name="room_get"),
    path("room/<room_id>/update/", views.UpdateRoomView.as_view(), name="room_update"),
    path("room/create/", views.CreateRoomView.as_view(), name="room_create"),
    # path("notes/delete/<int:pk>", views.NoteDelete.as_view(), name="delete-note"),
] + staticfiles_urlpatterns()
