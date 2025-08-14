from django.shortcuts import render

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from studio import serializers as ss
from content import models as cm

# Create your views here.


class ContentView(generics.ListAPIView):
    serializer_class = ss.SongSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return cm.Song.objects.filter()


class SongView(generics.RetrieveAPIView):
    serializer_class = ss.SongSerializer
    permission_classes = [AllowAny]
    lookup_field = "public_id"

    def get_queryset(self):
        return cm.Song.objects.filter()


class ArtistView(generics.RetrieveAPIView):
    serializer_class = ss.ArtistSerializer
    permission_classes = [AllowAny]
    lookup_field = "public_id"

    def get_queryset(self):
        return cm.Artist.objects.filter()


class AlbumView(generics.RetrieveAPIView):
    serializer_class = ss.AlbumSerializer
    permission_classes = [AllowAny]
    lookup_field = "public_id"

    def get_queryset(self):
        return cm.Album.objects.filter()


class CreateSongView(generics.CreateAPIView):
    serializer_class = ss.SongSerializer
    permission_classes = [IsAuthenticated]
    queryset = cm.Song.objects.all()


class CreateArtistView(generics.CreateAPIView):
    serializer_class = ss.ArtistSerializer
    permission_classes = [IsAuthenticated]
    queryset = cm.Artist.objects.all()


class CreateAlbumView(generics.CreateAPIView):
    serializer_class = ss.AlbumSerializer
    permission_classes = [IsAuthenticated]
    queryset = cm.Album.objects.all()


class UpdateSongView(generics.UpdateAPIView):
    serializer_class = ss.SongSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "public_id"

    def get_queryset(self):
        return cm.Song.objects.filter()


class UpdateArtistView(generics.UpdateAPIView):
    serializer_class = ss.ArtistSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "public_id"

    def get_queryset(self):
        return cm.Artist.objects.filter()


class UpdateAlbumView(generics.UpdateAPIView):
    serializer_class = ss.AlbumSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "public_id"

    def get_queryset(self):
        return cm.Album.objects.filter()
