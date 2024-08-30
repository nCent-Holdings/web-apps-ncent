import React from 'react';
import { DeviceIconProps, Devices, IconContainerProps } from './types';
import { IconSensor, IconPurifier, IconGateway } from '@ncent-holdings/ux-components';
import { tv } from 'tailwind-variants';
import { mapStatus } from './mapStatus';
import { twMerge } from 'tailwind-merge';

export const deviceCircle = tv({
  base: 'flex h-12 w-12 flex-[0_0_auto] items-center justify-center rounded-full border-[1.5px]',
  variants: {
    status: {
      common: 'border-grey-400',
      error: 'border-alert-error',
      warn: 'border-alert-issue',
      ok: 'border-alert-ok-medium',
    },
  },
});

const IconContainer = ({ children, status, containerClassName }: IconContainerProps) => {
  return <div className={twMerge(deviceCircle({ status }), containerClassName)}>{children}</div>;
};

const devicesMap: Record<Devices, React.ReactElement> = {
  sensor: <IconSensor />,
  gateway: <IconGateway />,
  purifier: <IconPurifier />,
  'basic purifier': <IconPurifier />,
  'advanced purifier': <IconPurifier />,
  'air purifier': <IconPurifier />,
  fallback: (
    // TODO: Placeholder icon for fallback devices
    <IconPurifier />
  ),
};

export const DeviceIcon = ({
  deviceType,
  connectivity,
  isAttentionRequired = false,
  containerClassName,
}: DeviceIconProps) => {
  const deviceIcon = deviceType ? devicesMap[deviceType] : devicesMap.fallback;

  const deviceStatus = mapStatus({
    connectivity,
    isGateway: deviceType === 'gateway',
    isAttentionRequired,
  });

  return (
    <IconContainer status={deviceStatus} containerClassName={containerClassName}>
      {deviceIcon}
    </IconContainer>
  );
};

export default DeviceIcon;
