import pandas as pd
import numpy as np
import hashlib
from collections import defaultdict
from scipy.sparse import csr_matrix


class CollaborativeRecommender:
    def __init__(
        self,
        interactions_df,
        song_data_df,
        hash_space_users=16,
        hash_space_items=16,
    ):
        self.hash_space_users = hash_space_users
        self.hash_space_items = hash_space_items
        self.interactions_df = interactions_df
        self.song_data = song_data_df

        self.user_to_hashed_idx = self._hash_ids(
            self.interactions_df["user_id"].unique(), self.hash_space_users
        )
        self.item_to_hashed_idx = self._hash_ids(
            self.interactions_df["object_id"].unique(), self.hash_space_items
        )

        self.unique_users = self.interactions_df["user_id"].unique()
        self.unique_items = self.interactions_df["object_id"].unique()
        self.user_id_to_idx = {
            user_id: idx for idx, user_id in enumerate(self.unique_users)
        }
        self.item_id_to_idx = {
            item_id: idx for idx, item_id in enumerate(self.unique_items)
        }
        self.idx_to_user_id = {
            idx: user_id for user_id, idx in self.user_id_to_idx.items()
        }
        self.idx_to_item_id = {
            idx: item_id for item_id, idx in self.item_id_to_idx.items()
        }

        self.max_users_dim = len(self.unique_users)
        self.max_items_dim = len(self.unique_items)
        self.user_item_sparse_matrices = self._build_sparse_matrices()

    def _hash_ids(self, ids, hash_space_size):
        return {
            id_: int(hashlib.sha256(str(id_).encode("utf-8")).hexdigest(), 16)
            % hash_space_size
            for id_ in ids
        }

    def _build_sparse_matrices(self):
        interaction_value_map = {"play": 1, "like": 1, "save": 1, "dislike": -1}
        interaction_type_matrices = defaultdict(
            lambda: {"rows": [], "cols": [], "data": []}
        )

        for _, row in self.interactions_df.iterrows():
            user_hashed = self.user_id_to_idx[row["user_id"]]
            item_hashed = self.item_to_hashed_idx[row["object_id"]]
            interaction_type = row["interaction_type"]
            if interaction_type in interaction_value_map:
                interaction_type_matrices[interaction_type]["rows"].append(user_hashed)
                interaction_type_matrices[interaction_type]["cols"].append(item_hashed)
                interaction_type_matrices[interaction_type]["data"].append(
                    interaction_value_map[interaction_type]
                )

        user_item_sparse_matrices = {}

        for interact_type, matrix_data in interaction_type_matrices.items():
            if matrix_data["data"]:
                user_item_sparse_matrices[interact_type] = csr_matrix(
                    (matrix_data["data"], (matrix_data["rows"], matrix_data["cols"])),
                    shape=(self.max_users_dim, self.hash_space_items),
                )
        return user_item_sparse_matrices

    class FunkSVD:
        def __init__(
            self,
            n_factors=50,
            learning_rate=0.01,
            reg_param=0.02,
            n_epochs=20,
            random_state=42,
        ):
            self.n_factors = n_factors
            self.learning_rate = learning_rate
            self.reg_param = reg_param
            self.n_epochs = n_epochs
            self.random_state = random_state
            self.P = None
            self.Q = None
            self.global_mean = 0

        def fit(self, interactions_matrix):
            np.random.seed(self.random_state)
            num_users, num_items = interactions_matrix.shape
            self.global_mean = (
                interactions_matrix.data.mean()
                if interactions_matrix.data.size > 0
                else 0
            )
            self.P = np.random.normal(0, 0.1, (num_users, self.n_factors))
            self.Q = np.random.normal(0, 0.1, (num_items, self.n_factors))
            rows, cols = interactions_matrix.nonzero()
            ratings = interactions_matrix.data
            for epoch in range(self.n_epochs):
                shuffled_indices = np.arange(len(rows))
                np.random.shuffle(shuffled_indices)
                for idx in shuffled_indices:
                    u = rows[idx]
                    i = cols[idx]
                    r_ui = ratings[idx]
                    r_hat_ui = np.dot(self.P[u, :], self.Q[i, :]) + self.global_mean
                    error = r_ui - r_hat_ui
                    self.P[u, :] += self.learning_rate * (
                        error * self.Q[i, :] - self.reg_param * self.P[u, :]
                    )
                    self.Q[i, :] += self.learning_rate * (
                        error * self.P[u, :] - self.reg_param * self.Q[i, :]
                    )

        def predict(self, user_idx, item_idx):
            if user_idx >= self.P.shape[0] or item_idx >= self.Q.shape[0]:
                return self.global_mean
            return np.dot(self.P[user_idx, :], self.Q[item_idx, :]) + self.global_mean

    def recommend(
        self,
        target_user_id,
        interaction_type="like",
        n_factors=50,
        n_epochs=50,
        num_recommendations=20,
    ):
        if interaction_type not in self.user_item_sparse_matrices:
            raise ValueError(
                f"Interaction type '{interaction_type}' not found in data."
            )
        interaction_matrix = self.user_item_sparse_matrices[interaction_type]

        if target_user_id not in self.user_id_to_idx:
            raise ValueError(f"User '{target_user_id}' not found in data.")

        target_user_idx = self.user_id_to_idx[target_user_id]
        svd_model = self.FunkSVD(n_factors=n_factors, n_epochs=n_epochs)
        svd_model.fit(interaction_matrix)
        user_row_sparse = interaction_matrix[target_user_idx, :]
        user_interacted_item_indices = user_row_sparse.nonzero()[1].tolist()
        predicted_ratings_list = []

        for item_idx in range(self.max_items_dim):
            if item_idx not in user_interacted_item_indices:
                predicted_rating = svd_model.predict(target_user_idx, item_idx)
                predicted_ratings_list.append((item_idx, predicted_rating))

        predicted_ratings_list.sort(key=lambda x: x[1], reverse=True)
        top_n_recommendations_idx = predicted_ratings_list[:num_recommendations]

        recommendations = []
        for item_idx, estimated_rating in top_n_recommendations_idx:
            original_track_id = self.idx_to_item_id.get(item_idx)
            song_details = self.song_data[
                self.song_data["track_id"] == original_track_id
            ]
            if not song_details.empty:
                song = song_details.iloc[0].copy()
                song["rating"] = estimated_rating
                recommendations.append(song)
        return pd.DataFrame(recommendations)
