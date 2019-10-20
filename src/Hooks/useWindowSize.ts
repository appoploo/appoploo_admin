import { useEffect, useState } from 'react';
import { debounce } from '../utils';

function getSize() {
  const { innerHeight, innerWidth, outerHeight, outerWidth } = window;
  return {
    innerHeight,
    innerWidth,
    outerHeight,
    outerWidth
  };
}

export function useWindowSize() {
  let [windowSize, setWindowSize] = useState(getSize());

  useEffect(() => {
    const resize = debounce(() => setWindowSize(getSize()), 350);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return windowSize;
}
