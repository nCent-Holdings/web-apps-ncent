import { VariantProps } from 'tailwind-variants';
import { deviceCircle } from './DeviceIcon';
import { WellcubeDevice } from '../../api-types/wellcube';

const devices = ['purifier', 'advanced purifier', 'basic purifier', 'sensor', 'gateway'];

export type Devices = (typeof devices)[number];
export type DeviceIconStatus = 'ok' | 'warn' | 'error' | 'common';

type CircleType = VariantProps<typeof deviceCircle>;
export interface IconContainerProps extends CircleType {
  children?: React.ReactNode;
  containerClassName?: string;
}
export interface DeviceIconProps {
  deviceType?: WellcubeDevice['device_type'];
  connectivity?: WellcubeDevice['status'];
  isAttentionRequired?: boolean;
  containerClassName?: string;
}
