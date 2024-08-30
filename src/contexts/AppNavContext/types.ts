import React from 'react';

export type AppNavContextType = {
  // Right Panel
  rightPanelContent: React.ReactNode;
  setRightPanelContent: (newContent: React.ReactNode) => void;
  rightPanelState: 'hidden' | 'default' | 'full' | 'overlay';
  isRightPanelVisible: boolean;
  showRightPanel: () => void;
  overlayRightPanel: () => void;
  hideRightPanel: () => void;
  expandRightPanel: () => void;
  shrinkRightPanel: () => void;
  // Left Nav
  leftNavContent: React.ReactNode;
  setLeftNavContent: (newContent: React.ReactNode) => void;
  leftNavState: string;
  expandLeftNav: () => void;
  collapseLeftNav: () => void;
  toggleLeftNav: () => void;
  overlayLeftNav: () => void;
  collapseLeftNavOverlay: () => void;
  hideLeftNav: () => void;
  // Top Nav
  topNavContent: React.ReactNode;
  setTopNavContent: (newContent: React.ReactNode) => void;
  isTopNavVisible: boolean;
  showTopNav: () => void;
  hideTopNav: () => void;
  // Sticky Header
  stickyHeaderContent: React.ReactNode;
  setStickyHeader: (newContent: React.ReactNode) => void;
  setStickyTitle: (newTitle: string) => void;
};

export interface AppNavProviderProps {
  children: React.ReactNode;
}
