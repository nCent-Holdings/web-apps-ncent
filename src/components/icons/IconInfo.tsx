import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface IconInfoProps {
  className?: string;
}

export const IconInfo = ({ className }: IconInfoProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={twMerge('h-6 w-6 text-current', className)}>
      <path
        fillRule="evenodd"
        d="M12.083 5.667a6.417 6.417 0 100 12.833 6.417 6.417 0 000-12.833zM4.5 12.083a7.583 7.583 0 1115.167 0 7.583 7.583 0 01-15.167 0zm7-3.11c0-.323.261-.584.583-.584h.008a.583.583 0 110 1.167h-.008a.583.583 0 01-.583-.584zm.583 1.75c.322 0 .584.26.584.583v3.888a.583.583 0 01-1.167 0v-3.888c0-.323.261-.584.583-.584z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export default IconInfo;
