import React, { createContext, useContext, useMemo, useState } from 'react';
import { AppNavContextType, AppNavProviderProps } from './types';

const AppNavContext = createContext<AppNavContextType>({} as AppNavContextType);

export const AppNavContextProvider = ({ children }: AppNavProviderProps) => {
  const [rightPanelState, setRightPanelState] = useState<'hidden' | 'default' | 'full' | 'overlay'>('hidden');
  const [rightPanelContent, setRightContent] = useState<React.ReactNode>(undefined);

  const isRightPanelVisible = useMemo(() => {
    return rightPanelState !== 'hidden';
  }, [rightPanelState]);

  const overlayRightPanel = () => {
    if (rightPanelState !== 'overlay') {
      setRightPanelState('overlay');
    }
  };

  const showRightPanel = () => {
    if (rightPanelState !== 'full') {
      setRightPanelState('full');
    }
  };

  const hideRightPanel = () => {
    setRightPanelState('hidden');
  };

  const shrinkRightPanel = () => {
    setRightPanelState('default');
  };

  const expandRightPanel = () => {
    setRightPanelState('full');
  };

  const setRightPanelContent = (newContent: React.ReactNode) => {
    setRightContent(newContent);
  };

  const [leftNavState, setLeftNavState] = useState<'expanded' | 'collapsed' | 'overlay' | 'hidden'>('expanded');
  const [leftNavContent, setLeftContent] = useState<React.ReactNode>(undefined);
  const expandLeftNav = () => {
    setLeftNavState('expanded');
  };

  const collapseLeftNav = () => {
    setLeftNavState('collapsed');
  };

  const overlayLeftNav = () => {
    if (leftNavState === 'collapsed') {
      setLeftNavState('overlay');
    }
  };

  const collapseLeftNavOverlay = () => {
    if (leftNavState === 'overlay') {
      setLeftNavState('collapsed');
    }
  };

  const hideLeftNav = () => {
    setLeftNavState('hidden');
  };

  const setLeftNavContent = (newContent: React.ReactNode) => {
    setLeftContent(newContent);
  };

  const toggleLeftNav = () => {
    if (leftNavState === 'overlay') {
      expandLeftNav();
    } else {
      collapseLeftNav();
    }
  };

  const [isTopNavVisible, setIsTopNavVisible] = useState(true);
  const [topNavContent, setTopContent] = useState<React.ReactNode>(undefined);

  const showTopNav = () => {
    setIsTopNavVisible(true);
  };

  const hideTopNav = () => {
    setIsTopNavVisible(false);
  };

  const setTopNavContent = (newContent: React.ReactNode) => {
    setTopContent(newContent);
  };

  const [stickyHeaderContent, setStickyHeaderContent] = useState<React.ReactNode>(<></>);
  const setStickyHeader = (newContent: React.ReactNode) => {
    setStickyHeaderContent(newContent);
  };
  const setStickyTitle = (newTitle: string) => {
    setStickyHeaderContent(
      <div className="  text-[1.25rem] font-semibold leading-[1.25] tracking-[-0.0625em] text-grey-600 ">
        <div className="mb-2">{newTitle}</div>
        <div className="h-2 w-[13rem] bg-blue-brilliant"></div>
      </div>,
    );
  };

  const memoVal = useMemo(
    (): AppNavContextType => ({
      leftNavState,
      expandLeftNav,
      collapseLeftNav,
      overlayLeftNav,
      hideLeftNav,
      collapseLeftNavOverlay,
      toggleLeftNav,
      leftNavContent,
      setLeftNavContent,
      isRightPanelVisible,
      rightPanelState,
      showRightPanel,
      overlayRightPanel,
      expandRightPanel,
      shrinkRightPanel,
      hideRightPanel,
      rightPanelContent,
      setRightPanelContent,
      isTopNavVisible,
      showTopNav,
      hideTopNav,
      topNavContent,
      setTopNavContent,
      stickyHeaderContent,
      setStickyHeader,
      setStickyTitle,
    }),
    [
      leftNavState,
      leftNavContent,
      isTopNavVisible,
      topNavContent,
      isRightPanelVisible,
      rightPanelContent,
      rightPanelState,
      stickyHeaderContent,
    ],
  );

  return <AppNavContext.Provider value={memoVal}>{children}</AppNavContext.Provider>;
};

export const useAppNav = () => {
  return useContext(AppNavContext);
};
