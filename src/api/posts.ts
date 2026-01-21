import { buildUrl, getAuthHeaders } from "./index";

// Types pour les posts
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  published: boolean;
  views: number;
  authorId: string;
  categoryId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    image: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  image?: File;
  published?: boolean;
  categoryId: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  image?: File;
  published?: boolean;
  categoryId?: string;
}

/**
 * Récupérer tous les posts
 */
export const getPosts = async (published?: boolean): Promise<Post[]> => {
  try {
    const url = published !== undefined 
      ? buildUrl(`posts?published=${published}`)
      : buildUrl("posts");
      
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des posts");
    }

    const result = await response.json();
    
    // Gérer différents formats de réponse
    if (Array.isArray(result)) {
      return result;
    }
    
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    
    if (result.posts && Array.isArray(result.posts)) {
      return result.posts;
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
 * Récupérer les posts récents
 */
export const getRecentPosts = async (limit: number = 6): Promise<Post[]> => {
  try {
    const response = await fetch(buildUrl(`posts?limit=${limit}&published=true`), {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des posts récents");
    }

    const result = await response.json();
    
    if (Array.isArray(result)) {
      return result;
    }
    
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    
    return [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Une erreur est survenue");
  }
};

/**
 * Récupérer un post par slug
 */
export const getPostBySlug = async (slug: string): Promise<Post> => {
  try {
    const response = await fetch(buildUrl(`posts/slug/${slug}`), {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Post introuvable");
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
 * Récupérer un post par ID
 */
export const getPost = async (id: string): Promise<Post> => {
  try {
    const response = await fetch(buildUrl(`posts/${id}`), {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Post introuvable");
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
 * Créer un nouveau post
 */
export const createPost = async (postData: CreatePostDto): Promise<Post> => {
  try {
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    if (postData.image) {
      formData.append("image", postData.image);
    }
    formData.append("published", String(postData.published || false));
    formData.append("categoryId", postData.categoryId);

    const token = localStorage.getItem("token");
    const response = await fetch(buildUrl("posts"), {
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
 * Mettre à jour un post
 */
export const updatePost = async (
  id: string,
  postData: UpdatePostDto
): Promise<Post> => {
  try {
    const formData = new FormData();
    if (postData.title) {
      formData.append("title", postData.title);
    }
    if (postData.content) {
      formData.append("content", postData.content);
    }
    if (postData.image) {
      formData.append("image", postData.image);
    }
    if (postData.published !== undefined) {
      formData.append("published", String(postData.published));
    }
    if (postData.categoryId) {
      formData.append("categoryId", postData.categoryId);
    }

    const token = localStorage.getItem("token");
    const response = await fetch(buildUrl(`posts/${id}`), {
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
 * Supprimer un post
 */
export const deletePost = async (id: string): Promise<void> => {
  try {
    const response = await fetch(buildUrl(`posts/${id}`), {
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

/**
 * Récupérer les posts par catégorie
 */
export const getPostsByCategory = async (categoryId: string): Promise<Post[]> => {
  try {
    const response = await fetch(buildUrl(`posts?categoryId=${categoryId}&published=true`), {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des posts");
    }

    const result = await response.json();
    
    if (Array.isArray(result)) {
      return result;
    }
    
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }
    
    return [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Une erreur est survenue");
  }
};
