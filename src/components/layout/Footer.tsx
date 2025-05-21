
import { Link } from "react-router-dom";
import { Instagram, Twitch, ExternalLink, Facebook, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import BradHubLogo from "../BradHubLogo";

const Footer = () => {
  const socialLinks = [
    { 
      name: "TikTok", 
      url: "https://www.tiktok.com/@bradcon_tv",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
    },
    { 
      name: "Twitch", 
      url: "https://www.twitch.tv/bradcon91",
      icon: <Twitch className="h-4 w-4" />
    },
    { 
      name: "Snapchat", 
      url: "https://www.snapchat.com/add/bradcontv",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c-1 0-2.4 1-2.7 3.5-.1.3-.3.4-.6.5-.8.2-2.2.8-2.2 2s1.6 2.1 2 2.5l.5.5c0 .3-.2.4-.5.6-.4.4-1 1-1 1.8 0 .7.3 1.8 3 2.5a.5.5 0 0 1 .4.5 1 1 0 0 0 .9.7c.6 0 1.2-.4 2.2-.4s1.6.4 2.2.4c.5 0 .8-.3.9-.7a.5.5 0 0 1 .4-.5c2.7-.7 3-1.8 3-2.5 0-.8-.6-1.4-1-1.8-.3-.2-.5-.3-.5-.6l.5-.5c.4-.4 2-1.2 2-2.5s-1.4-1.8-2.2-2c-.3-.1-.5-.2-.6-.5C14.4 3 13 2 12 2Z"></path></svg>
    },
    { 
      name: "Instagram", 
      url: "https://www.instagram.com/eymeric.alt/",
      icon: <Instagram className="h-4 w-4" />
    },
    { 
      name: "Twitter", 
      url: "https://twitter.com/bradcon_tv",
      icon: <Twitter className="h-4 w-4" />
    },
    { 
      name: "Facebook", 
      url: "https://facebook.com/bradcontv",
      icon: <Facebook className="h-4 w-4" />
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
    <footer className="bg-white dark:bg-[#1A1F2C] py-8 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and tagline */}
          <div className="flex items-center mb-6 md:mb-0">
            <BradHubLogo size="sm" />
            <div className="ml-3">
              <p className="text-sm font-medium">BradFlow</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">La communauté Fortnite</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="hidden md:flex space-x-6 text-xs">
            {footerLinks.slice(0, 5).map((link) => (
              <Link key={link.path} to={link.path} className="hover:text-primary transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Social Icons */}
          <div className="flex space-x-3">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-[#2A2532] text-gray-600 dark:text-gray-300 transition-all hover:bg-primary/10 dark:hover:bg-[#9b87f5]/20 hover:text-primary dark:hover:text-[#9b87f5]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.97 }}
                aria-label={link.name}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs">
          <p className="text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} BradFlow. Tous droits réservés.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-[#9b87f5]">Confidentialité</Link>
            <Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-[#9b87f5]">Conditions</Link>
            <Link to="/cookies" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-[#9b87f5]">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
