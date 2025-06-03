
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Simple scroll to top on route change
    window.scrollTo(0, 0);
    
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // Ensure proper viewport on mobile without interfering with scroll behavior
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
      
      console.log('ScrollToTop executed for:', pathname);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
