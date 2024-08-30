import React, { ReactElement, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type DeviceInfoProps = {
  label: string;
  children?: ReactNode | ReactElement | ReactElement[];
  classExtend?: string;
};

export const DeviceDetail: React.FC<DeviceInfoProps> = ({ label, children, classExtend }) => {
  return (
    <div className={twMerge('px-6 py-2.5', classExtend && `${classExtend}`)}>
      <div className="mb-0.5 text-mini text-grey-light-500">{label}</div>
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
};

export default DeviceDetail;
