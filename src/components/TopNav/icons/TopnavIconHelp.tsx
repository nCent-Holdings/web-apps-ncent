import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface TopnavIconHelpProps {
  className?: string;
}

function TopnavIconHelp({ className }: TopnavIconHelpProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={twMerge('h-6 w-6 fill-current', className)}>
      <path d="M12 3.6a8.4 8.4 0 100 16.8 8.4 8.4 0 000-16.8zM2.4 12a9.6 9.6 0 1119.2 0 9.6 9.6 0 01-19.2 0zm9.812-3.376A1.648 1.648 0 0010.38 9.7a.6.6 0 01-1.133-.398 2.848 2.848 0 015.536.949c0 1.068-.793 1.786-1.392 2.185a5.874 5.874 0 01-1.23.62l-.025.008-.008.003h-.003a.6.6 0 11-.381-1.137l.015-.005a4.707 4.707 0 00.967-.487c.526-.35.857-.756.857-1.187a1.65 1.65 0 00-1.37-1.628l-.001.001zm-.851 6.876a.6.6 0 01.6-.6h.01a.6.6 0 110 1.2h-.01a.6.6 0 01-.6-.6z"></path>
    </svg>
  );
}

export default TopnavIconHelp;
