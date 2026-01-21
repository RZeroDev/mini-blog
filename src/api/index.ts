// Configuration globale de l'API
export const apiUrl = "https://mini-blog-api-hi0x.onrender.com/";

// Helper pour construire les URLs complètes
export const buildUrl = (endpoint: string): string => {
  return `${apiUrl}${endpoint}`;
};

// Configuration par défaut pour les requêtes
export const defaultHeaders = {
  "Content-Type": "application/json",
};

// Helper pour ajouter le token d'authentification aux headers
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return {
    ...defaultHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
