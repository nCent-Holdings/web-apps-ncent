import React from 'react';
import { twMerge } from 'tailwind-merge';
import deviceTooltips from './DeviceTooltips';

type DeviceConnectivityProps = {
  status: 'online' | 'offline' | string | undefined;
  classExtend?: string | undefined;
};

export const DeviceConnectivity: React.FC<DeviceConnectivityProps> = ({ status, classExtend }) => {
  let statusColor;
  let statusText = status;

  if (status === 'online') {
    statusColor = '#00B047';
  } else if (status === 'offline') {
    statusColor = '#D33F00';
  } else {
    statusColor = '#F0F';
    statusText = 'Unknown';
  }

  return (
    <>
      <div
        data-tooltip-id="dd-connectivity"
        className={twMerge('flex max-w-[108px] items-center', classExtend && `${classExtend}`)}
      >
        <div className="mr-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: statusColor }} />
        <div className="text-sm capitalize text-black-soft">{statusText}</div>
      </div>
      {deviceTooltips.ConnectivityTooltip('dd-connectivity')}
    </>
  );
};

export default DeviceConnectivity;
