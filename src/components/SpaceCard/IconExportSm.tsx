import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface IconExportSmProps {
  className?: string;
}

function IconExportSm({ className }: IconExportSmProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" className={twMerge('h-3 w-3 fill-current', className)}>
      <path d="M4.542.539c-1.275 0-2.323.251-3.037.966C.79 2.219.539 3.267.539 4.542v2.916c0 1.275.251 2.323.966 3.037.714.715 1.762.966 3.037.966h2.916c1.275 0 2.323-.251 3.037-.966.715-.714.966-1.762.966-3.037v-.972a.6.6 0 10-1.2 0v.972c0 1.156-.235 1.81-.614 2.189-.38.38-1.033.614-2.189.614H4.542c-1.156 0-1.81-.235-2.189-.614-.38-.38-.614-1.033-.614-2.189V4.542c0-1.156.235-1.81.614-2.189.38-.38 1.033-.614 2.189-.614h.972a.6.6 0 000-1.2h-.972z"></path>
      <path d="M7.928 1.139a.6.6 0 01.6-.6h2.333a.6.6 0 01.6.6v2.333a.6.6 0 11-1.2 0v-.885l-3.35 3.351a.6.6 0 11-.85-.848l3.352-3.351h-.885a.6.6 0 01-.6-.6z"></path>
    </svg>
  );
}

export default IconExportSm;
