import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Interface pour l'utilisateur
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: {
    name: string;
    label: string;
  };
}

// Interface pour l'état d'authentification
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// État initial
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// Créer le slice d'authentification
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action pour se connecter
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Sauvegarder dans localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    // Action pour se déconnecter
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Supprimer du localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    // Action pour restaurer la session depuis localStorage
    restoreSession: (state) => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.user = user;
          state.token = token;
          state.isAuthenticated = true;
        } catch (error) {
          // Si erreur de parsing, nettoyer le localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    },
  },
});

// Exporter les actions
export const { setCredentials, logout, restoreSession } = authSlice.actions;

// Exporter le reducer
export default authSlice.reducer;
