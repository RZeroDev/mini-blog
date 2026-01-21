import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import LegalPage from "./pages/LegalPage";
import { AuthProvider } from "./components/AuthProvider";
import { PrivateRoute } from "./components/PrivateRoute";
import { GuestRoute } from "./components/GuestRoute";
import { Layout } from "./components/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Routes publiques avec Layout */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/categories" element={<Layout><AllCategoriesPage /></Layout>} />
          <Route path="/category/:slug" element={<Layout><CategoryPage /></Layout>} />
          <Route path="/post/:slug" element={<Layout><PostDetailPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/posts" element={<Layout><AllCategoriesPage /></Layout>} />
          <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
          <Route path="/terms" element={<Layout><TermsPage /></Layout>} />
          <Route path="/legal" element={<Layout><LegalPage /></Layout>} />
          
          {/* Route de connexion (seulement pour non-connectés) */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Layout>
                  <LoginPage />
                </Layout>
              </GuestRoute>
            }
          />
          
          {/* Route Dashboard (protégée - authentification requise) - Sans Layout */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Route Catégories (protégée) - Sans Layout */}
          <Route
            path="/dashboard/categories"
            element={
              <PrivateRoute>
                <CategoriesPage />
              </PrivateRoute>
            }
          />

          {/* Route Articles (protégée) - Sans Layout */}
          <Route
            path="/dashboard/posts"
            element={
              <PrivateRoute>
                <PostsPage />
              </PrivateRoute>
            }
          />
          
          {/* Routes Admin (protégées - rôle admin requis) - Sans Layout */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute requiredRole="admin">
                <Dashboard />
              </PrivateRoute>
            }
          />
          
          {/* Page 404 avec Layout */}
          <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
