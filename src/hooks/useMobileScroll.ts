
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useMobileScroll = () => {
  const location = useLocation();
  const resetScrollRef = useRef<boolean>(false);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Force reset scroll position
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Reset any transform that might interfere
      document.body.style.transform = 'none';
      document.documentElement.style.transform = 'none';
      
      // Ensure proper scroll behavior
      document.body.style.overflowY = 'auto';
      document.documentElement.style.overflowY = 'auto';
      
      // Reset any height constraints
      document.body.style.height = 'auto';
      document.documentElement.style.height = 'auto';
      
      // Force a reflow
      resetScrollRef.current = true;
      setTimeout(() => {
        if (resetScrollRef.current) {
          window.scrollTo(0, 0);
          resetScrollRef.current = false;
        }
      }, 50);
      
      console.log('Mobile scroll reset triggered for:', location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        // Reset scroll on resize
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return null;
};
