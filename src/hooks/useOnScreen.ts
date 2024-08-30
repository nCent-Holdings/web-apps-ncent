import { useCallback, useEffect, useMemo, useState } from 'react';

interface useOnScreenProps {
  ref: React.RefObject<HTMLElement>;
  options?: IntersectionObserverInit;
  delay?: number;
}

const useOnScreen = ({ ref, options, delay = 500 }: useOnScreenProps): boolean => {
  const [isIntersecting, setIntersecting] = useState(false);

  const handleObserverUpdate: IntersectionObserverCallback = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      setIntersecting(entry.isIntersecting);
    },
    [setIntersecting],
  );

  const observer = useMemo(() => {
    const observer = new IntersectionObserver(handleObserverUpdate, {
      ...{ delay },
      ...options,
    });
    return observer;
  }, [handleObserverUpdate, options]);

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return isIntersecting;
};

export default useOnScreen;
