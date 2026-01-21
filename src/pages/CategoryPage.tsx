import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BlogHeader } from "@/components/blog-header";
import {
  IconClock,
  IconEye,
  IconArrowLeft,
  IconFolder,
} from "@tabler/icons-react";
import { getPostsByCategory } from "@/api/posts";
import { getCategories } from "@/api/categories";
import type { Post } from "@/api/posts";
import type { Category } from "@/api/categories";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        const categories = await getCategories();
        const foundCategory = categories.find((cat) => cat.slug === slug);

        if (foundCategory) {
          setCategory(foundCategory);
          const postsData = await getPostsByCategory(foundCategory.id);
          setPosts(postsData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

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

      {/* Category Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6"
          >
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>

          {isLoading ? (
            <div className="space-y-3">
              <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : category ? (
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h1>
                <p className="text-gray-600">
                  {posts.length} article{posts.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Catégorie introuvable
              </h1>
              <p className="text-gray-600">
                Cette catégorie n'existe pas
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/post/${post.slug}`}
                  className="group bg-white rounded-lg border border-gray-200 hover:border-gray-900 overflow-hidden transition-all hover:shadow-lg"
                >
                  {post.image && (
                    <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span>
                        Par {post.author.firstName} {post.author.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <IconClock className="h-4 w-4" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IconEye className="h-4 w-4" />
                        <span>{post.views}</span>
                      </div>
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
                Aucun article dans cette catégorie
              </h3>
              <p className="text-gray-600 mb-6">
                Les articles seront bientôt disponibles.
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg"
              >
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
