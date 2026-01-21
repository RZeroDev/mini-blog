import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BlogHeader } from "@/components/blog-header";
import { IconFolder, IconClock, IconBookmark, IconHeart } from "@tabler/icons-react";
import { getRecentPosts, getPosts, getPostsByCategory } from "@/api/posts";
import { getCategories } from "@/api/categories";
import { apiUrl } from "@/api";
import type { Post } from "@/api/posts";
import type { Category } from "@/api/categories";

const HomePage = () => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [postsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [postsData, allPostsData, categoriesData] = await Promise.all([
          getRecentPosts(6),
          getPosts(true),
          getCategories(),
        ]);
        console.log("Posts récupérés:", postsData);
        console.log("Tous les posts:", allPostsData);
        setRecentPosts(postsData);
        setAllPosts(allPostsData);
        setFilteredPosts(allPostsData);
        setCategories(categoriesData.slice(0, 8));
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Charger les posts par catégorie quand la catégorie change
  useEffect(() => {
    const fetchPostsByCategory = async () => {
      if (selectedCategory === "all") {
        console.log("Chargement de tous les posts, nombre:", allPosts.length);
        // Ne rien faire si on est encore en train de charger initialement
        if (isLoading) {
          console.log("Chargement initial en cours, attente...");
          return;
        }
        console.log("Affichage de tous les posts:", allPosts.length);
        setFilteredPosts(allPosts);
        setCurrentPage(1);
        return;
      }

      try {
        setIsLoadingCategory(true);
        const categoryPosts = await getPostsByCategory(selectedCategory);
        console.log(`Posts de la catégorie ${selectedCategory}:`, categoryPosts);
        setFilteredPosts(categoryPosts);
        setCurrentPage(1);
      } catch (error) {
        console.error("Erreur lors du chargement des posts par catégorie:", error);
        setFilteredPosts([]);
      } finally {
        setIsLoadingCategory(false);
      }
    };

    fetchPostsByCategory();
  }, [selectedCategory, allPosts, isLoading]);

  // Mettre à jour les posts affichés selon la pagination
  useEffect(() => {
    const startIndex = 0;
    const endIndex = currentPage * postsPerPage;
    setDisplayedPosts(filteredPosts.slice(startIndex, endIndex));
  }, [filteredPosts, currentPage, postsPerPage]);

  // Fonction pour charger plus de posts
  const loadMorePosts = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Vérifier s'il y a plus de posts à charger
  const hasMorePosts = displayedPosts.length < filteredPosts.length;

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
      <BlogHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                            src={`${apiUrl}uploads/posts/${post.image}`}
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
                            src={`${apiUrl}uploads/posts/${post.image}`}
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

        {/* Category Filtered Section - Grid Layout */}
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

          {/* Filtered Articles - Grid Layout avec cartes aléatoires */}
          {(isLoading || isLoadingCategory) ? (
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
                            src={`${apiUrl}uploads/users/${post.user.picture}`}
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
                            {author?.firstName?.toUpperCase()} {author?.lastName?.toUpperCase()}
                          </div>
                          <div className="text-xs text-white/80">@{author?.firstName?.toLowerCase()}{author?.lastName?.[0]?.toLowerCase()}</div>
                        </div>
                      </div>
                      <p className="text-base italic text-white/95 leading-relaxed">
                        "{getQuoteText(post.content)}"
                      </p>
                    </Link>
                  );
                }

                // Carte avec fond coloré - Plus grande
                if (cardType === 'colored') {
                  return (
                    <Link
                      key={post.id}
                      to={`/post/${post.slug || post.id}`}
                      className={`block mb-6 break-inside-avoid group ${cardColor} text-white rounded-xl overflow-hidden hover:shadow-2xl transition-all`}
                    >
                      <div className="p-8">
                        <div className="mb-3">
                          <span className="text-xs font-bold text-white/80 uppercase tracking-wide">
                            {post.category.name}
                          </span>
                        </div>
                        <h3 className={`text-2xl font-bold text-white mb-4 ${lineClamp}`}>
                          {post.title}
                        </h3>
                        <p className={`text-sm text-white/90 ${lineClamp} mb-6`}>
                          {post.content.substring(0, textLength)}...
                        </p>
                        <div className="flex items-center gap-2">
                          <IconBookmark className="w-5 h-5 text-white/80" />
                          <span className="text-sm font-medium text-white">
                            Lire l'article
                          </span>
                        </div>
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
                      className={`block mb-6 break-inside-avoid group bg-card rounded-xl border border-border overflow-hidden hover:shadow-2xl transition-all`}
                    >
                      {post.image && (
                        <div className={`${imageHeight} overflow-hidden bg-muted`}>
                          <img
                            src={`${apiUrl}uploads/posts/${post.image}`}
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
                              src={`${apiUrl}uploads/users/${post.user.picture}`}
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
                          <IconHeart className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </Link>
                  );
                }

                // Carte featured avec fond coloré - Compacte
                if (cardType === 'featured') {
                  return (
                    <Link
                      key={post.id}
                      to={`/post/${post.slug || post.id}`}
                      className={`block mb-6 break-inside-avoid group bg-emerald-800 text-white rounded-xl overflow-hidden hover:shadow-2xl transition-all`}
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

                // Carte image par défaut (style standard) - Hauteur variable
                return (
                  <Link
                    key={post.id}
                    to={`/post/${post.slug || post.id}`}
                    className={`block mb-6 break-inside-avoid group bg-card rounded-xl border border-border overflow-hidden hover:shadow-2xl transition-all`}
                  >
                    {post.image ? (
                      <div className={`${imageHeight} overflow-hidden bg-muted`}>
                        <img
                          src={`${apiUrl}uploads/posts/${post.image}`}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-primary/10" />
                    )}
                    
                    <div className="p-5">
                      <div className="mb-2">
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full uppercase tracking-wide">
                          {post.category.name}
                        </span>
                      </div>
                      
                      <h3 className={`text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors ${lineClamp}`}>
                        {post.title}
                      </h3>
                      
                      <p className={`text-sm text-muted-foreground mb-4 ${lineClamp}`}>
                        {post.content.substring(0, textLength)}...
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {post.user?.picture ? (
                            <img
                              src={`${apiUrl}uploads/users/${post.user.picture}`}
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
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">
                              {author?.firstName} {author?.lastName}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <IconClock className="w-3 h-3" />
                              <span>{readingTime} min</span>
                            </div>
                          </div>
                        </div>
                        
                        <span className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors inline-block">
                          Lire l'article
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              </div>
              
              {/* Bouton Charger Plus */}
              {hasMorePosts && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={loadMorePosts}
                    className="px-8 py-4 text-base font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all hover:shadow-lg transform hover:scale-105"
                  >
                    Charger plus d'articles ({filteredPosts.length - displayedPosts.length} restants)
                  </button>
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

      {/* Newsletter Section */}
      <section className="py-16 bg-card border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Restez informé
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Recevez les derniers articles directement dans votre boîte mail
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            />
            <button
              type="submit"
              className="px-6 py-3 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              S'abonner
            </button>
          </form>
          <p className="text-sm text-muted-foreground mt-4">
            Pas de spam, désabonnez-vous à tout moment
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center bg-white rounded-full">
                  <span className="text-sm font-bold text-primary">MB</span>
                </div>
                <span className="text-xl font-bold text-white">miniblog</span>
              </div>
              <p className="text-sm text-white/70 mb-4 max-w-xs">
                123 Rue de la Blog, Suite 100<br />
                75001 Paris, France
              </p>
              <div className="space-y-1 text-sm text-white/70">
                <p>Téléphone: +33 1 23 45 67 89</p>
                <p>Email: contact@miniblog.com</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-base">Liens rapides</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-white/70 hover:text-white transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Catégories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    À propos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-base">Réseaux sociaux</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Youtube
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-base">Légal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/terms"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookies"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Politique des cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-sm text-white/70">
              © {new Date().getFullYear()} Miniblog. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
