
import { Link } from "react-router-dom";
import { Instagram, Twitch, ExternalLink, Facebook, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import BradHubLogo from "../BradHubLogo";

const Footer = () => {
  const socialLinks = [
    { 
      name: "TikTok", 
      url: "https://www.tiktok.com/@bradcon_tv",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>,
      color: "from-pink-500 to-red-500"
    },
    { 
      name: "Twitch", 
      url: "https://www.twitch.tv/bradcon91",
      icon: <Twitch className="h-4 w-4" />,
      color: "from-purple-500 to-purple-700"
    },
    { 
      name: "Snapchat", 
      url: "https://www.snapchat.com/add/bradcontv",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.404-5.965 1.404-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.562-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/></svg>,
      color: "from-yellow-400 to-yellow-600"
    },
    { 
      name: "Instagram", 
      url: "https://www.instagram.com/eymeric.alt/",
      icon: <Instagram className="h-4 w-4" />,
      color: "from-pink-500 via-red-500 to-yellow-500"
    },
    { 
      name: "Twitter", 
      url: "https://twitter.com/bradcon_tv",
      icon: <Twitter className="h-4 w-4" />,
      color: "from-blue-400 to-blue-600"
    },
    { 
      name: "Facebook", 
      url: "https://facebook.com/bradcontv",
      icon: <Facebook className="h-4 w-4" />,
      color: "from-blue-600 to-blue-800"
    },
  ];

  const footerLinks = [
    { name: "Accueil", path: "/" },
    { name: "Missions", path: "/missions" },
    { name: "Boutique", path: "/shop" },
    { name: "Classement", path: "/leaderboard" },
    { name: "Coéquipiers", path: "/teammates" },
    { name: "Blog", path: "/blog" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,171,0,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(139,92,246,0.2),transparent_50%)]"></div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{ x: Math.random() * 100 + "%", y: "100%" }}
            animate={{ 
              y: "-10%",
              x: Math.random() * 100 + "%"
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Brand section with glow effect */}
          <motion.div 
            className="flex flex-col items-center lg:items-start space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-amber-400 rounded-full blur-md opacity-75 animate-pulse"></div>
                <BradHubLogo size="md" withText={false} />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent">
                  BradFlow
                </h3>
                <p className="text-sm text-gray-300">La communauté Fortnite ultime</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm text-center lg:text-left max-w-xs">
              Rejoignez des milliers de joueurs dans l'aventure Fortnite la plus épique !
            </p>
          </motion.div>

          {/* Quick links with hover effects */}
          <motion.div 
            className="flex flex-col items-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white mb-2">Navigation</h4>
            <div className="grid grid-cols-2 gap-3">
              {footerLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to={link.path} 
                    className="group relative inline-block text-gray-300 hover:text-white transition-all duration-300"
                  >
                    <span className="relative z-10">{link.name}</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-amber-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Social media with animated icons */}
          <motion.div 
            className="flex flex-col items-center lg:items-end space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold text-white mb-2">Suivez-nous</h4>
            <div className="flex flex-wrap justify-center lg:justify-end gap-3">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${link.color} rounded-xl blur opacity-75 group-hover:blur-md transition-all duration-300`}></div>
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white group-hover:bg-white/20 transition-all duration-300">
                    {link.icon}
                  </div>
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {link.name}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Divider with gradient */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="w-32 h-px bg-gradient-to-r from-purple-500 via-amber-400 to-purple-500"></div>
          </div>
        </div>

        {/* Bottom section with enhanced styling */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-between text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-gray-400 mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} BradFlow. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            {["Confidentialité", "Conditions", "Cookies"].map((item, index) => (
              <Link 
                key={item}
                to={`/${item.toLowerCase()}`} 
                className="group relative text-gray-400 hover:text-white transition-all duration-300"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-purple-400 to-amber-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-to-t from-purple-500/20 to-transparent blur-3xl"></div>
    </footer>
  );
};

export default Footer;
