from django.urls import path
from . import views
from studio import views as sv

urlpatterns = [
    path("profile/", views.UserView.as_view(), name="profile"),
    path("user/create/", views.CreateUserView.as_view(), name="user_create"),
    # path("search/", views.SearchView.as_view(), name="search"),
    path("feed/", views.UserFeedView.as_view(), name="feed"),
    path("song/<public_id>", views.SongView.as_view(), name="song_info"),
    path("artist/<public_id>", views.ArtistView.as_view(), name="artist_info"),
    path("album/<public_id>", views.AlbumView.as_view(), name="album_info"),
    path("interact/", views.CreateInteractView.as_view(), name="song_interaction"),
    path(
        "interact/delete/", views.DeleteInteractView2.as_view(), name="song_interaction"
    ),
    path(
        "interact/delete1/", views.DeleteInteractView.as_view(), name="song_interaction"
    ),
    path(
        "interact/toggle/", views.ToggleInteractView.as_view(), name="song_interaction"
    ),
    # path(
    #     "artist/interact/", views.ArtistInteractView.as_view(), name="song_interaction"
    # ),
    path("playlist/<public_id>", views.PlaylistView.as_view(), name="playlist_info"),
    # path(
    #     "playlist/create/",
    #     views.CreatePlaylistView.as_view(),
    #     name="playlist_create",
    # ),
    # path(
    #     "playlist/update/",
    #     views.UpdatePlaylistView.as_view(),
    #     name="playlist_uodate",
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
