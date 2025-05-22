
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-slate-100 dark:from-[#1A1F2C] dark:to-[#221F26] p-4 text-center">
      <div className="max-w-md w-full rounded-2xl bg-white dark:bg-[#1A1F2C]/50 backdrop-blur-sm p-8 shadow-xl border border-gray-100 dark:border-[#9b87f5]/20">
        <h1 className="mb-4 text-7xl font-bold text-primary dark:text-[#9b87f5] animate-pulse">404</h1>
        <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">Page non trouvée</h2>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
          Vous serez redirigé vers la page d'accueil dans quelques secondes...
        </p>
        <Link to="/">
          <Button className="bg-primary hover:bg-primary/90 dark:bg-[#9b87f5] dark:hover:bg-[#8976e4] text-white">
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
