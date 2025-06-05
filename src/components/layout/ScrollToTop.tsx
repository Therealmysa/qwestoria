
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSimplifiedMobile } from '@/hooks/useSimplifiedMobile';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { isMobile } = useSimplifiedMobile();

  useEffect(() => {
    // Fermer tous les overlays ouverts avant de scroller
    const closeAllOverlays = () => {
      // Fermer les dropdowns
      document.querySelectorAll('[data-radix-popper-content-wrapper]').forEach(element => {
        const parent = element.parentElement;
        if (parent) {
          parent.style.display = 'none';
        }
      });

      // Fermer les drawers
      document.querySelectorAll('[data-vaul-drawer]').forEach(element => {
        const closeButton = element.querySelector('[data-vaul-drawer-close]') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      });
    };

    const performScroll = () => {
      if (isMobile) {
        // Sur mobile, s'assurer que tous les overlays sont fermés
        closeAllOverlays();
        
        // Attendre que les overlays se ferment
        setTimeout(() => {
          // Force le scroll immédiat sur mobile pour éviter les conflits
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto'
          });
          
          // S'assurer que le body reste scrollable
          document.body.style.overflowY = 'auto';
          document.body.style.position = 'relative';
        }, 100);
      } else {
        // Sur desktop, scroll immédiat
        window.scrollTo(0, 0);
      }
    };

    // Délai pour laisser React Router terminer la transition
    const timer = setTimeout(performScroll, 50);

    return () => clearTimeout(timer);
  }, [pathname, isMobile]);

  return null;
};

export default ScrollToTop;
