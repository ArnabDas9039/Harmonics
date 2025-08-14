import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline


class ContentRecommender:
    def __init__(self, raw_data, num_clusters=15, drop_cols=None, random_state=8):
        self.data = raw_data.drop_duplicates(
            subset=["track_id"], keep="first"
        ).reset_index(drop=True)
        self.drop_cols = drop_cols or ["popularity", "duration_ms", "time_signature"]
        self.num_clusters = num_clusters
        self.random_state = random_state

        self.X = self.data.select_dtypes(np.number).drop(self.drop_cols, axis=1)
        self.number_cols = list(self.X.columns)
        self.pipeline = Pipeline(
            [
                ("scaler", StandardScaler()),
                (
                    "kmeans",
                    KMeans(
                        n_clusters=self.num_clusters, random_state=self.random_state
                    ),
                ),
            ]
        )
        self.pipeline.fit(self.X)
        self.cluster_labels = self.pipeline.predict(self.X)
        self.data["cluster_label"] = self.cluster_labels
        self.centroids = self._compute_cluster_centroids()

    def _compute_cluster_centroids(self):
        cluster_ids = np.unique(self.cluster_labels)
        centroids = {}
        for cluster_id in cluster_ids:
            members = self.X[self.cluster_labels == cluster_id]
            if len(members) > 0:
                centroids[cluster_id] = members.mean(axis=0)
        return centroids

    @property
    def labels(self):
        return self.cluster_labels

    @property
    def num_features(self):
        return len(self.number_cols)

    @property
    def cluster_sizes(self):
        unique, counts = np.unique(self.cluster_labels, return_counts=True)
        return dict(zip(unique, counts))

    def get_centroid(self, cluster_id):
        return self.centroids.get(cluster_id)

    def get_bias_aligned_clusters(self, input_features, bias_vector, top_k=5):
        aligned_scores = []
        bias_norm = np.linalg.norm(bias_vector)

        for cid, centroid in self.centroids.items():
            centroid_point = np.asarray(centroid)
            centroid_vector = centroid - input_features
            centroid_norm = np.linalg.norm(centroid_vector)

            indices = np.where(self.cluster_labels == cid)[0]
            cluster_points = self.X.iloc[indices].values

            deviations = np.linalg.norm(cluster_points - centroid_point, axis=1)
            mean_deviation = deviations.mean()
            if centroid_norm == 0:
                score = 1
            elif bias_norm == 0:
                score = 1 / abs(centroid_norm - mean_deviation)
            else:
                alignment = np.dot(centroid_vector, bias_vector) / (
                    centroid_norm * bias_norm
                )
                score = alignment / abs(centroid_norm - mean_deviation)

            aligned_scores.append((cid, score))

        aligned_scores.sort(key=lambda x: x[1], reverse=True)
        return [cid for cid, _ in aligned_scores[:top_k]]

    def get_bias_aligned_cluster_pool(self, input_features, bias_vector, min_size=20):
        selected_indices = []
        aligned_cluster_ids = self.get_bias_aligned_clusters(
            input_features, bias_vector
        )
        for cid in aligned_cluster_ids:
            indices = np.where(self.cluster_labels == cid)[0]
            selected_indices.extend(indices)
            if len(selected_indices) >= min_size:
                break
        return self.data.iloc[selected_indices]

    def biased_distance(self, row, input_song_features, weighted_bias):
        xi = self.X.loc[row.name].values
        delta = xi - input_song_features
        euclidean = np.linalg.norm(delta)
        if euclidean == 0 or np.linalg.norm(weighted_bias) == 0:
            return euclidean
        directional_bias = np.dot(delta, weighted_bias) / (
            euclidean * np.linalg.norm(weighted_bias)
        )
        return euclidean - directional_bias

    def recommend(
        self, song_id, weighted_bias=None, num_recommendations=20, pool_factor=5
    ):
        if weighted_bias is None:
            weighted_bias = np.zeros(len(self.number_cols))
        input_song_features = self.X.loc[song_id].values
        cluster_songs = self.get_bias_aligned_cluster_pool(
            input_song_features,
            weighted_bias,
            min_size=num_recommendations * pool_factor,
        )
        cluster_songs = cluster_songs.copy()
        cluster_songs["distance"] = cluster_songs.apply(
            lambda row: self.biased_distance(row, input_song_features, weighted_bias),
            axis=1,
        )
        recommendations = cluster_songs.sort_values(by="distance").iloc[
            1 : 1 + num_recommendations
        ]
        return recommendations
