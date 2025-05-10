from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Song_Data
from content.models import Song
from .serializers import SongAnalyticsSerializer
# from ..api.mypaginations import MyLimitOffsetPagination


class SongView(generics.RetrieveAPIView):
    serializer_class = SongAnalyticsSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        song_public_id = self.kwargs.get("song_public_id")
        song = Song.objects.get(public_id=song_public_id)
        if song is not None:
            return Song_Data.objects.get(song_id=song)
        return None


class TopSongsListView(generics.ListAPIView):
    serializer_class = SongAnalyticsSerializer
    permission_classes = [AllowAny]
    # pagination_class = MyLimitOffsetPagination

    def get_queryset(self):
        return Song.objects.all().order_by("-play_count")


# class TopArtistListView(generics.ListAPIView):
# serializer_class = ArtistSerializer
# permission_classes = [AllowAny]
# pagination_class = MyLimitOffsetPagination

# def get_queryset(self):
#     return Artist.objects.all().order_by("-follower_count")


# class TopAlbumListView(generics.ListAPIView):
# serializer_class = AlbumSerializer
# permission_classes = [AllowAny]
# pagination_class = MyLimitOffsetPagination

# def get_queryset(self):
#     return Album.objects.all()
