
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Always scroll to top on route change
    window.scrollTo(0, 0);
    
    // Force mobile scroll reset
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // Multiple attempts to ensure scroll reset
      setTimeout(() => window.scrollTo(0, 0), 0);
      setTimeout(() => window.scrollTo(0, 0), 100);
      setTimeout(() => window.scrollTo(0, 0), 200);
      
      // Reset any sticky positions or transforms
      const elements = document.querySelectorAll('*');
      elements.forEach(element => {
        const el = element as HTMLElement;
        if (el.style.position === 'sticky' || el.style.position === 'fixed') {
          // Temporarily reset and restore
          const originalPosition = el.style.position;
          el.style.position = 'static';
          setTimeout(() => {
            el.style.position = originalPosition;
          }, 50);
        }
      });
      
      console.log('ScrollToTop executed for:', pathname);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
