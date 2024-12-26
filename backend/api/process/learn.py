import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from ..models import SongFeature, Song


def get_data():
    # Fetch data from the database and convert to pandas DataFrame
    features = SongFeature.objects.all()

    data = [
        {
            "song": feature.song.id,
            "tempo": feature.tempo,
            "energy": feature.energy,
            "loudness": feature.loudness,
            "key": feature.key,
            "mode": feature.mode,
            "danceability": feature.danceability,
            "valence": feature.valence,
            "duration": feature.duration,
            "cluster_label": feature.cluster_label,
        }
        for feature in features
    ]

    # Convert to pandas DataFrame
    df = pd.DataFrame(data)

    return df


def cluster():
    try:
        # Load the dataset
        data = get_data()

        # Prepare the features for clustering (numerical data only)
        numerical_data = data.drop(
            columns=["song"]
        )  # Drop non-numeric columns like 'song'

        # Ensure numerical data is scaled and clustered
        song_cluster_pipeline = Pipeline(
            [
                ("scaler", StandardScaler()),
                ("kmeans", KMeans(n_clusters=1, random_state=42)),
            ]
        )

        # Fit the pipeline
        song_cluster_pipeline.fit(numerical_data)
        song_cluster_labels = song_cluster_pipeline.predict(numerical_data)

        # Update the cluster labels in the database for each song
        for song_id, label in zip(data["song"], song_cluster_labels):
            SongFeature.objects.filter(song_id=song_id).update(cluster_label=label)

        return True
    except Exception as e:
        # print(f"Error clustering songs: {e}")
        return None


# Function to recommend songs
def recommend_songs(song_id, num_recommendations=10):
    # Fetch the data
    data = get_data()

    # Ensure the song exists in the DataFrame
    if song_id not in data["song"].values:
        raise ValueError("Invalid song ID")

    # Select numerical features for distance calculations
    # X = data.drop(columns=["song", "cluster_label"])
    X = data.select_dtypes(include=[np.number])

    # Get the cluster label for the input song
    song_row = data[data["song"] == song_id]
    song_cluster = song_row.iloc[0]["cluster_label"]

    # Filter songs within the same cluster
    cluster_songs = data[data["cluster_label"] == song_cluster]

    # Get the numerical features of the input song
    input_song_features = X.loc[song_row.index[0]].values

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


def process_radio(songs):
    # print(songs[0])
    return songs + recommend_songs(songs[0])
