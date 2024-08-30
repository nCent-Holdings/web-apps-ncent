import React from 'react';
import { ListProps } from './types';
import { twMerge } from 'tailwind-merge';

export const List = ({ data, className }: ListProps) => {
  return (
    <div
      className={twMerge(
        'overflow-x-auto overflow-y-auto rounded-lg border border-card-stroke bg-white py-2 pl-4 pr-5',
        className,
      )}
    >
      {data.map((item, i) => (
        <div key={i} className="flex h-[50px] flex-row items-center border-b border-card-stroke last:border-0">
          {item}
        </div>
      ))}
    </div>
  );
};

export default List;
