import React from 'react';

export interface TopNavContextType {
  content: React.ReactNode;
  setContent: (content: React.ReactNode | null) => void;
}
export interface LeftNavContextType {
  content: React.ReactNode;
  setContent: (content: React.ReactNode | null) => void;
}

export interface TopNavProviderProps {
  children: React.ReactNode;
}

export interface LeftNavProviderProps {
  children: React.ReactNode;
}

export interface ScrollContextType {
  isVisibleElement: boolean;
  titleScroll: string;
  setIsVisibleElement: (isVisible: boolean) => void;
  setTitleScroll: (title: string) => void;
}

export interface ScrollProviderProps {
  children: React.ReactNode;
}
