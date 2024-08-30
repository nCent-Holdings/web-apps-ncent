import React, { ReactNode, useEffect, useRef } from 'react';
import { useScrollContext } from '../../contexts/ScrollContext';
import useOnScreen from '../../hooks/useOnScreen';
import { useAppNav } from '../../contexts/AppNavContext/AppNavContext';

interface ScrollVisibleElementProps {
  children?: ReactNode;
  scrollTitle?: string;
}

const ScrollVisibleElement = ({ children, scrollTitle }: ScrollVisibleElementProps) => {
  const appNav = useAppNav();

  const ref = useRef(null);
  const isVisible = useOnScreen({
    ref,
    options: {
      // rootMargin: '15%',
      threshold: 0.5,
      root: ref.current,
    },
    delay: 400,
  });
  const header = useScrollContext();

  useEffect(() => {
    if (scrollTitle) {
      appNav.setStickyTitle(scrollTitle);
    }

    return () => {
      // reset sticky header
      if (scrollTitle) {
        appNav.setStickyHeader(<></>);
      }

      header.setIsVisibleElement(true);
    };
  }, [scrollTitle]);

  useEffect(() => {
    header.setIsVisibleElement(isVisible);
  }, [isVisible]);

  return <div ref={ref}>{children}</div>;
};

export default ScrollVisibleElement;
