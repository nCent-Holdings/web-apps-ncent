import React from 'react';

export interface LeftNavSectionHdProps {
  title: string;
  hideSection?: boolean;
}

export const LeftNavSectionHd = ({ title, hideSection }: LeftNavSectionHdProps) => {
  if (hideSection) {
    return null;
  }

  return (
    <div className="mx-[.875rem] mb-1 mt-6 text-[.625rem] font-semibold uppercase leading-[1.25] text-[#475467]">
      <div className=" flex  items-center ">{title}</div>
    </div>
  );
};

export default LeftNavSectionHd;
