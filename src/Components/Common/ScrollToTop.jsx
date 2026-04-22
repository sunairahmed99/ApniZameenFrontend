import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll to top on every route change (pathname or query params)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' for immediate reset, 'smooth' for animated
    });
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
