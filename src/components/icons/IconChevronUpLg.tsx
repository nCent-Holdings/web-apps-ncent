import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface IconChevronUpLgProps {
  className?: string;
}
export const IconChevronUpLg = ({ className }: IconChevronUpLgProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={twMerge('h-6 w-6 text-current', className)}>
      <path
        fillRule="evenodd"
        d="M11.47 7.97a.75.75 0 011.06 0l5 5a.75.75 0 11-1.06 1.06L12 9.56l-4.47 4.47a.75.75 0 01-1.06-1.06l5-5z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export default IconChevronUpLg;
