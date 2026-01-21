import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IconMenu2,
  IconX,
  IconSearch,
  IconChevronDown,
} from "@tabler/icons-react";
import { useAppSelector } from "@/store/hooks";
import { getCategories } from "@/api/categories";
import type { Category } from "@/api/categories";
import { apiUrl } from "@/api";

export function Header() {
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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <span className="text-lg font-bold text-primary-foreground">MB</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Mini Blog
              </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg hover:bg-muted group"
            >
              Accueil
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                onBlur={() => setTimeout(() => setIsCategoriesOpen(false), 200)}
                className="flex items-center px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg hover:bg-muted group"
              >
                Catégories
                <IconChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoriesOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl py-2">
                {categories.length > 0 ? (
                  <>
                    {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.slug}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-muted/80 transition-colors group/item"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          <div className="relative overflow-hidden rounded-lg">
                          <img
                              src={apiUrl + category.image}
                            alt={category.name}
                              className="h-10 w-10 object-cover group-hover/item:scale-110 transition-transform duration-300"
                          />
                          </div>
                          <span className="text-sm font-medium text-foreground/80 group-hover/item:text-foreground">
                            {category.name}
                          </span>
                        </Link>
                    ))}
                      <div className="border-t border-border mt-2 pt-2">
                      <Link
                        to="/categories"
                          className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/80 transition-colors group"
                          onClick={() => setIsCategoriesOpen(false)}
                      >
                          <span>Voir toutes les catégories</span>
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors">→</span>
                      </Link>
                      </div>
                  </>
                ) : (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                    Aucune catégorie disponible
                    </div>
                  )}
                </div>
                )}
            </div>

            <Link
              to="/about"
              className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg hover:bg-muted group"
            >
              À propos
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
            </Link>

            <Link
              to="/contact"
              className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-lg hover:bg-muted group"
            >
              Contact
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button className="hidden md:flex items-center justify-center h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200 hover:scale-105">
              <IconSearch className="h-5 w-5" />
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                  className="flex items-center gap-2 px-4 py-2 text-foreground/80 hover:bg-muted rounded-lg transition-all duration-200 hover:scale-105 group"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-sm font-semibold shadow-md">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <span className="hidden lg:block text-sm font-medium">
                    {user?.firstName}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl py-2">
                    <div className="px-4 py-3 border-b border-border/50">
                      <p className="text-sm font-semibold text-foreground">
                      {user?.firstName} {user?.lastName}
                    </p>
                      <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/80 hover:bg-muted/80 transition-colors group/item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span>Tableau de bord</span>
                      <span className="ml-auto text-muted-foreground group-hover/item:text-foreground transition-colors">→</span>
                    </Link>
                    <Link
                      to="/logout"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-colors group/item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span>Se déconnecter</span>
                      <span className="ml-auto text-red-400 group-hover/item:text-red-600 transition-colors">→</span>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center px-5 py-2.5 text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
              >
                  Se connecter
                </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center h-10 w-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
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
          <div className="md:hidden py-4 border-t border-border/50 bg-card/95 backdrop-blur-md">
            <nav className="space-y-2 px-4">
              <Link
                to="/"
                className="block px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>

              <div className="px-4 py-2">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Catégories
                </div>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <img
                        src={apiUrl + category.image}
                        alt={category.name}
                        className="h-8 w-8 rounded-lg object-cover"
                      />
                      <span className="font-medium">{category.name}</span>
                    </Link>
                  ))}
                  <Link
                    to="/categories"
                    className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Voir toutes les catégories</span>
                    <span className="text-muted-foreground">→</span>
                    </Link>
                </div>
              </div>

              <Link
                to="/about"
                className="block px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>

              <Link
                to="/contact"
                className="block px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="block mx-4 mt-4 px-4 py-3 text-sm font-semibold text-center text-primary-foreground bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 rounded-lg transition-all duration-200 shadow-md"
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
