import { DarwinThing, DarwinUser } from './core';
import {
  WellcubeDevice,
  WellcubeDevices,
  WellcubePurifier,
  WellcubeSensor,
  WellcubeSite as WellcubeSiteBase,
  WellcubeSpace,
  WellcubeSpaces,
  WellcubeGateway,
  WellcubeOrganization,
  WellcubeLocation,
  SensorOccupancy,
  SensorNoise,
  SensorStatus,
  PowerConsumption,
  SensorAqi,
  SensorLight,
  WellcubeUser,
  WellcubeCalibration,
  WellcubeFirmware,
  WellcubeSensorMapping,
  WellcubeUserPermissions,
} from './wellcube';
import { AirCo2, AirHumidity, AirPm10, AirPm25, AirTemperature, AirTvoc } from './air';

export interface OrganizationModel extends DarwinThing {
  'wellcube/organization'?: WellcubeOrganization;
}

export interface WellcubeSite extends WellcubeSiteBase {
  asset_list: {
    assetName: string;
    s3FilePath: string;
    url: string;
    file: { name: string; size: number; type: string };
  }[];
}
export interface OrgSiteModel extends DarwinThing {
  'wellcube/site'?: WellcubeSite;
  'wellcube/spaces'?: WellcubeSpaces;
}

export interface SpaceModel extends DarwinThing {
  'wellcube/space'?: WellcubeSpace;
  'wellcube/spaces'?: WellcubeSpaces;
  'wellcube/devices'?: WellcubeDevices;
  'wellcube/location'?: WellcubeLocation;
  'wellcube/sensor_mapping': WellcubeSensorMapping & {
    sensors_map: {
      [sensorId: string]: {
        local: boolean;
        pollutant_enabled: {
          [pollutant: string]: boolean;
        };
      };
    };
  };
}

export interface DeviceModel extends DarwinThing {
  'wellcube/device'?: WellcubeDevice;
  'wellcube/sensor'?: WellcubeSensor;
  'wellcube/purifier'?: WellcubePurifier;
  'wellcube/firmware'?: WellcubeFirmware;
  'wellcube/gateway'?: WellcubeGateway;
  'wellcube/location'?: WellcubeLocation;
  'sensor/occupancy'?: SensorOccupancy;
  'sensor/noise'?: SensorNoise;
  'air/pm25'?: AirPm25;
  'air/pm10'?: AirPm10;
  'air/tvoc'?: AirTvoc;
  'air/co2'?: AirCo2;
  'air/humidity'?: AirHumidity;
  'air/temperature'?: AirTemperature;
  'power/consumption'?: PowerConsumption;
}

export interface PurifierModel extends DeviceModel {
  'sensor/status'?: SensorStatus & {
    statuses: { label: string };
  };
  'sensor/aqi'?: SensorAqi;
  'sensor/light'?: SensorLight;
  'sensor/noise'?: SensorNoise;
  'sensor/occupancy'?: SensorOccupancy;
  'wellcube/calibration'?: WellcubeCalibration;
}
export interface SensorModel extends DeviceModel {
  'sensor/status'?: SensorStatus & {
    statuses: { label: string };
  };
  'sensor/aqi'?: SensorAqi;
  'sensor/light'?: SensorLight;
  'sensor/noise'?: SensorNoise;
  'sensor/occupancy'?: SensorOccupancy;
  'wellcube/calibration'?: WellcubeCalibration;
}

export interface GatewayModel extends DarwinThing {
  'wellcube/spaces'?: WellcubeSpaces;
  'wellcube/gateway'?: WellcubeGateway;
  'wellcube/device'?: WellcubeDevice;
  'wellcube/devices'?: WellcubeDevices;
  'wellcube/location'?: WellcubeLocation;
}

export interface UserModel extends DarwinUser {
  'wellcube/user'?: WellcubeUser & {
    invitation: {
      is_expired: boolean;
    };
  };
  'wellcube/user_permissions'?: WellcubeUserPermissions & {
    permissions: {
      group_id: string;
      organization_id: string;
      site_id?: string;
      scope: 'organization' | 'site' | 'space';
      type: 'admin' | 'member' | 'external';
      status_date: number;
    }[];
  };
}

export interface BrandModel extends DarwinThing {
  'ncent/brand'?: {
    brandname: string;
    domain: string;
  };
}
