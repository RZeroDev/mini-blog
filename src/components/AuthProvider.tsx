import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { restoreSession } from "@/store/slices/authSlice";

/**
 * Composant pour restaurer la session automatiquement au démarrage
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Restaurer la session depuis localStorage au démarrage
    dispatch(restoreSession());
  }, [dispatch]);

  return <>{children}</>;
};
