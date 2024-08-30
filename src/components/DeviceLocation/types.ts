import { WellcubeLocation } from '../../api-types/wellcube';

export type DeviceLocationProps = {
  location?: WellcubeLocation;
  deviceType?: 'sensor' | 'purifier' | 'gateway';
  deviceName: string;
  inline?: boolean;
  classExtend?: string;
  topClassExtend?: string;
  deviceClassExtend?: string;
  onClickDevice?: () => void;
};
