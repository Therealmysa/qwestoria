
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import BradHubLogo from "@/components/BradHubLogo";

const Index = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const featureItems = [
    {
      title: "Missions quotidiennes",
      description: "Accomplissez des missions et gagnez des BradCoins pour débloquer des récompenses exclusives.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z" />
        </svg>
      )
    },
    {
      title: "Boutique de récompenses",
      description: "Dépensez vos BradCoins dans notre boutique pour obtenir des cartes cadeaux et objets exclusifs.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
        </svg>
      )
    },
    {
      title: "Recherche de coéquipiers",
      description: "Trouvez facilement des partenaires de jeu qui correspondent à votre style et niveau.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
      )
    }
  ];

  return (
    <Layout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="px-4 py-16 text-white overflow-hidden">
          <div className="container mx-auto flex flex-col items-center relative z-10">
            {/* Background animated elements */}
            <div className="absolute inset-0 z-0">
              <motion.div
                className="absolute top-10 right-10 w-72 h-72 rounded-full bg-[#9b87f5]/10 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#FFD700]/10 blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <BradHubLogo size="lg" />
            </motion.div>

            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-4 text-center text-4xl font-bold bg-gradient-to-br from-white via-[#FFD700] to-[#9b87f5] bg-clip-text text-transparent md:text-5xl lg:text-6xl"
            >
              La communauté Fortnite
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mb-8 max-w-2xl text-center text-lg"
            >
              La plateforme communautaire pour les fans de Fortnite avec missions,
              récompenses, boutique et recherche de coéquipiers.
            </motion.p>
            
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
            >
              <Link to="/missions">
                <Button className="min-w-[160px] bg-gradient-to-r from-[#9b87f5] to-[#FFD700] text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-[#9b87f5]/30 rounded-full px-6">
                  Voir les missions
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="min-w-[160px] border border-[#9b87f5] bg-transparent text-[#9b87f5] hover:bg-[#9b87f5]/20 rounded-full px-6">
                  Rejoindre maintenant
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1F2C]/0 via-[#1A1F2C] to-[#1A1F2C]/0 pointer-events-none"></div>
          <div className="container mx-auto relative z-10">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-8 text-center text-3xl font-bold text-[#9b87f5]"
            >
              Fonctionnalités principales
            </motion.h2>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {featureItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="rounded-xl bg-gradient-to-br from-[#221F26]/80 to-[#221F26]/40 backdrop-blur-sm p-6 shadow-lg border border-[#9b87f5]/10 hover:border-[#9b87f5]/30 transition-all duration-300"
                >
                  <div className="mb-4 h-14 w-14 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#FFD700] p-3 text-center text-white shadow-inner">
                    {item.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="text-gray-300">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#9b87f5]/80 to-[#FFD700]/80 skew-y-3 transform -translate-y-12"></div>
          <div className="container mx-auto flex flex-col items-center text-center relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-4 text-3xl font-bold text-white"
            >
              Prêt à rejoindre la communauté ?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-8 max-w-xl text-lg text-white/90"
            >
              Inscrivez-vous dès maintenant pour commencer à accomplir des missions
              et gagner des récompenses exclusives.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link to="/auth">
                <Button className="bg-white font-semibold text-[#9b87f5] hover:bg-gray-100 rounded-full px-6 shadow-lg">
                  Créer un compte
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
