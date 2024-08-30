import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface IconPencilSmallWideProps {
  className?: string;
}

export function IconPencilSmallWide({ className }: IconPencilSmallWideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
      className={twMerge('h-[.875rem] w-[.875rem] fill-current', className)}
    >
      <path
        fillRule="evenodd"
        d="M3.5 11.5h-.3c-.4 0-.7-.1-1.1-.4-.3-.3-.5-.8-.4-1.3L2 7.9c0-.4.2-.9.5-1.1l4.8-5.1c1.6-1.7 3-1 3.9-.2.7.7 1.1 1.5 1 2.2 0 .6-.3 1.2-.9 1.8l-.9.9-3.9 4.2c-.2.3-.7.5-1.1.6l-1.9.3zm6.9-9.1c-.9-.9-1.5-.6-2.2.1l-.6.6c.3 1.1 1.2 2 2.3 2.2l.6-.7c.4-.3.6-.7.6-1 0-.4-.2-.8-.7-1.2zM3.3 7.6c-.1.1-.2.4-.2.5l-.2 1.8c0 .1 0 .2.1.3.1.1.2.1.3.1l1.9-.3c.1 0 .4-.1.5-.2l3.2-3.5c-1-.4-1.9-1.2-2.3-2.2L3.3 7.6z"
        clipRule="evenodd"
      ></path>
      <path d="M1.8 12.2h10.4c.4 0 .7.3.7.6s-.3.6-.6.6H1.8c-.3 0-.6-.3-.6-.6s.3-.6.6-.6z"></path>
    </svg>
  );
}

export default IconPencilSmallWide;
