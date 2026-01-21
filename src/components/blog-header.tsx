import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IconMenu2,
  IconX,
  IconSearch,
  IconUser,
  IconChevronDown,
} from "@tabler/icons-react";
import { useAppSelector } from "@/store/hooks";
import { getCategories } from "@/api/categories";
import type { Category } from "@/api/categories";
import { apiUrl } from "@/api";

export function BlogHeader() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.slice(0, 6));
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center bg-gray-900 rounded">
              <span className="text-lg font-bold text-white">MB</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Mini Blog
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Accueil
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                onBlur={() => setTimeout(() => setIsCategoriesOpen(false), 200)}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Catégories
                <IconChevronDown className="ml-1 h-4 w-4" />
              </button>

              {isCategoriesOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  {categories.length > 0 ? (
                    <>
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.slug}`}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <img
                            src={apiUrl + category.image}
                            alt={category.name}
                            className="h-8 w-8 rounded object-cover"
                          />
                          <span className="text-sm text-gray-700">
                            {category.name}
                          </span>
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <Link
                          to="/categories"
                          className="block px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
                        >
                          Voir toutes les catégories →
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Aucune catégorie disponible
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/about"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              À propos
            </Link>

            <Link
              to="/contact"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button className="hidden md:flex p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <IconSearch className="h-5 w-5" />
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <IconUser className="h-5 w-5" />
                  <span className="hidden md:block text-sm font-medium">
                    {user?.firstName}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Tableau de bord
                    </Link>
                    <Link
                      to="/logout"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Se déconnecter
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
              >
                Se connecter
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? (
                <IconX className="h-5 w-5" />
              ) : (
                <IconMenu2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="space-y-1">
              <Link
                to="/"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>

              <div className="px-4 py-2">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Catégories
                </div>
                <div className="space-y-1 pl-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block py-2 text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                  <Link
                    to="/categories"
                    className="block py-2 text-sm font-medium text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Voir tout →
                  </Link>
                </div>
              </div>

              <Link
                to="/about"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>

              <Link
                to="/contact"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="block mx-4 mt-4 px-4 py-2 text-sm font-medium text-center text-white bg-gray-900 hover:bg-gray-800 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Se connecter
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
