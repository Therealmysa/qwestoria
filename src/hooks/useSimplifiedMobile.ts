
import { useEffect, useState } from 'react';

export const useSimplifiedMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Sur mobile, réduire les animations mais GARDER la visibilité
      setShouldReduceMotion(mobile);
    };

    // Vérifier aussi les préférences utilisateur
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = () => {
      setShouldReduceMotion(mediaQuery.matches || isMobile);
    };

    checkMobile();
    handleMotionChange();
    
    window.addEventListener('resize', checkMobile);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, [isMobile]);

  return { 
    isMobile, 
    shouldReduceMotion: shouldReduceMotion && isMobile // Seulement sur mobile
  };
};
