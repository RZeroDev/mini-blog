import { buildUrl, getAuthHeaders } from "./index";

// Types pour les posts
export interface Post {
  id: string;
  title: string;
  slug?: string; // Optionnel car peut ne pas être dans toutes les réponses
  content: string;
  image?: string;
  published: boolean;
  views?: number; // Optionnel car peut ne pas être dans toutes les réponses
  authorId?: string; // Optionnel, peut être userId
  userId?: string; // Peut être présent à la place de authorId
  categoryId: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    picture?: string | null;
  };
  author?: {
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

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedPostsResponse {
  items: Post[];
  meta: PaginationMeta;
}

/**
 * Récupérer tous les posts avec pagination
 */
export const getPostsPaginated = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<PaginatedPostsResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }

    const response = await fetch(buildUrl(`posts?${params.toString()}`), {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des posts");
    }

    const result = await response.json();
    // Le backend retourne { data: { items: [...], meta: {...} }, message: '...' }
    if (result.data) {
      // Normaliser les types (limit peut être une string)
      const normalizedMeta = {
        ...result.data.meta,
        limit: typeof result.data.meta.limit === 'string' 
          ? parseInt(result.data.meta.limit, 10) 
          : result.data.meta.limit,
        page: typeof result.data.meta.page === 'string' 
          ? parseInt(result.data.meta.page, 10) 
          : result.data.meta.page,
        total: typeof result.data.meta.total === 'string' 
          ? parseInt(result.data.meta.total, 10) 
          : result.data.meta.total,
        totalPages: typeof result.data.meta.totalPages === 'string' 
          ? parseInt(result.data.meta.totalPages, 10) 
          : result.data.meta.totalPages,
      };
      return {
        items: result.data.items || [],
        meta: normalizedMeta,
      };
    }
    // Si la structure est différente, essayer de la détecter
    if (result.items && result.meta) {
      return result;
    }
    // Fallback
    return { items: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Une erreur est survenue");
  }
};

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
    const response = await fetch(buildUrl(`posts?limit=${limit}&page=1`), {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des posts récents");
    }

    const result = await response.json();
    
    // Le backend retourne maintenant { data: { items: [...], meta: {...} }, message: '...' }
    if (result.data && result.data.items) {
      // Filtrer uniquement les posts publiés
      return result.data.items.filter((post: Post) => post.published);
    }
    
    // Fallback pour l'ancienne structure
    if (Array.isArray(result)) {
      return result.filter((post: Post) => post.published);
    }
    
    if (result.data && Array.isArray(result.data)) {
      return result.data.filter((post: Post) => post.published);
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
 * Récupérer les posts par catégorie sans pagination (tous les posts)
 */
export const getPostsByCategory = async (categoryId: string): Promise<Post[]> => {
  try {
    // Utiliser limit=1000 pour récupérer tous les posts de la catégorie
    const response = await fetch(buildUrl(`posts/category/${categoryId}?limit=1000`), {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des posts");
    }

    const result = await response.json();
    
    // Le backend retourne maintenant { statusCode: 200, data: { items: [...], meta: {...} }, message: '...' }
    if (result.data && result.data.items && Array.isArray(result.data.items)) {
      return result.data.items.filter((post: Post) => post.published);
    }
    
    // Fallback pour l'ancienne structure { data: [...] }
    if (result.data && Array.isArray(result.data)) {
      return result.data.filter((post: Post) => post.published);
    }
    
    // Fallback pour un tableau direct
    if (Array.isArray(result)) {
      return result.filter((post: Post) => post.published);
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
 * Récupérer les posts par catégorie avec pagination
 */
export const getPostsByCategoryPaginated = async (
  categoryId: string,
  page: number = 1,
  limit: number = 12
): Promise<PaginatedPostsResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(buildUrl(`posts/category/${categoryId}?${params.toString()}`), {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des posts");
    }

    const result = await response.json();
    
    // Le backend retourne { statusCode: 200, data: { items: [...], meta: {...} }, message: '...' }
    if (result.data && result.data.items && Array.isArray(result.data.items) && result.data.meta) {
      return {
        items: result.data.items.filter((post: Post) => post.published),
        meta: result.data.meta,
      };
    }
    
    // Fallback pour l'ancienne structure
    if (result.data && Array.isArray(result.data) && result.meta) {
      return {
        items: result.data.filter((post: Post) => post.published),
        meta: result.meta,
      };
    }
    
    // Fallback
    return { 
      items: [], 
      meta: { total: 0, page: 1, limit: 12, totalPages: 1 } 
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Une erreur est survenue");
  }
};

/**
 * Obtenir les statistiques du dashboard
 */
export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalViews: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await fetch(buildUrl("posts/stats"), {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des statistiques");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Une erreur est survenue");
  }
};

/**
 * Incrémenter les vues d'un post
 */
export const incrementPostViews = async (postId: string): Promise<void> => {
  try {
    const response = await fetch(buildUrl(`posts/${postId}/view`), {
      method: "POST",
    });

    if (!response.ok) {
      console.error("Erreur lors de l'incrémentation des vues");
    }
  } catch (error) {
    console.error("Erreur lors de l'incrémentation des vues:", error);
  }
};
