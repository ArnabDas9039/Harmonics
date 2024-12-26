import librosa
import numpy as np
import pandas as pd
from ..models import SongFeature


def extract_audio_features(audio_file):
    try:
        y, sr = librosa.load(audio_file, sr=None)

        duration = librosa.get_duration(y=y, sr=sr)
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        energy = np.sum(y**2) / len(y)
        rms = librosa.feature.rms(y=y)
        loudness = np.mean(rms)
        chroma = librosa.feature.chroma_cens(y=y, sr=sr)
        key_index = np.argmax(np.mean(chroma, axis=1))
        keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        key = keys[key_index]
        mode = 1 if np.mean(chroma[key_index]) > 0.5 else 0
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)
        danceability = np.mean(onset_env)
        valence = (tempo / 200) + (1 if mode == 1 else -1) * 0.5 + (energy / np.max(y))

        return {
            "tempo": tempo[0],
            "energy": energy,
            "loudness": loudness,
            "key": key,
            "mode": mode,
            "danceability": danceability,
            "valence": valence[0],
            "duration": duration,
            "cluster_label": 0,
        }

    except Exception as e:
        print(f"Error extracting features: {e}")
        return None
