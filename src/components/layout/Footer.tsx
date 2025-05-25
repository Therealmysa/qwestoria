
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
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-3.037 0-6.5 1.35-6.5 6.086 0 1.85.65 3.491 1.214 4.327-.545.069-.932.137-1.214.203-.297.074-.297.297 0 .371.263.069.684.139 1.214.203-.557.836-1.214 2.478-1.214 4.327C5.5 22.65 8.963 24 12 24c3.037 0 6.5-1.35 6.5-6.086 0-1.85-.65-3.491-1.214-4.327.545-.069.932-.137 1.214-.203.297-.074.297-.297 0-.371-.263-.069-.684-.139-1.214-.203.557-.836 1.214-2.478 1.214-4.327C18.5 1.35 15.037 0 12 0zm0 3.429c1.446 0 2.571.57 2.571 2.657s-1.125 2.657-2.571 2.657-2.571-.57-2.571-2.657S10.554 3.429 12 3.429z"/></svg>,
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
    <footer className="relative overflow-hidden bg-white border-t border-gray-100">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/30"></div>

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
                <h3 className="text-lg font-bold text-gray-900">
                  BradFlow
                </h3>
                <p className="text-xs text-gray-600">La communauté Fortnite ultime</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs text-center lg:text-left max-w-xs">
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
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Navigation</h4>
            <div className="grid grid-cols-2 gap-2">
              {footerLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to={link.path} 
                    className="group relative inline-block text-gray-600 hover:text-purple-600 transition-all duration-300 text-sm"
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
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Suivez-nous</h4>
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
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm border border-gray-200 text-gray-700 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                    {link.icon}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Divider */}
        <div className="relative mb-4">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>

        {/* Bottom section */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-between text-xs"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-gray-500 mb-2 sm:mb-0">
            &copy; {new Date().getFullYear()} BradFlow. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            {["Confidentialité", "Conditions", "Cookies"].map((item, index) => (
              <Link 
                key={item}
                to={`/${item.toLowerCase()}`} 
                className="group relative text-gray-500 hover:text-purple-600 transition-all duration-300"
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
