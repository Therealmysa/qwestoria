
import { Link } from "react-router-dom";
import { Instagram, Twitch } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { 
      name: "TikTok", 
      url: "https://www.tiktok.com/@bradcon_tv",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
    },
    { 
      name: "Twitch", 
      url: "https://www.twitch.tv/bradcon91",
      icon: <Twitch className="mr-2 h-4 w-4" />
    },
    { 
      name: "Snapchat", 
      url: "https://www.snapchat.com/add/bradcontv",
      icon: <img src="/snapchat-icon.svg" alt="Snapchat" className="mr-2 h-4 w-4" />
    },
    { 
      name: "Instagram", 
      url: "https://www.instagram.com/eymeric.alt/",
      icon: <Instagram className="mr-2 h-4 w-4" />
    },
  ];

  return (
    <footer className="bg-[#221F26] py-8 text-gray-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#9b87f5]">BradHub</h3>
            <p className="mb-4 text-sm">
              La plateforme communautaire pour les fans de Fortnite avec missions,
              récompenses, boutique et recherche de coéquipiers.
            </p>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold text-white">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-[#9b87f5]">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/missions" className="hover:text-[#9b87f5]">
                  Missions
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#9b87f5]">
                  Boutique
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-[#9b87f5]">
                  Classement
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold text-white">Réseaux sociaux</h4>
            <ul className="space-y-3 text-sm">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-[#9b87f5] transition-colors"
                  >
                    {link.icon}
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 font-semibold text-white">Contact</h4>
            <p className="text-sm">
              <a 
                href="mailto:contact@bradhub.com" 
                className="hover:text-[#9b87f5]"
              >
                contact@bradhub.com
              </a>
            </p>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} BradHub. Tous droits réservés.</p>
          <p className="mt-1">
            BradHub n'est pas affilié à Epic Games, Inc. ni à Fortnite.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
