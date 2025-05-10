from django.urls import path
from . import views

urlpatterns = [
    path("profile/", views.UserView.as_view(), name="profile"),
    # path("search/", views.SearchView.as_view(), name="search"),
    path("feed/", views.UserFeedView.as_view(), name="feed"),
    path("song/<public_id>", views.SongView.as_view(), name="song_info"),
    path("artist/<public_id>", views.ArtistView.as_view(), name="artist_info"),
    path("album/<public_id>", views.AlbumView.as_view(), name="album_info"),
    # path("playlist/<id>", views.PlaylistView.as_view(), name="playlist_info"),
    # path(
    #     "playlist/<id>/update/",
    #     views.UpdatePlaylistView.as_view(),
    #     name="playlist_info",
    # ),
    path("library/post/", views.CreateLibraryView.as_view(), name="library_post"),
    path("library/", views.LibraryView.as_view(), name="library"),
    path("history/post/", views.CreateHistoryView.as_view(), name="history_post"),
    path("history/", views.HistoryView.as_view(), name="history_get"),
    # path("radio/<id>", views.RadioView.as_view(), name="radio"),
    # path("radio/post/", views.CreateRadioView.as_view(), name="radio_post"),
    # path("room/<room_id>", views.RoomView.as_view(), name="room_get"),
    # path("room/<room_id>/update/", views.UpdateRoomView.as_view(), name="room_update"),
    # path("room/create/", views.CreateRoomView.as_view(), name="room_create"),
]
