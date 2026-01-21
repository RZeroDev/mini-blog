import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route d'accueil */}
        <Route path="/" element={<HomePage />} />
        
        {/* Route de connexion */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Redirection par défaut vers login pour les routes protégées */}
        <Route path="/admin/*" element={<Navigate to="/login" replace />} />
        
        {/* Page 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
