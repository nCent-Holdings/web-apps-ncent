import React, { ReactEventHandler } from 'react';
import { twMerge } from 'tailwind-merge';
import { WellcubeLocation } from '../../../api-types/wellcube';
import SpaceLocation from '../../SpaceLocation';
import { useDeviceDetailsContext } from '@src/contexts/DeviceDetailsContext/DeviceDetailsContext';

export const GatewayDevice = ({
  deviceId,
  connectivity,
  isAttentionRequired,
  location,
  name,
}: {
  connectivity: string | undefined;
  isAttentionRequired: boolean;
  location?: WellcubeLocation;
  name: string;
  deviceId: string;
}) => {
  const deviceDetails = useDeviceDetailsContext();

  const handleClick: ReactEventHandler = (evt) => {
    if (connectivity !== 'uncommissioned') {
      deviceDetails.selectDevice(deviceId);
    } else {
      evt.preventDefault();
      evt.stopPropagation();
    }
  };

  return (
    <div
      className={twMerge(
        'max-w-[460px] border-b border-card-stroke bg-white px-6 py-4',
        connectivity !== 'uncommissioned' && 'cursor-pointer',
      )}
      onClick={handleClick}
    >
      <div className="mb-1 flex items-center">
        <div
          className={twMerge(
            'mr-1.5 h-1.5 w-1.5 rounded-full',
            connectivity === 'offline' && 'bg-alert-error-light',
            connectivity === 'uncommissioned' && 'bg-grey-400',
            connectivity === 'online' && isAttentionRequired && 'bg-alert-issue-medium',
            connectivity === 'online' && !isAttentionRequired && 'bg-alert-ok-light',
          )}
        />
        <div className="truncate text-bdy font-semibold text-grey-900">{name}</div>
      </div>
      <div className="pl-3 text-sm">
        <SpaceLocation
          location={location}
          inline
          topClassExtend="font-medium max-w-[100px]"
          localClassExtend="max-w-[400px]"
        />
      </div>
    </div>
  );
};

export default GatewayDevice;
