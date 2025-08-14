import pandas as pd
from engines.cluster import ContentRecommender
from engines.filter import CollaborativeRecommender


class Engine:
    def __init__(self, raw_data, interaction_data):
        self.data = raw_data.drop_duplicates(
            subset=["track_id"], keep="first"
        ).reset_index(drop=True)
        self.user_content_interactions = interaction_data
        self.cluster_recommender = ContentRecommender(self.data.copy())
        self.filter_recommender = CollaborativeRecommender(
            self.user_content_interactions.copy(), self.data.copy()
        )

    def get_positive_interaction_count(self, user_id, interactions_df):
        positive_interaction_types = ["play", "like", "save"]
        user_interactions = interactions_df[interactions_df["user_id"] == user_id]
        positive_count = user_interactions[
            user_interactions["interaction_type"].isin(positive_interaction_types)
        ].shape[0]
        return positive_count

    def calculate_hybrid_weights(
        self, num_interactions, min_cf_interactions=100, max_cf_interactions=500
    ):
        if num_interactions <= min_cf_interactions:
            cf_weight = 0.05
        elif num_interactions >= max_cf_interactions:
            cf_weight = 0.65
        else:
            # Linear interpolation for CF weight
            cf_weight = (num_interactions - min_cf_interactions) / (
                max_cf_interactions - min_cf_interactions
            )

        cb_weight = 1.0 - cf_weight
        return cb_weight, cf_weight

    def recommend(
        self, user=None, song_id=None, num_recommendations=20, familiarity_bias=0.5
    ):
        num_positive_interactions = 0
        if user is not None:
            num_positive_interactions = self.get_positive_interaction_count(
                user, self.user_content_interactions.copy()
            )

        cb_weight, cf_weight = self.calculate_hybrid_weights(num_positive_interactions)

        # print(f"\n--- Hybrid Recommendation for User: {user} ---")
        # print(f"Positive Interactions: {num_positive_interactions}")
        # print(
        #     f"Weights: Content-Based={cb_weight:.2f}, Collaborative-Filtering={cf_weight:.2f}"
        # )

        cb_recs = pd.DataFrame(columns=["track_id", "score"])
        if cb_weight > 0 and song_id:
            cb_recs = self.cluster_recommender.recommend(
                song_id=song_id,
                # feature_biases=cb_feature_biases,
                num_recommendations=num_recommendations * 2,
            )
            # Normalize CB scores to 0-1 range
            if not cb_recs.empty:
                min_cb_score = cb_recs["distance"].max()
                max_cb_score = cb_recs["distance"].min()
                if max_cb_score == min_cb_score:
                    cb_recs["normalized_score"] = 0.5
                else:
                    cb_recs["normalized_score"] = (
                        cb_recs["distance"] - min_cb_score
                    ) / (max_cb_score - min_cb_score)
            else:
                print("Content-based system returned no recommendations.")
        elif not song_id:
            print("Warning: No seed_track_id provided. CB recommendations skipped.")

        cf_recs = pd.DataFrame(columns=["track_id", "rating"])
        if cf_weight > 0 and user:
            cf_recs = self.filter_recommender.recommend(
                user, num_recommendations=num_recommendations * 2
            )
            if cf_recs is not None and not cf_recs.empty:
                min_cf_score = cf_recs["rating"].min()
                max_cf_score = cf_recs["rating"].max()
                if max_cf_score == min_cf_score:
                    cf_recs["normalized_score"] = 0.5
                else:
                    cf_recs["normalized_score"] = (cf_recs["rating"] - min_cf_score) / (
                        max_cf_score - min_cf_score
                    )
            else:
                print("Collaborative filtering system returned no recommendations.")
        elif not user:
            print("Warning: No user provided. CF recommendations skipped.")

        # print(cf_recs[["track_name", "normalized_score"]])
        # if not cb_recs and not cf_recs:
        #     return

        combined_df = pd.merge(
            cb_recs[["track_id", "normalized_score"]].rename(
                columns={"normalized_score": "cb_norm_score"}
            ),
            cf_recs[["track_id", "normalized_score"]].rename(
                columns={"normalized_score": "cf_norm_score"}
            ),
            on="track_id",
            how="outer",
        )

        combined_df["cb_norm_score"] = combined_df["cb_norm_score"].fillna(0.0)
        combined_df["cf_norm_score"] = combined_df["cf_norm_score"].fillna(0.0)

        combined_df["final_score"] = (combined_df["cb_norm_score"] * cb_weight) + (
            combined_df["cf_norm_score"] * cf_weight
        )
        # print(combined_df.sort_values(by="final_score", ascending=False))

        user_interacted_songs = self.user_content_interactions[
            self.user_content_interactions["user_id"] == user
        ]["object_id"].tolist()

        combined_df["is_interacted"] = combined_df["track_id"].isin(
            user_interacted_songs
        )
        combined_df["adjusted_score"] = combined_df.apply(
            lambda row: row["final_score"] * familiarity_bias
            if row["is_interacted"]
            else row["final_score"] * (1 - familiarity_bias),
            axis=1,
        )

        if combined_df.empty:
            print("No new recommendations after filtering interacted songs.")

        combined_df = combined_df.sort_values(by="final_score", ascending=False).head(
            num_recommendations
        )

        # print(combined_df)
        recommended_songs_details = []
        for _, rec_row in combined_df.iterrows():
            track_id = rec_row["track_id"]
            hybrid_score = rec_row["final_score"]

            song_detail_row = self.data[self.data["track_id"] == track_id]
            if not song_detail_row.empty:
                song_details = song_detail_row.iloc[0].copy()
                song_details["hybrid_score"] = hybrid_score
                recommended_songs_details.append(song_details)
            else:
                print(
                    f"Warning: Track ID '{track_id}' not found in unique_songs_df. Skipping details."
                )

        recommendations = pd.DataFrame(recommended_songs_details)
        # print(recommendations.columns)
        # print(recommendations[["track_name", "hybrid_score"]])
        return recommendations


data = pd.read_csv("data_short.csv")
user_content_interactions = pd.read_csv("UserInteraction.csv")

recommender = Engine(data.copy(), user_content_interactions.copy())
recommendations = recommender.recommend(user="RandomExploreruser_10", song_id=120)

print(recommendations[["track_name", "hybrid_score"]])
