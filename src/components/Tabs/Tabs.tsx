import React, { useState } from 'react';
import { TabsProps } from './types';

const Tabs = ({ tabs, containerClasses }: TabsProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <>
      <div
        className={`com-tabs-tabs flex space-x-2 bg-white p-2 ${containerClasses} w-max rounded-xl shadow-com-tab-container`}
      >
        {tabs.map((tab, idx) => {
          return (
            <button
              key={tab.label}
              className={`px-[22px] py-3 text-sm font-bold outline-none ${
                idx === activeTabIndex
                  ? 'rounded-[10px] border border-blue-brilliant bg-blue-brilliant text-white shadow-com-tab-selected'
                  : 'border-transparent text-grey-700'
              }`}
              onClick={() => setActiveTabIndex(idx)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="com-tabs-panel py-8">{tabs[activeTabIndex].content}</div>
    </>
  );
};

export default Tabs;
