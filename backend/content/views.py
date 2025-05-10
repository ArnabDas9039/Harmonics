from rest_framework import generics
from rest_framework.views import APIView
from .serializers import SongSerializer, ArtistSerializer, AlbumSerializer
from rest_framework.permissions import AllowAny
from .models import Song, Artist, Album


# Create your views here.
class ArtistView(generics.RetrieveAPIView):
    serializer_class = ArtistSerializer
    permission_classes = [AllowAny]
    lookup_field = "public_id"

    def get_queryset(self):
        return Artist.objects.all()


class SongView(generics.RetrieveAPIView):
    serializer_class = SongSerializer
    permission_classes = [AllowAny]
    lookup_field = "public_id"

    def get_queryset(self):
        return Song.objects.all()


class AlbumView(generics.RetrieveAPIView):
    serializer_class = AlbumSerializer
    permission_classes = [AllowAny]
    lookup_field = "public_id"

    def get_queryset(self):
        return Album.objects.all()


class SearchView(APIView):
    permission_classes = [AllowAny]

    # def get(self, request):
    #     query = request.query_params.get("query")
    #     songs = Song.objects.filter(title__icontains=query)
    #     artists = Artist.objects.filter(name__icontains=query)
    #     albums = Album.objects.filter(title__icontains=query)
    #     song_serializer = SongSerializer(songs, many=True)
    #     artist_serializer = ArtistSerializer(artists, many=True)
    #     album_serializer = AlbumSerializer(albums, many=True)
    #     return Response(
    #         {
    #             "songs": song_serializer.data,
    #             "artists": artist_serializer.data,
    #             "albums": album_serializer.data,
    #         }
    #     )
