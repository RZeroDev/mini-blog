import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

// Configurer le store Redux
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Types pour TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
