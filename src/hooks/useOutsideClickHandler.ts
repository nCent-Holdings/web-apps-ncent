import React, { useEffect } from 'react';

/**
 * Largely based on this SO post: https://stackoverflow.com/a/42234988
 * @param ref
 * @param onClickOutside
 */
export const useOutsideClickHandler = (ref: React.RefObject<HTMLElement>, onClickOutside: () => void) => {
  useEffect(() => {
    const handleClickOutside = (evt: MouseEvent) => {
      if (ref.current && !ref.current.contains(evt.target as Node)) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};

export default useOutsideClickHandler;
