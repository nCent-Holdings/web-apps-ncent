import React from 'react';

export type TabData = {
  label: string;
  content: React.ReactNode;
};

export interface TabsProps {
  tabs: TabData[];
  containerClasses?: string;
}
