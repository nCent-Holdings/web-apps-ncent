import React, { useMemo } from 'react';
import { DeviceLocationProps } from './types';
import { twMerge } from 'tailwind-merge';

import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from '@ncent-holdings/ux-components';
import { IconSensor, IconPurifier, IconGateway } from '@ncent-holdings/ux-components';

export const DeviceLocation = ({
  location,
  deviceType,
  deviceName,
  inline,
  classExtend,
  topClassExtend,
  deviceClassExtend,
  onClickDevice,
}: DeviceLocationProps) => {
  if (!location) {
    return <div className={twMerge('text-sm font-semibold', !!classExtend && classExtend)} />;
  }

  const tooltipId = useMemo(() => {
    return uuidv4();
  }, [location]);

  const deviceIcon = useMemo(() => {
    switch (deviceType) {
      case 'sensor':
        return <IconSensor />;
      case 'purifier':
        return <IconPurifier />;
      case 'gateway':
        return <IconGateway />;
      default:
        return null;
    }
  }, [deviceType]);

  const handleClickDevice = () => {
    if (!onClickDevice) return;

    onClickDevice();
  };

  return (
    <>
      <Tooltip tooltipId={tooltipId} singleLine tooltipProps={{ place: 'top-start' }}>
        {`${location?.full_path} > ${deviceName}`}
      </Tooltip>
      <div className={twMerge(inline && 'flex items-center', !!classExtend && classExtend)} data-tooltip-id={tooltipId}>
        <div
          className={twMerge(
            'text-sm font-medium text-black-light-soft',
            !inline && 'mb-0.5',
            inline && 'mr-1.5',
            !!topClassExtend && topClassExtend,
          )}
        >
          <div className="truncate">{location?.top_space}</div>
        </div>
        <div className={twMerge('flex items-center', !!deviceClassExtend && deviceClassExtend)}>
          {deviceIcon}
          <div
            className={twMerge(
              'truncate break-all text-sm font-medium',
              !!onClickDevice && 'cursor-pointer border-b border-blue-brilliant text-blue-brilliant',
            )}
            onClick={handleClickDevice}
          >
            {deviceName}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeviceLocation;
