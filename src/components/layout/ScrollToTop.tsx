
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Simple scroll to top on route change only
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
