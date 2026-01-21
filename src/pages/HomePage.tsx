import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BlogHeader } from "@/components/blog-header";
import {
  IconClock,
  IconEye,
  IconArrowRight,
  IconFolder,
} from "@tabler/icons-react";
import { getRecentPosts } from "@/api/posts";
import { getCategories } from "@/api/categories";
import { apiUrl } from "@/api";
import type { Post } from "@/api/posts";
import type { Category } from "@/api/categories";

const HomePage = () => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [postsData, categoriesData] = await Promise.all([
          getRecentPosts(6),
          getCategories(),
        ]);
        console.log("Posts récupérés:", postsData);
        setRecentPosts(postsData);
        setCategories(categoriesData.slice(0, 8));
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHeader />

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Découvrez des articles qui vous inspirent
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Explorez des contenus de qualité sur la technologie, le business,
              le lifestyle et bien plus encore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#recent-posts"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
              >
                Explorer les articles
                <IconArrowRight className="ml-2 h-5 w-5" />
              </a>
              <Link
                to="/categories"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-900 bg-white border-2 border-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Voir les catégories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Catégories
              </h2>
              <p className="text-gray-600">
                Explorez nos différents sujets
              </p>
            </div>
            <Link
              to="/categories"
              className="hidden md:flex items-center text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              Voir tout
              <IconArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 hover:border-gray-900 transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={apiUrl + category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <IconFolder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucune catégorie disponible</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Posts Section */}
      <section id="recent-posts" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Articles récents
            </h2>
            <p className="text-gray-600">
              Découvrez les dernières publications
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/post/${post.slug || post.id}`}
                  className="group bg-white rounded-lg border border-gray-200 hover:border-gray-900 overflow-hidden transition-all hover:shadow-lg"
                >
                  {post.image && (
                    <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                      <img
                        src={`${apiUrl}uploads/posts/${post.image}`}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                        {post.category.name}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <IconClock className="h-4 w-4" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      {post.views && (
                        <div className="flex items-center gap-1">
                          <IconEye className="h-4 w-4" />
                          <span>{post.views}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <IconFolder className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun article pour le moment
              </h3>
              <p className="text-gray-600 mb-6">
                Les premiers articles seront bientôt disponibles.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Restez informé
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Recevez les derniers articles directement dans votre boîte mail
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 text-base font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
            >
              S'abonner
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4">
            Pas de spam, désabonnez-vous à tout moment
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center bg-white rounded">
                  <span className="text-lg font-bold text-gray-900">MB</span>
                </div>
                <span className="text-xl font-bold text-white">Mini Blog</span>
              </div>
              <p className="text-sm text-gray-400">
                Votre plateforme de blogging professionnelle.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className="hover:text-white transition-colors"
                  >
                    Catégories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors"
                  >
                    À propos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Catégories</h3>
              <ul className="space-y-2 text-sm">
                {categories.slice(0, 4).map((category) => (
                  <li key={category.id}>
                    <Link
                      to={`/category/${category.slug}`}
                      className="hover:text-white transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Légal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Mini Blog. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
