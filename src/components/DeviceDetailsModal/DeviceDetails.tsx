import React, { useMemo } from 'react';
import { OvalLoader } from '@ncent-holdings/ux-components';
import { twMerge } from 'tailwind-merge';
import BadgeStatus from '@components/BadgeStatus/BadgeStatus';
import SensorPurifierDetails from '@components/DeviceDetailsModal/SensorPurifierDetails';
import GatewayDetails from '@components/DeviceDetailsModal/GatewayDetails';
import { getProductType } from '@src/utils/produtTypes';
import { useDeviceDetailsContext } from '@src/contexts/DeviceDetailsContext/DeviceDetailsContext';
import { useDevice } from '@src/api-hooks/devices/devicesApi';
import { DeviceDetailsProps } from '@components/DeviceDetailsModal/common/types';

export const DeviceDetails: React.FC<DeviceDetailsProps> = ({ deviceId, onClose }) => {
  const deviceDetails = useDeviceDetailsContext();
  const { device, isLoading } = useDevice(deviceId || '', { skip: !deviceId });

  const handleClose = () => {
    deviceDetails.closeDetails();

    if (onClose) onClose();
  };

  const handleBack = () => {
    // Do nothing
    deviceDetails.goBack();
  };

  const deviceType = useMemo(() => {
    return getProductType(device);
  }, [device]);

  return (
    <>
      {isLoading && device == null && (
        <div className="h-full w-full">
          <OvalLoader />
        </div>
      )}
      {device != null && (
        <>
          {/*Heading*/}
          <div className="mb-5 flex justify-between">
            <div
              className={twMerge(
                'flex cursor-pointer items-center text-sm font-medium text-blue-brilliant',
                !deviceDetails.canGoBack && 'invisible',
              )}
              onClick={handleBack}
            >
              <i className="icon wcicon-chevron-left" />
              <div className="pl-[6px]">Back</div>
            </div>
            <div className="flex items-center gap-x-2.5">
              <div
                className={twMerge(
                  'invisible flex items-center gap-x-2.5 transition-all',
                  deviceDetails.isAdvanced && deviceDetails.saveStatus && 'visible',
                )}
              >
                <BadgeStatus status={deviceDetails.saveStatus || 'Saved'} />
                <div className="h-[14px] border-r border-card-stroke" />
              </div>
              <i className="icon wcicon-circle-xmark cursor-pointer" onClick={handleClose} />
            </div>
          </div>
          {/*Body*/}
          <div className="flex flex-1 flex-col">
            {['sensor', 'purifier'].includes(deviceType) && <SensorPurifierDetails device={device} />}
            {deviceType === 'gateway' && <GatewayDetails device={device} />}
          </div>
        </>
      )}
    </>
  );
};

export default DeviceDetails;
