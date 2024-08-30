import React, { createContext, useContext, useState } from 'react';
import { ScrollContextType, ScrollProviderProps } from './types';

const ScrollContext = createContext<ScrollContextType>({} as ScrollContextType);

const ScrollContextProvider = ({ children }: ScrollProviderProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  const setIsVisibleElement = (isVisible: boolean) => {
    setIsVisible(isVisible);
  };

  const setTitleScroll = (title: string) => {
    setTitle(title);
  };

  return (
    <ScrollContext.Provider
      value={React.useMemo(
        () => ({
          isVisibleElement: isVisible,
          setIsVisibleElement,
          titleScroll: title,
          setTitleScroll: setTitleScroll,
        }),
        [isVisible, title],
      )}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export { ScrollContext, ScrollContextProvider };

export const useScrollContext = () => {
  return useContext(ScrollContext);
};
