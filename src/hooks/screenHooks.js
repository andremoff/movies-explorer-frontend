import { useEffect, useRef } from 'react';

export const useScreenResize = (setAdditionalMoviesCount) => {

  const resizeTimer = useRef(null);

  // Обработчик изменения размера экрана
  useEffect(() => {
    // Определение количества отображаемых фильмов на основе ширины экрана
    const checkScreenWidth = () => {
      const width = window.innerWidth;
      if (width >= 768) {
        setAdditionalMoviesCount(4);
      } else {
        setAdditionalMoviesCount(2);
      }
    };

    checkScreenWidth();

    const handleResize = () => {
      if (resizeTimer.current) {
        clearTimeout(resizeTimer.current);
      }

      resizeTimer.current = setTimeout(() => {
        checkScreenWidth();
      }, 300);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (resizeTimer.current) {
        clearTimeout(resizeTimer.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [setAdditionalMoviesCount]);
};