import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BlogHeader } from "@/components/blog-header";
import {
  IconArrowLeft,
  IconClock,
  IconEye,
  IconUser,
  IconShare,
  IconHeart,
  IconBookmark,
} from "@tabler/icons-react";
import { getPostBySlug } from "@/api/posts";
import { apiUrl } from "@/api";
import type { Post } from "@/api/posts";

const PostDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        const data = await getPostBySlug(slug);
        setPost(data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'article:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
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

      {isLoading ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-4">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-96 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ) : post ? (
        <>
          {/* Header */}
          <section className="bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6"
              >
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Link>

              <div className="mb-4">
                <Link
                  to={`/category/${post.category.slug}`}
                  className="inline-block px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {post.category.name}
                </Link>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                {(post.user || post.author) && (
                  <>
                    <div className="flex items-center gap-2">
                      <IconUser className="h-5 w-5" />
                      <span className="font-medium">
                        {(post.user || post.author)?.firstName} {(post.user || post.author)?.lastName}
                      </span>
                    </div>
                    <span className="text-gray-300">•</span>
                  </>
                )}
                <div className="flex items-center gap-2">
                  <IconClock className="h-5 w-5" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                {post.views && (
                  <>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-2">
                      <IconEye className="h-5 w-5" />
                      <span>{post.views} vues</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid gap-8 lg:grid-cols-4">
              {/* Main Content */}
              <article className="lg:col-span-3">
                {post.image && (
                  <div className="relative h-96 rounded-xl overflow-hidden mb-8 border border-gray-200">
                    <img
                      src={`${apiUrl}uploads/posts/${post.image}`}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-gray-900 prose-strong:text-gray-900">
                  <div
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>

                <div className="border-t border-gray-200 my-8" />

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                      <IconHeart className="h-4 w-4" />
                      J'aime
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                      <IconBookmark className="h-4 w-4" />
                      Enregistrer
                    </button>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                    <IconShare className="h-4 w-4" />
                    Partager
                  </button>
                </div>

                <div className="border-t border-gray-200 my-8" />

                {/* Author Card */}
                {(post.user || post.author) && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                        {(post.user || post.author)?.firstName?.[0]}
                        {(post.user || post.author)?.lastName?.[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          {(post.user || post.author)?.firstName} {(post.user || post.author)?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {(post.user || post.author)?.email}
                        </p>
                      <p className="text-sm text-gray-700">
                        Auteur passionné partageant ses connaissances et
                        expériences.
                      </p>
                    </div>
                  </div>
                </div>
                )}
              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Category Card */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Catégorie
                    </h3>
                    <Link
                      to={`/category/${post.category.slug}`}
                      className="group block"
                    >
                      <div className="relative h-32 rounded-lg overflow-hidden mb-3 border border-gray-200">
                        <img
                          src={post.category.image}
                          alt={post.category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute inset-0 flex items-end p-3">
                          <span className="text-white font-semibold">
                            {post.category.name}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={`/category/${post.category.slug}`}
                      className="block w-full px-4 py-2 text-sm font-medium text-center text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      Voir plus d'articles
                    </Link>
                  </div>

                  {/* Share Card */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Partager
                    </h3>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                        Facebook
                      </button>
                      <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                        Twitter
                      </button>
                      <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                        LinkedIn
                      </button>
                      <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                        Copier le lien
                      </button>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </>
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Article introuvable
            </h2>
            <p className="text-gray-600 mb-6">
              L'article que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg"
            >
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;
