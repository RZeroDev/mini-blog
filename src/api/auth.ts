import { buildUrl, defaultHeaders } from "./index";

// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: {
      name: string;
      label: string;
    };
  };
}

export interface AuthError {
  message: string;
  statusCode: number;
}

/**
 * Connexion d'un utilisateur
 * @param credentials - Email et mot de passe
 * @returns Promise avec le token et les données utilisateur
 */
export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const response = await fetch(buildUrl("auth/login"), {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error: AuthError = await response.json();
      throw new Error(error.message || "Erreur de connexion");
    }

    const data: LoginResponse = await response.json();

    // Stocker le token dans le localStorage
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Une erreur est survenue lors de la connexion");
  }
};

/**
 * Déconnexion de l'utilisateur
 */
export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Vérifier si l'utilisateur est connecté
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

/**
 * Récupérer l'utilisateur connecté depuis le localStorage
 */
export const getCurrentUser = (): LoginResponse["user"] | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};
