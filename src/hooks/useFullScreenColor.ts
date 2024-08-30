import { useEffect, useState } from 'react';

export const useFullScreenColor = (color: string) => {
  const [convertedValue, setConvertedValue] = useState(0);

  useEffect(() => {
    const calculateConvertedValue = () => {
      const value = Math.round((-10 * Math.max(window.innerWidth, window.innerHeight)) / 100);
      setConvertedValue(value);
    };

    calculateConvertedValue();
    window.addEventListener('resize', calculateConvertedValue);
    return () => {
      window.removeEventListener('resize', calculateConvertedValue);
    };
  }, []);

  const fullScreenStyle = {
    backgroundColor: color,
    boxShadow: `0 0 0 ${Math.max(window.innerWidth, window.innerHeight) / 10}vmax ${color}`,
    clipPath: `inset(0 ${convertedValue}vmax)`,
  };

  return fullScreenStyle;
};
