import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** 路由切换时回到页面顶部，改善阅读体验。 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}
