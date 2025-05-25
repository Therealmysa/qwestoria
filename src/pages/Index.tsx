
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import QwestoriaLogo from "@/components/BradHubLogo";
import { Award, Users, ShoppingBag, Star } from "lucide-react";

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
      description: "Accomplissez des missions et gagnez des QwestCoins pour débloquer des récompenses exclusives.",
      icon: <Award className="text-amber-500 dark:text-amber-400" />,
      color: "from-amber-500/20 to-amber-500/10 dark:from-amber-400/20 dark:to-amber-400/5",
      glow: "shadow-amber-500/20 dark:shadow-amber-400/20"
    },
    {
      title: "Boutique de récompenses",
      description: "Dépensez vos QwestCoins dans notre boutique pour obtenir des cartes cadeaux et objets exclusifs.",
      icon: <ShoppingBag className="text-purple-500 dark:text-purple-400" />,
      color: "from-purple-500/20 to-purple-500/10 dark:from-purple-400/20 dark:to-purple-400/5",
      glow: "shadow-purple-500/20 dark:shadow-purple-400/20"
    },
    {
      title: "Recherche de coéquipiers",
      description: "Trouvez facilement des partenaires de jeu qui correspondent à votre style et niveau.",
      icon: <Users className="text-teal-500 dark:text-teal-400" />,
      color: "from-teal-500/20 to-teal-500/10 dark:from-teal-400/20 dark:to-teal-400/5",
      glow: "shadow-teal-500/20 dark:shadow-teal-400/20"
    }
  ];

  return (
    <Layout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="px-4 py-16 text-gray-700 dark:text-white overflow-hidden">
          <div className="container mx-auto flex flex-col items-center relative z-10">
            {/* Background animated elements */}
            <div className="absolute inset-0 z-0">
              <motion.div
                className="absolute top-10 right-10 w-72 h-72 rounded-full bg-purple-500/10 dark:bg-[#9b87f5]/10 blur-3xl"
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
                className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-amber-500/10 dark:bg-amber-400/10 blur-3xl"
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
              <motion.div
                className="absolute top-40 left-20 w-64 h-64 rounded-full bg-teal-500/10 dark:bg-[#4ecdc4]/10 blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6 animate-bounce-slow"
            >
              <QwestoriaLogo size="lg" />
            </motion.div>

            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-6 text-center text-4xl font-bold bg-gradient-to-br from-purple-600 via-purple-500 to-amber-500 dark:from-white dark:via-[#f1c40f] dark:to-[#9b87f5] bg-clip-text text-transparent md:text-5xl lg:text-6xl"
            >
              La communauté Fortnite
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mb-8 max-w-2xl text-center text-lg text-gray-600 dark:text-gray-300"
            >
              La plateforme communautaire pour les fans de Fortnite avec missions,
              récompenses, boutique et recherche de coéquipiers.
            </motion.p>
            
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center"
            >
              <Link to="/missions">
                <Button className="min-w-[160px] bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 dark:from-[#9b87f5] dark:to-[#7654d3] dark:hover:from-[#8976e4] dark:hover:to-[#6443c2] text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 dark:hover:shadow-[#9b87f5]/30 rounded-full px-6">
                  Voir les missions
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="min-w-[160px] border border-amber-500 dark:border-[#f1c40f] bg-transparent text-amber-500 dark:text-[#f1c40f] hover:bg-amber-500/10 dark:hover:bg-[#f1c40f]/10 rounded-full px-6">
                  Rejoindre maintenant
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-16 relative overflow-hidden bg-white/70 dark:bg-transparent">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent dark:from-[#1A1F2C]/0 dark:via-[#1A1F2C] dark:to-[#1A1F2C]/0 pointer-events-none"></div>
          <div className="container mx-auto relative z-10">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-12 text-center text-3xl font-bold text-gradient"
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
                  className={`rounded-2xl bg-gradient-to-br ${item.color} backdrop-blur-sm p-8 shadow-lg hover:shadow-xl ${item.glow} border border-gray-200 dark:border-white/10 transition-all duration-300 card-hover`}
                >
                  <div className="mb-4 h-14 w-14 rounded-xl bg-white dark:bg-white/10 p-3 text-center shadow-inner flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="px-4 py-16 bg-gray-50/50 dark:bg-transparent relative overflow-hidden">
          <div className="container mx-auto relative z-10">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-12 text-center text-3xl font-bold text-gradient"
            >
              Ils adorent Qwestoria
            </motion.h2>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-white/5 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-lg border border-gray-100 dark:border-white/10 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 dark:from-[#9b87f5] dark:to-[#7654d3] flex items-center justify-center text-white font-bold">
                      {["A", "M", "L"][i-1]}
                    </div>
                    <div className="ml-3">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{["AlexGamer", "MegaSniper", "LoopRider"][i-1]}</h4>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {[
                      "Qwestoria a complètement changé ma façon de jouer à Fortnite. J'adore les défis quotidiens et les récompenses sont géniales !",
                      "J'ai trouvé des coéquipiers incroyables grâce à Qwestoria. La communauté est super sympa et l'interface est intuitive.",
                      "Les missions sont vraiment amusantes et me motivent à me connecter tous les jours. J'ai déjà gagné plein de QwestCoins !"
                    ][i-1]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-amber-500/20 dark:from-[#9b87f5]/20 dark:via-[#f1c40f]/20 dark:to-[#4ecdc4]/20 transform -translate-y-1/2 rounded-full blur-3xl"
          />
          <div className="container mx-auto flex flex-col items-center text-center relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="mb-8 p-6 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-md shadow-xl animate-glow"
            >
              <QwestoriaLogo size="lg" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-4 text-3xl font-bold text-gray-800 dark:text-white"
            >
              Prêt à rejoindre la communauté ?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-8 max-w-xl text-lg text-gray-600 dark:text-gray-300"
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
                <Button className="bg-gradient-to-r from-purple-500 to-amber-500 dark:from-[#9b87f5] dark:to-amber-400 font-semibold text-white hover:from-purple-600 hover:to-amber-600 dark:hover:from-[#8976e4] dark:hover:to-amber-500 rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
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
