import { buildUrl, getAuthHeaders } from "./index";

// Types pour les catégories
export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  image: File;
}

export interface UpdateCategoryDto {
  name?: string;
  image?: File;
}

/**
 * Récupérer toutes les catégories
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(buildUrl("categories"), {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des catégories");
    }

    const result = await response.json();
    
    // Format de réponse: { statusCode, data: { items, meta }, message }
    if (result.data && result.data.items && Array.isArray(result.data.items)) {
      return result.data.items;
    }
    
    // Autres formats possibles
    if (Array.isArray(result)) {
      return result;
    }
    
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    
    console.error("Format de réponse inattendu:", result);
    return [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Une erreur est survenue");
  }
};

/**
 * Récupérer une catégorie par ID
 */
export const getCategory = async (id: string): Promise<Category> => {
  try {
    const response = await fetch(buildUrl(`categories/${id}`), {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Catégorie introuvable");
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Une erreur est survenue");
  }
};

/**
 * Créer une nouvelle catégorie
 */
export const createCategory = async (
  categoryData: CreateCategoryDto
): Promise<Category> => {
  try {
    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("image", categoryData.image);

    const token = localStorage.getItem("token");
    const response = await fetch(buildUrl("categories"), {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors de la création");
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Une erreur est survenue");
  }
};

/**
 * Mettre à jour une catégorie
 */
export const updateCategory = async (
  id: string,
  categoryData: UpdateCategoryDto
): Promise<Category> => {
  try {
    const formData = new FormData();
    if (categoryData.name) {
      formData.append("name", categoryData.name);
    }
    if (categoryData.image) {
      formData.append("image", categoryData.image);
    }

    const token = localStorage.getItem("token");
    const response = await fetch(buildUrl(`categories/${id}`), {
      method: "PATCH",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors de la mise à jour");
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Une erreur est survenue");
  }
};

/**
 * Supprimer une catégorie
 */
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const response = await fetch(buildUrl(`categories/${id}`), {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors de la suppression");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Une erreur est survenue");
  }
};
