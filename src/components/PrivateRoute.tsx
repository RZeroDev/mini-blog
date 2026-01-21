import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // optionnel: si on veut restreindre à un rôle spécifique
}

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 */
export const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Si pas authentifié, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si un rôle spécifique est requis, vérifier
  if (requiredRole && user?.role.name !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
