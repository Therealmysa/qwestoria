
import { Link } from "react-router-dom";
import { Instagram, Twitch, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import BradHubLogo from "../BradHubLogo";

const Footer = () => {
  const socialLinks = [
    { 
      name: "Snapchat", 
      url: "https://www.snapchat.com/add/bradcontv",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.404-5.965 1.404-5.965s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/></svg>,
      color: "from-yellow-400 to-yellow-600"
    },
    { 
      name: "TikTok", 
      url: "https://www.tiktok.com/@bradcon_tv",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>,
      color: "from-pink-500 to-red-500"
    },
    { 
      name: "Twitch", 
      url: "https://www.twitch.tv/bradcon91",
      icon: <Twitch className="h-4 w-4" />,
      color: "from-purple-500 to-purple-700"
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
      name: "Discord", 
      url: "https://discord.gg/bradhub",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>,
      color: "from-indigo-500 to-blue-600"
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
    <footer className="relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-[#0a0a1a] dark:via-[#1a1a35] dark:to-[#2a1a45] border-t border-gray-100 dark:border-white/10">
      {/* Glass effect overlay for dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/30 dark:from-black/20 dark:via-purple-900/10 dark:to-blue-900/10 dark:backdrop-blur-xl"></div>
      
      {/* Animated background particles */}
      <div className="hidden dark:block absolute inset-0 overflow-hidden">
        <div className="absolute w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-float" style={{ top: '20%', left: '10%', animationDelay: '0s' }}></div>
        <div className="absolute w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-float" style={{ top: '60%', right: '15%', animationDelay: '2s' }}></div>
        <div className="absolute w-40 h-40 bg-indigo-500/5 rounded-full blur-xl animate-float" style={{ bottom: '20%', left: '20%', animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-6">
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Brand section */}
          <motion.div 
            className="flex flex-col items-center lg:items-start space-y-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <BradHubLogo size="sm" withText={false} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Qwestoria
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">La communauté Fortnite ultime</p>
              </div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs text-center lg:text-left max-w-xs">
              Rejoignez des milliers de joueurs dans l'aventure Fortnite la plus épique !
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.div 
            className="flex flex-col items-center space-y-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Navigation</h4>
            <div className="grid grid-cols-2 gap-2">
              {footerLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to={link.path} 
                    className="group relative inline-block text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 text-sm"
                  >
                    <span className="relative z-10">{link.name}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Social media */}
          <motion.div 
            className="flex flex-col items-center lg:items-end space-y-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Suivez-nous</h4>
            <div className="flex flex-wrap justify-center lg:justify-end gap-2">
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
                  <div className={`absolute inset-0 bg-gradient-to-r ${link.color} rounded-lg blur opacity-50 group-hover:opacity-75 transition-all duration-300`}></div>
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-white/10 dark:backdrop-blur-md shadow-sm border border-gray-200 dark:border-white/20 text-gray-700 dark:text-gray-300 group-hover:text-white group-hover:border-transparent dark:group-hover:bg-white/20 transition-all duration-300">
                    {link.icon}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Divider */}
        <div className="relative mb-4">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/20 to-transparent"></div>
        </div>

        {/* Bottom section */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-between text-xs"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
            &copy; {new Date().getFullYear()} Qwestoria. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            {["Confidentialité", "Conditions", "Cookies"].map((item, index) => (
              <Link 
                key={item}
                to={`/${item.toLowerCase()}`} 
                className="group relative text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
