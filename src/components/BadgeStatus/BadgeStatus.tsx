import React from 'react';
import { BadgeStatusProps, StatusMap } from './types';
import { twMerge } from 'tailwind-merge';

export const BadgeStatus = ({ status, statusMessage, classExtend }: BadgeStatusProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-[3px] px-2 py-1 ${StatusMap[status].containerClass} transition-all`}
    >
      <span className={twMerge(`${StatusMap[status].textClass} text-[10px] font-medium transition-all`, classExtend)}>
        {statusMessage || status}
      </span>
    </div>
  );
};

export default BadgeStatus;
