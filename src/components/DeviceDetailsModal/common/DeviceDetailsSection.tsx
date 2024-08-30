import React from 'react';
import { DeviceDetailsSectionProps } from './types';
import { twMerge } from 'tailwind-merge';

export const DeviceDetailsSection: React.FC<DeviceDetailsSectionProps> = ({
  heading,
  classExtend,
  children,
}: DeviceDetailsSectionProps) => {
  return (
    <div className={twMerge('flex flex-col rounded-xl border border-[#D4DFEA]', classExtend && `${classExtend}`)}>
      {/*Section Heading*/}
      <div
        className={twMerge(
          'rounded-t-2xl border-b border-[#D4DFEA] bg-grey-light-50 text-bdy font-semibold leading-tight tracking-[-0.5px] text-grey-900',
          typeof heading === 'string' && 'px-6 py-3 text-bdy',
        )}
      >
        {heading}
      </div>
      {/*Section Body*/}
      <div className="flex flex-1 flex-col rounded-b-2xl bg-white">{children}</div>
    </div>
  );
};

export default DeviceDetailsSection;
