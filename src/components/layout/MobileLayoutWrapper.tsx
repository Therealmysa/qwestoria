
import { ReactNode, useEffect } from 'react';
import { useMobileScroll } from '@/hooks/useMobileScroll';

interface MobileLayoutWrapperProps {
  children: ReactNode;
}

const MobileLayoutWrapper = ({ children }: MobileLayoutWrapperProps) => {
  useMobileScroll();

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Apply mobile-specific body styles
      document.body.classList.add('mobile-body');
      document.documentElement.classList.add('mobile-html');
      
      return () => {
        document.body.classList.remove('mobile-body');
        document.documentElement.classList.remove('mobile-html');
      };
    }
  }, []);

  return (
    <div className="mobile-wrapper">
      {children}
    </div>
  );
};

export default MobileLayoutWrapper;
