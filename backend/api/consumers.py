import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer

# Set up a logger
logger = logging.getLogger(__name__)


class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"room_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        is_playing = text_data_json["isPlaying"]
        current_time = text_data_json["currentTime"]
        current_song = text_data_json["currentSong"]

        # Log the received message
        logger.info(f"Received message: {is_playing}, {current_time}, {current_song}")

        # Print the received message to the console
        print(f"Received message: {is_playing}, {current_time}, {current_song}")

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "isPlaying": is_playing,
                "currentTime": current_time,
                "currentSong": current_song,
            },
        )

    async def chat_message(self, event):
        is_playing = event["isPlaying"]
        current_time = event["currentTime"]
        current_song = event["currentSong"]

        # Send message to WebSocket
        await self.send(
            text_data=json.dumps(
                {
                    "isPlaying": is_playing,
                    "currentTime": current_time,
                    "currentSong": current_song,
                }
            )
        )
