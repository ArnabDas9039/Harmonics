import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const fetchQueue = createAsyncThunk(
  "/fetchQueue",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/queue");
      return response.data;
    } catch (error) {
      rejectWithValue(error.response?.data || "Failed to fetch queue");
    }
  }
);

const initialState = {
  isPlaying: false,
  playing: {},
  queue: [],
};

const playSlice = createSlice({
  name: "play",
  initialState,
  reducers: {
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setPlaying: (state, action) => {
      state.playing = action.payload;
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
    },
    addToQueue: (state, action) => {
      state.queue.push(action.payload);
    },
    clearQueue: (state, action) => {
      state.queue = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQueue.pending, (state) => {
        // state.loading = true;
        // state.error = null;
      })
      .addCase(fetchQueue.fulfilled, (state, action) => {
        state.queue = action.payload;
        // state.loading = false;
      })
      .addCase(fetchQueue.rejected, (state, action) => {
        // state.loading = false;
        // state.error = action.payload;
      });
  },
});

export const { setIsPlaying, setPlaying, setQueue, addToQueue, clearQueue } =
  playSlice.actions;
export default playSlice.reducer;
