
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Délai pour laisser la page se rendre complètement
    const timer = setTimeout(() => {
      // Sur mobile, utiliser scrollTo avec behavior smooth
      if (window.innerWidth <= 768) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto' // Auto pour éviter les conflits avec le scroll mobile
        });
      } else {
        // Sur desktop, scroll immédiat
        window.scrollTo(0, 0);
      }
    }, 50); // Petit délai pour éviter les conflits

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
