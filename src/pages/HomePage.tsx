import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IconFolder, IconClock, IconBookmark } from "@tabler/icons-react";
import { getPostsPaginated, getPostsByCategoryPaginated } from "@/api/posts";
import { getCategories } from "@/api/categories";
import { apiUrl } from "@/api";
import type { Post } from "@/api/posts";
import type { Category } from "@/api/categories";
import { sanitizeApiImageUrl } from "@/utils/sanitize";

const HomePage = () => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [postsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [recentPostsLimit] = useState(6);

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [postsData, categoriesData] = await Promise.all([
          getPostsPaginated(1, recentPostsLimit),
          getCategories(),
        ]);
        console.log("Posts récupérés:", postsData);
        setRecentPosts(postsData.items);
        const limitedCategories = categoriesData.slice(0, 8);
        setCategories(limitedCategories);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [recentPostsLimit]);

  // Charger les posts par catégorie quand la catégorie change
  useEffect(() => {
    const fetchPostsByCategory = async () => {
      if (!selectedCategory) {
        return;
      }

      try {
        setIsLoadingPosts(true);
        setDisplayedPosts([]); // Réinitialiser les posts affichés
        setCurrentPage(1);
        
        let result;
        // Si "Toutes les catégories" est sélectionné, charger tous les posts
        if (selectedCategory === "all") {
          console.log("Chargement de tous les posts avec pagination");
          result = await getPostsPaginated(1, postsPerPage);
        } else {
          // Sinon, charger les posts de la catégorie spécifique
          console.log(`Chargement des posts de la catégorie ${selectedCategory}`);
          result = await getPostsByCategoryPaginated(selectedCategory, 1, postsPerPage);
        }
        
        console.log("Résultat pagination:", result);
        setDisplayedPosts(result.items);
        setTotalPages(result.meta.totalPages);
        setTotalPosts(result.meta.total);
      } catch (error) {
        console.error("Erreur lors du chargement des posts:", error);
        setDisplayedPosts([]);
        setTotalPages(1);
        setTotalPosts(0);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    fetchPostsByCategory();
  }, [selectedCategory, postsPerPage]);

  // Fonction pour charger plus de posts (pagination serveur)
  const loadMorePosts = async () => {
    if (isLoadingMore || currentPage >= totalPages) {
      return;
    }

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      
      let result;
      if (selectedCategory === "all") {
        result = await getPostsPaginated(nextPage, postsPerPage);
      } else {
        result = await getPostsByCategoryPaginated(selectedCategory, nextPage, postsPerPage);
      }
      
      // Ajouter les nouveaux posts aux posts existants
      setDisplayedPosts(prev => [...prev, ...result.items]);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Erreur lors du chargement de plus de posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Vérifier s'il y a plus de posts à charger
  const hasMorePosts = currentPage < totalPages;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Fonction pour calculer le temps de lecture estimé
  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  // Fonction pour générer un nombre pseudo-aléatoire basé sur une chaîne
  const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  // Fonction pour déterminer le type de carte de manière aléatoire basée sur l'ID du post
  const getCardType = (postId: string): 'image' | 'colored' | 'quote' | 'minimal' | 'featured' => {
    const types: Array<'image' | 'colored' | 'quote' | 'minimal' | 'featured'> = [
      'image', 'colored', 'quote', 'minimal', 'featured', 'image', 'colored', 'minimal', 'image'
    ];
    const hash = hashString(postId);
    return types[hash % types.length];
  };

  // Fonction pour obtenir une couleur de fond aléatoire basée sur l'ID du post
  const getCardColor = (postId: string): string => {
    const colors = [
      'bg-orange-500',
      'bg-purple-600',
      'bg-emerald-700',
      'bg-blue-600',
      'bg-pink-500',
      'bg-indigo-600',
      'bg-rose-600',
      'bg-teal-600',
      'bg-amber-600',
      'bg-cyan-600',
    ];
    const hash = hashString(postId + '-color');
    return colors[hash % colors.length];
  };

  // Fonction pour obtenir une hauteur d'image aléatoire basée sur l'ID du post
  const getImageHeight = (postId: string): string => {
    const heights = ['h-40', 'h-48', 'h-56', 'h-64', 'h-72', 'h-80'];
    const hash = hashString(postId + '-height');
    return heights[hash % heights.length];
  };

  // Fonction pour obtenir une longueur de texte aléatoire basée sur l'ID du post
  const getTextLength = (postId: string): number => {
    const lengths = [100, 120, 150, 180, 200, 250, 300];
    const hash = hashString(postId + '-textlen');
    return lengths[hash % lengths.length];
  };

  // Fonction pour obtenir un nombre de lignes de clamp aléatoire
  const getLineClamp = (postId: string): string => {
    const clamps = ['line-clamp-2', 'line-clamp-3', 'line-clamp-4', 'line-clamp-5', 'line-clamp-6'];
    const hash = hashString(postId + '-clamp');
    return clamps[hash % clamps.length];
  };

  // Fonction pour obtenir un texte de citation court
  const getQuoteText = (content: string): string => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    if (sentences.length > 0) {
      return sentences[0].trim().substring(0, 200) + (sentences[0].length > 200 ? '...' : '');
    }
    return content.substring(0, 200) + '...';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Latest News Section */}
        <section className="mb-16">
          
          {isLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-80 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ) : recentPosts.length > 0 ? (
            <div className="space-y-8">
              {/* Première rangée : 2 articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {recentPosts.slice(0, 2).map((post) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.slug || post.id}`}
                    className="group block"
                  >
                    <div className="flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow">
                      {post.image && (
                        <div className="aspect-video overflow-hidden bg-muted">
                          <img
                            src={sanitizeApiImageUrl(apiUrl, `uploads/posts/${post.image}`)}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-8 flex flex-col flex-1 justify-center">
                        <div className="mb-4">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            {post.category.name}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-3">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            {(post.user || post.author)?.firstName}{" "}
                            {(post.user || post.author)?.lastName}
                          </span>
                          <span>•</span>
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Deuxième rangée : 3 articles */}
              {recentPosts.length > 2 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recentPosts.slice(2, 5).map((post) => (
                    <Link
                      key={post.id}
                      to={`/post/${post.slug || post.id}`}
                      className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all"
                    >
                      {post.image && (
                        <div className="aspect-video overflow-hidden bg-muted">
                          <img
                            src={sanitizeApiImageUrl(apiUrl, `uploads/posts/${post.image}`)}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="mb-3">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            {post.category.name}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            {(post.user || post.author)?.firstName}{" "}
                            {(post.user || post.author)?.lastName}
                          </span>
                          <span>•</span>
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted rounded-lg border border-border">
              <IconFolder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun article disponible</p>
            </div>
          )}
        </section>

        {/* Category Filtered Section - Masonry Layout */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-foreground text-center mb-8">
            {categories.find((c) => c.id === selectedCategory)?.name || "Tous les Articles"}
          </h2>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground border border-border hover:bg-muted"
              }`}
            >
              Toutes les catégories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground border border-border hover:bg-muted"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Filtered Articles - Masonry Layout */}
          {(isLoading || isLoadingPosts) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : displayedPosts.length > 0 ? (
            <>
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                {displayedPosts.map((post) => {
                const author = post.user || post.author;
                const readingTime = getReadingTime(post.content);
                const cardType = getCardType(post.id);
                const cardColor = getCardColor(post.id);
                const imageHeight = getImageHeight(post.id);
                const textLength = getTextLength(post.id);
                const lineClamp = getLineClamp(post.id);
                
                // Carte de citation (Quote Card) - Compacte
                if (cardType === 'quote') {
                  return (
                    <Link
                      key={post.id}
                      to={`/post/${post.slug || post.id}`}
                      className={`block mb-6 break-inside-avoid group ${cardColor} text-white rounded-xl p-6 hover:shadow-2xl transition-all`}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        {post.user?.picture ? (
                          <img
                            src={sanitizeApiImageUrl(apiUrl, `uploads/users/${post.user.picture}`)}
                            alt={`${author?.firstName} ${author?.lastName}`}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-base font-semibold text-white">
                              {author?.firstName?.[0] || 'A'}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-sm text-white">
                            {author?.firstName} {author?.lastName}
                          </div>
                          <div className="text-xs text-white/70">@{author?.firstName?.toLowerCase()}</div>
                        </div>
                      </div>
                      <p className="text-lg italic text-white leading-relaxed font-medium">
                        "{getQuoteText(post.content)}"
                      </p>
                    </Link>
                  );
                }

                // Carte avec fond coloré (Texte uniquement ou dominant)
                if (cardType === 'colored') {
                  return (
                    <Link
                      key={post.id}
                      to={`/post/${post.slug || post.id}`}
                      className={`block mb-6 break-inside-avoid group ${cardColor} text-white rounded-xl p-8 hover:shadow-2xl transition-all`}
                    >
                      <div className="mb-3 text-xs font-bold uppercase tracking-widest opacity-80">
                        {post.category.name}
                      </div>
                      <h3 className={`text-2xl font-black mb-4 leading-tight ${lineClamp}`}>
                        {post.title}
                      </h3>
                      <p className={`text-sm text-white/90 ${lineClamp} mb-6 leading-relaxed`}>
                        {post.content.substring(0, textLength)}...
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                          Lire l'article
                        </span>
                        <IconBookmark className="w-5 h-5 opacity-70" />
                      </div>
                    </Link>
                  );
                }

                // Carte minimale avec tag - Compacte
                if (cardType === 'minimal') {
                  return (
                    <Link
                      key={post.id}
                      to={`/post/${post.slug || post.id}`}
                      className={`mb-6 break-inside-avoid group bg-card rounded-xl border border-border overflow-hidden hover:shadow-2xl transition-all flex flex-col`}
                    >
                      {post.image && (
                        <div className={`${imageHeight} overflow-hidden bg-muted`}>
                          <img
                            src={sanitizeApiImageUrl(apiUrl, `uploads/posts/${post.image}`)}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="mb-2">
                          <span className="inline-block px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 rounded-full uppercase tracking-wide">
                            {post.category.name}
                          </span>
                        </div>
                        <h3 className={`text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors ${lineClamp}`}>
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-3">
                          {post.user?.picture ? (
                            <img
                              src={sanitizeApiImageUrl(apiUrl, `uploads/users/${post.user.picture}`)}
                              alt={`${author?.firstName} ${author?.lastName}`}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary">
                                {author?.firstName?.[0] || 'A'}
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="text-sm font-medium text-foreground">
                              {author?.firstName} {author?.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {readingTime} min • {formatDate(post.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                }

                // Carte featured - Compacte avec fond émeraude
                if (cardType === 'featured') {
                  return (
                    <Link
                      key={post.id}
                      to={`/post/${post.slug || post.id}`}
                      className={`mb-6 break-inside-avoid group bg-emerald-800 text-white rounded-xl overflow-hidden hover:shadow-2xl transition-all flex flex-col`}
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-white/90 line-clamp-3 mb-4">
                          {post.content.substring(0, 120)}...
                        </p>
                        <span className="inline-block px-4 py-2 bg-white text-emerald-800 hover:bg-white/90 rounded-lg text-sm font-semibold transition-colors">
                          Lire l'article
                        </span>
                      </div>
                    </Link>
                  );
                }

                // Carte image standard - Classique (Moyenne)
                return (
                  <Link
                    key={post.id}
                    to={`/post/${post.slug || post.id}`}
                    className={`mb-6 break-inside-avoid group bg-card rounded-xl border border-border overflow-hidden hover:shadow-2xl transition-all flex flex-col`}
                  >
                    {post.image ? (
                      <div className={`${imageHeight} overflow-hidden bg-muted`}>
                        <img
                          src={sanitizeApiImageUrl(apiUrl, `uploads/posts/${post.image}`)}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className={`${imageHeight} bg-primary/10 flex items-center justify-center`}>
                        <IconFolder className="w-12 h-12 text-primary/20" />
                      </div>
                    )}
                    
                    <div className="p-5">
                      <div className="mb-2">
                        <span className="inline-block px-3 py-1 text-[10px] font-bold text-primary bg-primary/10 rounded-md uppercase tracking-tighter">
                          {post.category.name}
                        </span>
                      </div>
                      
                      <h3 className={`text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug ${lineClamp}`}>
                        {post.title}
                      </h3>
                      
                      <p className={`text-sm text-muted-foreground mb-4 leading-relaxed ${lineClamp}`}>
                        {post.content.substring(0, textLength)}...
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden text-[10px] font-bold text-primary">
                            {post.user?.picture ? (
                              <img src={sanitizeApiImageUrl(apiUrl, `uploads/users/${post.user.picture}`)} className="w-full h-full object-cover" alt="" />
                            ) : author?.firstName?.[0]}
                          </div>
                          <span className="text-xs font-medium text-foreground/80 truncate max-w-[80px]">
                            {author?.firstName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                          <IconClock className="w-3 h-3" />
                          <span>{readingTime} min</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
              </div>
              
              {/* Bouton Charger Plus */}
              {hasMorePosts && (
                <div className="flex flex-col items-center gap-4 mt-12">
                  <button
                    onClick={loadMorePosts}
                    disabled={isLoadingMore}
                    className="px-8 py-4 text-base font-semibold text-white bg-primary hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-xl transition-all hover:shadow-lg transform hover:scale-105 disabled:transform-none"
                  >
                    {isLoadingMore ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Chargement...
                      </span>
                    ) : (
                      `Charger plus d'articles (${totalPosts - displayedPosts.length} restants)`
                    )}
                  </button>
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} sur {totalPages} • {displayedPosts.length} / {totalPosts} articles
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg border border-border">
              <IconFolder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun article dans cette catégorie</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
