import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import CategoriesPage from "./pages/CategoriesPage";
import PostsPage from "./pages/PostsPage";
import CategoryPage from "./pages/CategoryPage";
import AllCategoriesPage from "./pages/AllCategoriesPage";
import PostDetailPage from "./pages/PostDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthProvider } from "./components/AuthProvider";
import { PrivateRoute } from "./components/PrivateRoute";
import { GuestRoute } from "./components/GuestRoute";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<AllCategoriesPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/post/:slug" element={<PostDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Route de connexion (seulement pour non-connectés) */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          
          {/* Route Dashboard (protégée - authentification requise) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Route Catégories (protégée) */}
          <Route
            path="/dashboard/categories"
            element={
              <PrivateRoute>
                <CategoriesPage />
              </PrivateRoute>
            }
          />

          {/* Route Articles (protégée) */}
          <Route
            path="/dashboard/posts"
            element={
              <PrivateRoute>
                <PostsPage />
              </PrivateRoute>
            }
          />
          
          {/* Routes Admin (protégées - rôle admin requis) */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute requiredRole="admin">
                <Dashboard />
              </PrivateRoute>
            }
          />
          
          {/* Page 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
