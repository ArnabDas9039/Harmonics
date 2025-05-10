from django.shortcuts import render

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from studio import serializers as ss
from content import models as cm

# Create your views here.


class SongListView(generics.ListAPIView):
    serializer_class = ss.SongSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return cm.Song.objects.filter()


class SongInfoView(generics.RetrieveAPIView):
    serializer_class = ss.SongSerializer
    permission_classes = [AllowAny]
    lookup_field = "public_id"

    def get_queryset(self):
        return cm.Song.objects.filter(public_id=self.kwargs["public_id"])
