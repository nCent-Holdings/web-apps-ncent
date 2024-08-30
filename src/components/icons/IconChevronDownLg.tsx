import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface IconChevronDownLgProps {
  className?: string;
}

export const IconChevronDownLg = ({ className }: IconChevronDownLgProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={twMerge('h-6 w-6 text-current', className)}>
      <path
        fillRule="evenodd"
        d="M11.47 15.53a.75.75 0 001.06 0l5-5a.75.75 0 10-1.06-1.06L12 13.94 7.53 9.47a.75.75 0 00-1.06 1.06l5 5z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export default IconChevronDownLg;
