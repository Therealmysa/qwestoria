
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const MobileScrollDebug = () => {
  const [debugInfo, setDebugInfo] = useState('');
  const location = useLocation();

  useEffect(() => {
    const updateDebugInfo = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        const info = `
          Route: ${location.pathname}
          ScrollY: ${window.scrollY}
          Body Height: ${document.body.scrollHeight}
          Window Height: ${window.innerHeight}
          Body Overflow: ${getComputedStyle(document.body).overflow}
        `;
        setDebugInfo(info);
      }
    };

    updateDebugInfo();
    window.addEventListener('scroll', updateDebugInfo);
    window.addEventListener('resize', updateDebugInfo);

    return () => {
      window.removeEventListener('scroll', updateDebugInfo);
      window.removeEventListener('resize', updateDebugInfo);
    };
  }, [location.pathname]);

  // Only show in development and on mobile
  if (process.env.NODE_ENV === 'production' || window.innerWidth > 768) {
    return null;
  }

  return (
    <div className="debug-mobile-scroll">
      <pre style={{ fontSize: '10px', margin: 0 }}>
        {debugInfo}
      </pre>
    </div>
  );
};

export default MobileScrollDebug;
