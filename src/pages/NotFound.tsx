
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1A1F2C] to-[#221F26] p-4 text-center text-white">
      <h1 className="mb-4 text-6xl font-bold text-[#9b87f5]">404</h1>
      <h2 className="mb-6 text-2xl font-semibold">Page non trouvée</h2>
      <p className="mb-8 max-w-md text-gray-300">
        Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
        Vous serez redirigé vers la page d'accueil dans quelques secondes...
      </p>
      <Link to="/">
        <Button className="bg-[#9b87f5] text-white hover:bg-[#7E69AB]">
          Retour à l'accueil
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
