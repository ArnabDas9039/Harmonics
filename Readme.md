# Project: Harmonics – A Music Streaming WebApp

Harmonics is a full-stack music streaming web application developed using Django, Django REST Framework (DRF), and React. This webapp incorporates modern web development practices, including JWT-based authentication, RESTful APIs, and dynamic frontend rendering.

### Video Demo: https://youtu.be/vcc98Xc2YS0

## Table of contents

- Technologies used
- Format of Project
- Features

## Technologies used

### Backend

- **Django REST Framework (DRF)**: RESTful APIs are designed for modularity and scalability.
- **JWT Authentication**: Tokens ensure secure and stateless authentication.
- **Database**: PostgreSQL is used for relational data management in deployment. For developement purposes and this demonstration uses the sqlite database of Django.
- **Librosa**: librosa is a python package for music and audio analysis. It provides the building blocks necessary to create music information retrieval systems.
- **Scikit-learn**: An intermediate level free tool for predictive Data Analysis and Machine Learning.

### Frontend

- **React**: Provides a modern, interactive user interface and dynamic webapps. In this project, we can find the use of States, Hooks, Contexts and etc.
- **React-Router-Dom**: Used in conjunction with react and provides better navigation and routing for webapps.
- **Axios**: Used for making API calls.

## Format of Project

The root directory of the project contains two directories - **backend** and **frontend**

### Backend

This is a Django Project created with the command -

```cmd
django-admin startproject backend
```

Next, the backend directory contains a **Django App** named **api** created using the command -

```cmd
python manage.py startapp api
```

The backend project directory has been further divided into apps which also has led to separation of different functionalities. The apps are listed below -

```bash
backend/
|---analytics/
|---api/
|---authentication/
|---content/
|---engine/
|---room/
|---studio/
|---user/
```

All the major serialization of data is concerned with api app for users of Harmonics and studio api for special access to users with Harmonics Studio.

```bash
api/
|---migrations/
|---static/
    |---images/
    |---tracks/
|---process/
    |---learn.py # for scikit-learn to analyze and predict similar songs
    |---process.py # for analyzing a .mp3 track to find different properties using librosa
|---admin.py # for database management by admin
|---apps.py
|---models.py # for all the object relational models
|---mypaginations.py # for reducing the data using paginations
|---serializers.py # for conversion of relational object to JSON data
|---signals.py # for processing of data after uploaded
|---urls.py # for all the api endpoints
|---views.py # for all the views
```

These are the all the important files that I have written to for the project.

### Frontend

This is a React-Vite app created using the command

```cmd
npm create vite@latest frontend -- --template react
```

The **src** directory under frontend contains all the code for Frontend.

```bash
src/
|---assets/
    |---fonts.css
|---components/
    |---Header.jsx # Common Header component for all pages
    |---Navigation.jsx # Component for the frontend navigation of the whole website
    |---PlayingWidget.jsx # The custom playback control widget for the website
    |---Thumbnails.jsx # The different thumbnails for songs, artists, albums, playlists etc.
    # other components
|---contexts/
    |---AuthContext.jsx # For storing information about user in the whole website
    |---PlayingContext.jsx # For storing playback settings across the whole website
|---pages/
    |---Home.jsx # displays the home page
    |---Explore.jsx # displays the explore page
    |---Info.jsx # displays the song, artist, album, playlist info page
    |---Library.jsx # displays the library page
    |---Login.jsx # frontend component of login
    |---Profile.jsx # displays the user profile page
    |---Register.jsx # frontend component for user registration
|---styles/ # styles for different pages and components
    |---color/
    |---General.css
    |---Feed.css
    |---Navigation.css
    |---PlayingWidget.css
    # other styles
|---api.js # for axios network handling
|---App.jsx # for defining routes, pages of the whole website
```

These are the all the important files that I have written to for the project.

## Features of Project

### 1. User Management

- **User Registration**: Users can create an account by providing their username, and password. Validation ensures unique usernames.
- **Login and Logout**: Secure user login is implemented using JWT (JSON Web Tokens) authentication. When an user requests for login, an ACCESS TOKEN and a REFRESH TOKEN is sent to the user. The ACCESS TOKEN expires after 30 minutes and hence the REFRESH TOKEN is required to obtain a new ACCESS TOKEN. The ACCESS TOKEN is mainly used as a Bearer to send authenticated and encrypted information to the server.

```Python
# serializers.py
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
```

### 2. Personalized Content

- **Music Analyzer**: Whenever a song is uploaded to the website, the song is run through a processing pipeline that analyzes the song and stores the features of a song like, tempo, mode, key, loudness, energy, valence and danceability. This properties are found out by analyzing .mp3 file using a Python library "LIBROSA". These features are later used to create recommendations for users.

```Python
# process.py
import librosa

def extract_audio_features(audio_file):
    y, sr = librosa.load(audio_file, sr=None)

    duration = librosa.get_duration(y=y, sr=sr)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    energy = np.sum(y**2) / len(y)
    # More features

    return {
        "tempo": tempo[0],
        "energy": energy,
        "duration": duration
        # More features
    }
```

- **Custom Feeds**: A music recommendation algorithm generates personalized music feeds based on user preferences and play history. Whenever a song is played, similar songs are queued to play next after that. These two features have been built using Python libraries like Scikit-learn, Numpy and Pandas.

```Python
# learn.py
# Function to cluster the data
def cluster():
    song_cluster_pipeline = Pipeline(
            [
                ("scaler", StandardScaler()),
                ("kmeans", KMeans(n_clusters=10, random_state=42)),
            ]
        )
    for song_id, label in zip(data["song"], song_cluster_labels):
            SongFeature.objects.filter(song_id=song_id).update(cluster_label=label)

# Function to recommend_songs
def recommend_songs(song_id, num_recommendations):
    # Calculate distances in original feature space
    cluster_songs = cluster_songs.assign(
        distance=cluster_songs.index.map(
            lambda idx: np.linalg.norm(X.loc[idx].values - input_song_features)
        )
    )
    # Sort by distance and return recommendations
    recommendations = cluster_songs.sort_values(by="distance").iloc[
        1 : num_recommendations + 1
    ]
    return recommendations["song"].values.tolist()
```

- **Library Page**: A library page is also available for every user that logs in their account. A library page consists of **Listening History**, **Liked Songs**, **Followed Artists** and **Created and Saved Playlists**.

```Python
# serializers.py
class LibrarySerializer(serializers.ModelSerializer):
    liked_songs = SongShortSerializer(many=True)
    followed_artists = ArtistShortSerializer(many=True)
    liked_albums = AlbumSerializer(many=True)
    saved_playlists = PlaylistSerializer(many=True)

    class Meta:
        model = UserLibrary
        fields = "__all__"
```

### 3. Information pages

- **Song Information**: Songs, its artists, albums, genre, play-count and similar songs can be found for each of the song.
- **Artist Information**: Artists, their bio, songs, genres and recent releases can be found for each artists.
- **Album Information**: Albums, its artists, songs, genre and similar information can be obtained for each album.
- **Playlist Information**: Playlists, its songs can be also be obtained for all private playlists that are saved or created.

All these above features are generated dynamically using JSON data that is provided from the server and then rendered by React frontend.

```Python
# urls.py
urlpatterns = [
    path("song/<public_id>", views.SongView.as_view(), name="song_info"),
    path("artist/<public_id>", views.ArtistView.as_view(), name="artist_info"),
    path("album/<public_id>", views.AlbumView.as_view(), name="album_info"),
    path("playlist/<pubilc_id>", views.PlaylistView.as_view(), name="playlist_info"),
    # Other endpoints
]
```

### 4. Analytics

Each song, album, playlist maintain a play count, like count, dislike, save count which updates dynamically as users play and interact with content. Also, every user content interaction be it like, dislike, play or save are saved in User_Content_Interaction model, which periodically counts and updates the analytics model.
Admins can access detailed analytics for the most played songs and user engagement metrics.

### 5. Harmonics Studio

### 6. Responsive Frontend

React ensures seamless navigation and a user-friendly interface. The music playback controls is completely custom built using Javascript and CSS for granular controls over its functionality and design. One can Play/Pause, Skip Next, Skip Previous and repeat songs as needed. Moreover, songs can be added to playlists and saved to library.

```Javascript
// PlayingWidget.jsx

function PlayingWidget() {
    // ... complete code of the Playback controls
}
```

## Planned Features

### 7. Trending and Explore

### 8. Upgraded Recommendation Engine with better Radio and user feed

### 9. Frontend for Studio

### 10. Lyrics editor for Studio

### 11. Karaoke mode with recording and uploading features

### 12. Listening Rooms

## API Endpoints

**1. User authentication:** located in backend/urls.py
| URLs | Description |
|:-----|:------------|
|**POST** /api/login/|Login with credentials.|
|**POST** /auth/refersh/|Refresh the TOKEN|
|**POST** /auth/logout/|Logout the user|
|**GET** /auth/check/|Check for authentication status|

**2. User Profile**
| URLs | Description |
|:-----|:------------|
|**GET** /api/users/`<username>`/|Retrieve any user's public information.|
|**PUT** /api/users/`<username>`/|Update user profile details.|

**3. User Content**
| URLs | Description |
|:-----|:------------|
|**GET** /api/user/recommendation/|Retrieve personalized music feed.|
|**GET** /api/general/|Retrieve information on top songs and artists.|
|**GET** /api/explore/|Retrieve search results and new content.|

**4. Information Content**
| URLs | Description |
|:-----|:------------|
|**GET** /api/song/`<song_id>`/|Retrieve song details.|
|**GET** /api/album/`<album_id>`/|Retrieve album details.|
|**GET** /api/album/`<artist_id>`/|Retrieve artist details.|
|**GET** /api/album/`<playlist_id>`/|Retrieve playlist details.|

**5. Playlist Update**
| URLs | Description |
|:-----|:------------|
|**GET** /api/playlists/feed/|Retrieve all user playlists.|
|**POST** /api/playlists/`<id>`/update/|Create a new playlist.|
|**PUT** /api/playlists/`<id>`/update/|Update playlist details.|
|**DELETE** /api/playlists/`<id>`/update/|Delete a playlist.|

## Insights

This is still in developement and can have many bugs that I, the developer may not have found out. I understand the need for improvement and you can advise me with comments on my Github Repository. Thank you!
