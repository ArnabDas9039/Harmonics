import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import authReducer from "./authSlice";
import playReducer from "./playSlice";

const persistConfig = {
  key: "root",
  storage,
};

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     play: playReducer,
//   },
// });

const rootReducer = combineReducers({
  auth: authReducer,
  play: playReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
