import { WellcubeLocation } from '../../../api-types/wellcube';

export enum DEVICE_TYPE {
  PURIFIER = 'PURIFIER',
  SENSOR = 'SENSOR',
  GATEWAY = 'GATEWAY',
}
export type SensorStatus = 'operational' | 'unknown' | 'multiple' | '' | string;
export type FanMode = 'auto' | 'manual' | 'standby';
export type FanSpeed = 'Off' | 'Low' | 'Medium' | 'High' | 'Turbo';

export enum FAN_SPEED {
  OFF = 0,
  LOW = 100,
  MEDIUM = 200,
  HIGH = 300,
  TURBO = 400,
}

export type FanCfm = FAN_SPEED.OFF | FAN_SPEED.LOW | FAN_SPEED.MEDIUM | FAN_SPEED.HIGH | FAN_SPEED.TURBO;

export type Device = {
  id: string;
  name: string;
  model?: string;
  deviceType?: string;
  assetId?: string;
  fullPath?: string;
  location?: WellcubeLocation;
  connectivity?: string;
  lastReportedTimestamp?: number;
  lastChangeTimestamp?: number;
  isAttentionRequired: boolean;
  productType?: string | undefined;
};

export type Purifier = Device & {
  sensorStatus: SensorStatus;
  fanMode?: {
    mode: FanMode;
    speed?: FanSpeed;
    cfm?: FanCfm;
    percent?: number;
  };
  filterLifeStatus: string;
  isFilterLifeRunningOut: boolean;
  isFilterLifeCritical: boolean;
  isOnline: boolean;
  filterExpirationDate: string;
};

export type Sensor = Device & {
  sensorStatus: SensorStatus;
};

export type Gateway = Device & {
  ipAddress?: string;
  serialNumber?: string;
  associatedDevices: DevicesMeta;
  associatedPurifiers: DevicesMeta;
  associatedSensors: DevicesMeta;
};

export type DevicesMeta = {
  commissioned: number;
  uncommissioned: number;
  total: number;
  online: number;
  offline: number;
};
