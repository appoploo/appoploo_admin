import React from 'react';
import { useWindowSize } from './useWindowSize';

type myRef<T = SVGSVGElement | null> = React.MutableRefObject<T>;
/**
 * Use it to get  parent width and height
 */
export function useParentDims(ref: myRef) {
  const [dims, setDims] = React.useState({ width: 0, height: 0 });
  const windowSize = useWindowSize();

  React.useEffect(() => {
    if (!ref.current) return;
    const c = ref.current;
    if (c && c.parentElement) {
      const p = c.parentElement;
      const width = p.clientWidth;
      const height = p.clientHeight;
      setDims({ width, height });
    }
  }, [windowSize, ref]);
  return dims;
}
