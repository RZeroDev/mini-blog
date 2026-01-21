import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Mini Blog</h1>
        {isAuthenticated && (
          <Button onClick={handleLogout} variant="outline">
            Se déconnecter
          </Button>
        )}
      </div>

      {isAuthenticated && user ? (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-900">
            <strong>Connecté en tant que :</strong> {user.firstName}{" "}
            {user.lastName}
          </p>
          <p className="text-blue-700 text-sm">
            Email: {user.email} | Rôle: {user.role.label}
          </p>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-gray-600">
            Vous n'êtes pas connecté.{" "}
            <a href="/login" className="text-blue-600 underline">
              Se connecter
            </a>
          </p>
        </div>
      )}

      <p className="text-gray-600">
        Bienvenue sur le mini blog. Liste des articles à venir...
      </p>
    </div>
  );
};

export default HomePage;
