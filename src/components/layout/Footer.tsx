
import { Link } from "react-router-dom";
import { Instagram, Twitch, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import BradHubLogo from "../BradHubLogo";

const Footer = () => {
  const socialLinks = [
    { 
      name: "TikTok", 
      url: "https://www.tiktok.com/@bradcon_tv",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2.5 h-5 w-5"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
    },
    { 
      name: "Twitch", 
      url: "https://www.twitch.tv/bradcon91",
      icon: <Twitch className="mr-2.5 h-5 w-5" />
    },
    { 
      name: "Snapchat", 
      url: "https://www.snapchat.com/add/bradcontv",
      icon: <img src="/snapchat-icon.svg" alt="Snapchat" className="mr-2.5 h-5 w-5" />
    },
    { 
      name: "Instagram", 
      url: "https://www.instagram.com/eymeric.alt/",
      icon: <Instagram className="mr-2.5 h-5 w-5" />
    },
  ];

  const footerLinks = [
    { name: "Accueil", path: "/" },
    { name: "Missions", path: "/missions" },
    { name: "Boutique", path: "/shop" },
    { name: "Classement", path: "/leaderboard" },
    { name: "Coéquipiers", path: "/teammates" },
  ];

  const footerSections = [
    {
      title: "Explorez",
      links: footerLinks.map((link) => ({ name: link.name, url: link.path }))
    },
    {
      title: "Communauté",
      links: [
        { name: "Discord", url: "https://discord.gg/bradflow" },
        { name: "Forum", url: "/forum" },
        { name: "Blog", url: "/blog" },
        { name: "FAQ", url: "/faq" },
      ]
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#1A1F2C]/80 to-[#221F26] pt-16 text-gray-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Logo and Description */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <BradHubLogo size="lg" />
            </div>
            <p className="mb-6 max-w-md text-base text-gray-400">
              La plateforme communautaire pour les fans de Fortnite avec missions,
              récompenses, BradCoins, boutique et recherche de coéquipiers.
            </p>
            
            {/* Social Icons with Animations */}
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2532] text-gray-300 transition-all hover:bg-[#9b87f5] hover:text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  aria-label={link.name}
                >
                  {link.icon}
                  <span className="sr-only">{link.name}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-2">
              <h3 className="mb-4 font-heading text-lg font-bold text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {link.url.startsWith("/") ? (
                        <Link 
                          to={link.url}
                          className="inline-flex items-center text-gray-400 transition-colors hover:text-[#9b87f5]"
                        >
                          {link.name}
                        </Link>
                      ) : (
                        <a 
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-gray-400 transition-colors hover:text-[#9b87f5]"
                        >
                          {link.name}
                          <ExternalLink className="ml-1 h-3 w-3 opacity-70" />
                        </a>
                      )}
                    </motion.div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div className="lg:col-span-4">
            <h3 className="mb-4 font-heading text-lg font-bold text-white">Restez connecté</h3>
            <p className="mb-4 text-gray-400">
              Inscrivez-vous pour recevoir les dernières actualités et mises à jour de BradFlow.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <input
                type="email"
                placeholder="Votre email"
                className="rounded-lg bg-[#2A2532] px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9b87f5]/50"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-lg bg-gradient-to-r from-[#9b87f5] to-[#7654d3] px-6 py-3 font-medium text-white shadow-lg shadow-[#9b87f5]/20 transition-all hover:shadow-xl hover:shadow-[#9b87f5]/30"
              >
                S'inscrire
              </motion.button>
            </div>
            
            <p className="mt-3 text-xs text-gray-500">
              En vous inscrivant, vous acceptez notre politique de confidentialité.
            </p>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8 pb-10">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} BradFlow. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-[#9b87f5]">Confidentialité</Link>
              <Link to="/terms" className="hover:text-[#9b87f5]">Conditions d'utilisation</Link>
              <Link to="/cookies" className="hover:text-[#9b87f5]">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
