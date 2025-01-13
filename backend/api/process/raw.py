import process.process as process
from ..models import SongFeature, Song


def raw():
    songs = Song.objects.all()
    # Print the result
    print(songs)

    # Extract features from audio files
    audio_files = []
    for song in songs:
        audio_file = "../../" + song["file_url"].replace("\\", "/")
        audio_files += [audio_file]

    print(audio_files)
    features = [process.extract_audio_features(file) for file in audio_files]
    print(features)

    SongFeature.objects.bulk_create(
        [
            SongFeature(
                song=song,
                tempo=feature["tempo"],
                energy=feature["energy"],
                loudness=feature["loudness"],
                key=feature["key"],
                mode=feature["mode"],
                danceability=feature["danceability"],
                valence=feature["valence"],
                duration=feature["duration"],
            )
            for song, feature in zip(songs, features)
        ]
    )
    print("Features extracted and saved to 'model'")
