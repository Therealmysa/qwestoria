
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useMobileScroll = () => {
  const location = useLocation();
  const isInitialLoad = useRef(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && isInitialLoad.current) {
      // Only reset scroll on initial page load or route change
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Reset any problematic styles only on route change
      document.body.style.transform = 'none';
      document.documentElement.style.transform = 'none';
      
      isInitialLoad.current = false;
      
      console.log('Mobile scroll reset for route change:', location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        lastScrollY.current = currentScrollY;
      };

      // Add scroll listener to track position
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        // Only reset on significant resize, not minor ones
        const resizeThreshold = 50;
        if (Math.abs(window.innerHeight - screen.height) > resizeThreshold) {
          window.scrollTo(0, 0);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return null;
};
