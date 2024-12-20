from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import *
from .mypaginations import MyLimitOffsetPagination
from django.shortcuts import get_object_or_404
from .radioengine import RadioCreate
import random
import logging

logger = logging.getLogger(__name__)

# Create your views here.
class CreatedFeedView(generics.ListAPIView):
    serializer_class = CreatedFeedSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return CreatedFeed.objects.all()
    
class UserFeedView(generics.ListAPIView):
    serializer_class = UserFeedSerializer
    permissions_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return UserFeed.objects.filter(user=user)

class ExploreView(generics.ListAPIView):
    serializer_class = GenreSerializer
    permission_classes = [AllowAny]
    pagination_class = MyLimitOffsetPagination

    def get_queryset(self):
        return Genre.objects.all()

class TopSongsListView(generics.ListAPIView):
    serializer_class = SongSerializer
    permission_classes = [AllowAny]
    pagination_class = MyLimitOffsetPagination

    def get_queryset(self):
        return Song.objects.all().order_by('-play_count')

class TopArtistListView(generics.ListAPIView):
    serializer_class = ArtistSerializer
    permission_classes = [AllowAny]
    pagination_class = MyLimitOffsetPagination

    def get_queryset(self):
        return Artist.objects.all().order_by('-follower_count')

class TopAlbumListView(generics.ListAPIView):
    serializer_class = AlbumSerializer
    permission_classes = [AllowAny]
    pagination_class = MyLimitOffsetPagination

    def get_queryset(self):
        return Album.objects.all()

class ArtistView(generics.RetrieveAPIView):
    serializer_class = ArtistSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'
    
    def get_queryset(self):
        return Artist.objects.all()
    
class SongView(generics.RetrieveAPIView):
    serializer_class = SongSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

    def get_queryset(self):
        return Song.objects.all()
    
class AlbumView(generics.RetrieveAPIView):
    serializer_class = AlbumSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'
    
    def get_queryset(self):
        return Album.objects.all()
    
class PlaylistView(generics.RetrieveAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'
    
    def get_queryset(self):
        return Playlist.objects.all()
    
class PlaylistListView(generics.ListAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        objects = list(Playlist.objects.filter(private = False))
        seed = self.request.GET.get('seed')
        if seed is not None:
            random.seed(seed)  # set seed
            random.shuffle(objects)  # randomize objects
            random.seed()  # reset seed
        return objects
    
class PlaylistListSecureView(generics.ListAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Playlist.objects.filter(user = user)
    
class UpdatePlaylistView(generics.UpdateAPIView):
    serializer_class = CreatePlaylistSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

    def put(self, request, id=None):
        # logger.debug('Request data: %s', request.data)
        try:
            playlist = self.get_object()
            # logger.debug('Playlist: %s', playlist.id)

            song_id = request.data.get('song_id')
            if not song_id:
                return Response({'detail': 'Song ID not provided.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                song = Song.objects.get(id=song_id)
                # logger.debug('Song retrieved: %s', song.id)
            except Song.DoesNotExist:
                return Response({'detail': 'Song not found.'}, status=status.HTTP_404_NOT_FOUND)

            # Add the new song to the playlist without replacing the entire set
            playlist.songs.add(song)
            playlist.save()

            serializer = self.serializer_class(playlist)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Playlist.DoesNotExist:
            return Response({'detail': 'Playlist not found.'}, status=status.HTTP_404_NOT_FOUND)

    def get_object(self):
        queryset = Playlist.objects.filter(user = self.request.user)
        obj = generics.get_object_or_404(queryset, id=self.kwargs['id'])
        # logger.debug('Retrieved playlist: %s', obj)
        return obj

class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    lookup_field = 'username'

    def get_queryset(self):
        return User.objects.all()

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class HistoryView(generics.ListAPIView):
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = MyLimitOffsetPagination
    
    def get_queryset(self):
        user = self.request.user
        return UserListeningHistory.objects.filter(user=user).order_by('-listened_at')
    
class CreateHistoryView(generics.CreateAPIView):
    serializer_class = CreateHistorySerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        # logger.debug('Request data: %s', request.data)
        serializer = CreateHistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # logger.error('Validation errors: %s', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LibraryView(generics.ListAPIView):
    serializer_class = LibrarySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return UserLibrary.objects.filter(user = user)
    
class CreateLibraryView(generics.CreateAPIView):
    serializer_class = UserLibrary
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        # logger.debug('Request data: %s', request.data)
        serializer = CreateLibrarySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # logger.error('Validation errors: %s', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateLibraryView(generics.UpdateAPIView):
    serializer_class = CreateLibrarySerializer
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        try:
            library = self.get_object()
        
            song_id = request.data.get('song_id')
            if not song_id:
                return Response({'detail': 'song not provided'}, status = status.HTTP_400_BAD_REQUEST)
            try:
                song = Song.objects.get(id = song_id)
            except Song.DoesNotExist:
                return Response({'detail': 'song not found'}, status = status.HTTP_404_NOT_FOUND)
            
            library.liked_songs.add(song)
            library.save()
            
            serializer = self.serializer_class(library)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except UserLibrary.DoesNotExist:
            return Response({'detail': 'Library not found'}, status = staus.HTTP_404_NOT_FOUND)
        
    def get_object(self):
        queryset = UserLibrary.objects.all()
        obj = generics.get_object_or_404(queryset, user=self.request.user)
        # logger.debug()
        return obj
    
class RadioView(generics.ListAPIView):
    serializer_class = RadioSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = MyLimitOffsetPagination
    
    def get_queryset(self):
        user = self.request.user
        return Radio.objects.filter(user = user)
    
class CreateRadioView(generics.CreateAPIView):
    serializer_class = CreateRadioSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        # queuemodifier = RadioCreate(data=request.data)
        serializer = CreateRadioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error('Validation errors: %s', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateRoomView(generics.CreateAPIView):
    serializer_class = CreateRoomSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        # logger.debug()
        serializer = CreateRoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(host=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error('Validation errors: %s', serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateRoomView(generics.UpdateAPIView):
    serializer_class = UpdateRoomSerializer
    permission_classes = [AllowAny]
    lookup_field = 'room_id'
    
    def put(self, request, room_id=None):
        try:
            room = self.get_object()
        
            song_id = request.data.get('song_id')
            if not song_id:
                return Response({'detail': 'song not provided'}, status = status.HTTP_400_BAD_REQUEST)
            try:
                song = Song.objects.get(id = song_id)
            except Song.DoesNotExist:
                return Response({'detail': 'song not found'}, status = status.HTTP_404_NOT_FOUND)
            
            room.current_song = song
            room.save()
            
            serializer = self.serializer_class(room)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Room.DoesNotExist:
            return Response({'detail': 'room not found'}, status = staus.HTTP_404_NOT_FOUND)
        
    def patch(self, request, room_id=None):
        # logger.debug()
        try:
            room = self.get_object()
            username = request.data.get('username')
            if not username:
                return Response({'detail': 'username not provided.'}, status = status.HTTP_400_BAD_REQUEST)
            
            try:
                user = User.objects.get(username = username)
                # logger.debug()
            except User.DoesNotExist:
                return Response({'detail': 'User not found.'}, status = status.HTTP_404_NOT_FOUND)
                
            room.participants.add(user)
            room.save()
            
            serializer = self.serializer_class(room)
            return Response(serializer.data, status = status.HTTP_200_OK)
        except Room.DoesNotExist:
            return Response({'detail': 'Room not found'}, status = status.HTTP_404_NOT_FOUND)
        
    def get_object(self):
        queryset = Room.objects.all()
        obj = generics.get_object_or_404(queryset, room_id=self.kwargs['room_id'])
        # logger.debug()
        return obj
    
class RoomView(generics.RetrieveAPIView):
    serializer_class = RoomSerializer
    permission_classes = [AllowAny]
    lookup_field = 'room_id'
    
    def get_object(self, *args, **kwargs):
        queryset = Room.objects.all()
        room = get_object_or_404(queryset, room_id=self.kwargs['room_id'])
        return room

    def get(self, request, *args, **kwargs):
        room = self.get_object()
        participants = room.participants.all()
        host = room.host
        user = self.request.user
        
        if user == host:
            serialized_room = self.get_serializer(room).data
            return Response(serialized_room, status = status.HTTP_200_OK)
        elif user in participants:
            serialized_room = self.get_serializer(room).data
            return Response(serialized_room, status = status.HTTP_200_OK)
        else:
            return Response({"detail": "User not a participant of the room."}, status = status.HTTP_403_FORBIDDEN)
