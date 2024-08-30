import React, { useState } from 'react';
import CollapseSectionHeader from './CollapseSectionHeader';
import { twMerge } from 'tailwind-merge';

interface CollapseSectionProps {
  sectionName: string;
  contentClassName?: string;
  headerClassName?: string;
  children?: React.ReactNode;
}

const CollapseSection = ({ sectionName, headerClassName, contentClassName, children }: CollapseSectionProps) => {
  const [toggle, setToggle] = useState(true);

  const handleCollapse = () => {
    setToggle(!toggle);
  };

  return (
    <>
      <CollapseSectionHeader
        header={sectionName}
        handleToggleProfile={handleCollapse}
        showProfile={toggle}
        className={headerClassName}
      />
      <div className={twMerge(contentClassName)}>{toggle && children}</div>
    </>
  );
};

export default CollapseSection;
