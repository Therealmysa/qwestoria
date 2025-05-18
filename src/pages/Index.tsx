
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const Index = () => {
  return (
    <Layout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1A1F2C] to-[#221F26] px-4 py-16 text-white">
          <div className="container mx-auto flex flex-col items-center">
            <h1 className="mb-4 text-center text-4xl font-bold text-[#9b87f5] md:text-5xl lg:text-6xl">
              Bienvenue sur <span className="text-white">BradHub</span>
            </h1>
            <p className="mb-8 max-w-2xl text-center text-lg text-gray-300">
              La plateforme communautaire pour les fans de Fortnite avec missions,
              récompenses, boutique et recherche de coéquipiers.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link to="/missions">
                <Button className="min-w-[160px] bg-[#9b87f5] text-white hover:bg-[#7E69AB]">
                  Voir les missions
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="min-w-[160px] border border-[#9b87f5] bg-transparent text-[#9b87f5] hover:bg-[#9b87f5]/20">
                  Rejoindre maintenant
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-[#1A1F2C] px-4 py-16">
          <div className="container mx-auto">
            <h2 className="mb-8 text-center text-3xl font-bold text-[#9b87f5]">
              Fonctionnalités principales
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-lg bg-[#221F26] p-6 shadow-lg">
                <div className="mb-4 h-14 w-14 rounded-full bg-[#9b87f5] p-3 text-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">Missions quotidiennes</h3>
                <p className="text-gray-300">
                  Accomplissez des missions et gagnez des BradCoins pour débloquer des récompenses exclusives.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="rounded-lg bg-[#221F26] p-6 shadow-lg">
                <div className="mb-4 h-14 w-14 rounded-full bg-[#9b87f5] p-3 text-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">Boutique de récompenses</h3>
                <p className="text-gray-300">
                  Dépensez vos BradCoins dans notre boutique pour obtenir des cartes cadeaux et objets exclusifs.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="rounded-lg bg-[#221F26] p-6 shadow-lg">
                <div className="mb-4 h-14 w-14 rounded-full bg-[#9b87f5] p-3 text-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">Recherche de coéquipiers</h3>
                <p className="text-gray-300">
                  Trouvez facilement des partenaires de jeu qui correspondent à votre style et niveau.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#9b87f5] px-4 py-16">
          <div className="container mx-auto flex flex-col items-center text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Prêt à rejoindre la communauté ?
            </h2>
            <p className="mb-8 max-w-xl text-lg text-white/80">
              Inscrivez-vous dès maintenant pour commencer à accomplir des missions
              et gagner des récompenses exclusives.
            </p>
            <Link to="/auth">
              <Button className="bg-white font-semibold text-[#9b87f5] hover:bg-gray-100">
                Créer un compte
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
