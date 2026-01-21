import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * Composant pour les routes accessibles uniquement aux non-authentifiés
 * (ex: login, register)
 * Redirige vers /dashboard si déjà connecté
 */
export const GuestRoute = ({ children }: GuestRouteProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Si déjà authentifié, rediriger vers dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
