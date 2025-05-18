
import { Link } from "react-router-dom";

const Footer = () => {
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
            <h4 className="mb-4 font-semibold text-white">Community</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://tiktok.com/@bradcon91" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#9b87f5]"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#9b87f5]"
                >
                  Discord
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#9b87f5]"
                >
                  Instagram
                </a>
              </li>
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
