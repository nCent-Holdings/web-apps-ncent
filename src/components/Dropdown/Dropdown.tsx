import React from 'react';
import { DropdownProps } from './types';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const Dropdown = ({ classExtend, children, positionMenu = 'right', positionArrow = 'center' }: DropdownProps) => {
  return (
    <>
      <div
        className={clsx(
          'absolute top-0 z-[1] flex h-[11px] w-[20px] items-start justify-center overflow-hidden  pt-1',

          positionArrow === 'left' && 'left-5',
          positionArrow === 'right' && 'right-5',
          positionArrow === 'center' && 'left-1/2 -translate-x-1/2',
        )}
      >
        <div className=" h-[14px] w-[14px] rotate-[45deg] bg-[#F8FCFF] shadow-[0_0_0_1px] shadow-card-stroke"></div>
      </div>
      <div
        className={twMerge(
          clsx(
            'absolute top-[10px] w-auto rounded-lg border  border-card-stroke bg-white shadow-com-tooltip-shadow ',
            positionMenu === 'left' && '-left-2',
            positionMenu === 'right' && '-right-2',
            positionMenu === 'center' && 'left-1/2 -translate-x-1/2',
          ),
          classExtend,
        )}
      >
        {children}
      </div>
    </>
  );
};

export default Dropdown;
