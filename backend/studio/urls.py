from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    # path("user/<username>", views.UserView.as_view(), name="profile"),
    # # path("search/", views.SearchView.as_view(), name="search"),
    path("song/<public_id>", views.SongInfoView.as_view(), name="song_info"),
    # path("artist/<public_id>", views.ArtistView.as_view(), name="artist_info"),
    # path("album/<public_id>", views.AlbumView.as_view(), name="album_info"),
]
