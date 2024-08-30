import dayjs from 'dayjs';
import { DeviceModel, PurifierModel, SensorModel, GatewayModel } from '@src/api-types/models';
import getRelativeDateLabel from '../../../utils/getRelativeDateLabel';
import { Device, SensorStatus, Purifier, Sensor, Gateway, DevicesMeta, FanMode, FanSpeed } from './types';

import { getProductType } from '@src/utils/produtTypes';

const filterLifeRunningOutDays = 90;
const filterLifeCriticalDays = 30;

function dumpDeviceModel(device: DeviceModel): Device {
  const connectivity = device['wellcube/device']?.status;
  const isOffline = connectivity === 'offline';
  const isUncommissioned = connectivity === 'uncommissioned';

  const isAttentionRequired = isOffline || isUncommissioned;

  return {
    id: device.id,
    name: device.name,
    assetId: device['wellcube/device']?.asset_id,
    fullPath: device['wellcube/location']?.full_path,
    location: device['wellcube/location'],
    model: device['wellcube/device']?.model,
    deviceType: device['wellcube/device']?.device_type,
    connectivity,
    lastReportedTimestamp: device['wellcube/device']?.last_reported_timestamp,
    lastChangeTimestamp: device['wellcube/device']?.last_change_timestamp,
    isAttentionRequired,
    productType: getProductType(device),
  };
}

export function dumpSensorModel(sensor: SensorModel): Sensor {
  const dumpedDevice = dumpDeviceModel(sensor);

  const sensorStatus = getDeviceSensorStatus(sensor);
  const isSensorStatusOk = !sensorStatus || sensorStatus === 'operational';

  const isAttentionRequired = dumpedDevice.isAttentionRequired || !isSensorStatusOk;

  return {
    ...dumpedDevice,
    model: getSensorModel(sensor),
    sensorStatus,
    isAttentionRequired,
  };
}

// TODO: Remove default days_of_life value
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getFilterLifeData(changed_on: number = 0, days_of_life: number = 185): any {
  const filterReplaced = dayjs(changed_on);
  const currentDate = dayjs();
  const filterAge = currentDate.diff(filterReplaced, 'day');
  const filterLifeRemaining = Math.max(0, days_of_life - filterAge);
  const filterExpirationDate = filterReplaced ? filterReplaced.add(days_of_life, 'day').format('MM/DD/YYYY') : '';

  return {
    changeDate: filterReplaced,
    age: filterAge,
    lifeRemaining: filterLifeRemaining,
    filterExpirationDate,
  };
}

export function dumpPurifierModel(purifier: PurifierModel): Purifier {
  const dumpedDevice = dumpDeviceModel(purifier);

  const connectivity = purifier['wellcube/device']?.status;
  const filterLife = purifier['wellcube/purifier']?.filter_life;

  const { lifeRemaining, filterExpirationDate } = getFilterLifeData(filterLife?.changed_on, filterLife?.days_of_life);

  const isOnline = connectivity === 'online';
  const isUncommissioned = connectivity === 'uncommissioned';

  const sensorStatus = getDeviceSensorStatus(purifier);
  const isSensorStatusOk = !sensorStatus || sensorStatus === 'operational';

  const isFilterLifeCritical = !isUncommissioned && filterLife ? lifeRemaining < filterLifeCriticalDays : false;

  const isFilterLifeRunningOut =
    !isUncommissioned && filterLife ? lifeRemaining < filterLifeRunningOutDays && !isFilterLifeCritical : false;

  const isAttentionRequired = dumpedDevice.isAttentionRequired || !isSensorStatusOk || isFilterLifeCritical;

  return {
    ...dumpedDevice,
    model: getPurifierModel(purifier),
    sensorStatus,
    fanMode: getFanMode(purifier),
    filterLifeStatus: getFilterLifeStatus(purifier),

    isFilterLifeRunningOut,
    isFilterLifeCritical,
    isAttentionRequired,
    isOnline,
    filterExpirationDate,
  };
}

export function getDeviceSensorStatus(device: SensorModel | PurifierModel): SensorStatus {
  const connectivity = device['wellcube/device']?.status;

  if (!connectivity) return '';
  if (connectivity === 'uncommissioned') return '';
  if (connectivity === 'offline') return 'unknown';

  const sensorStatuses = device['sensor/status']?.statuses;

  if (!sensorStatuses) return '';

  if (sensorStatuses.length === 0) {
    return 'operational';
  }

  if (sensorStatuses.length === 1) {
    return sensorStatuses[0].label;
  }

  return 'multiple';
}

export function getFilterLifeStatus(purifier: PurifierModel): string {
  const connectivity = purifier['wellcube/device']?.status;
  const filterLife = purifier['wellcube/purifier']?.filter_life;

  const { lifeRemaining } = getFilterLifeData(filterLife?.changed_on, filterLife?.days_of_life);

  if (!filterLife || !connectivity) return '';
  if (connectivity === 'uncommissioned') return '';
  if (connectivity === 'offline') return 'unknown';
  if (lifeRemaining <= 0) return 'overdue';

  return getRelativeDateLabel(dayjs(), { days: lifeRemaining });
}

export function getFanMode(purifier: PurifierModel): Purifier['fanMode'] {
  const connectivity = purifier['wellcube/device']?.status;
  const wellcubePurifier = purifier['wellcube/purifier'];

  if (!wellcubePurifier) return undefined;
  if (!connectivity) return undefined;
  if (connectivity === 'uncommissioned') return undefined;

  return {
    mode: wellcubePurifier.fan_mode as FanMode,
    speed: wellcubePurifier.fan_speed as FanSpeed,
    cfm: wellcubePurifier.fan_cfm,
    percent: wellcubePurifier.fan_percent,
  };
}

export function getPurifierModel(purifier: PurifierModel): string {
  const model = purifier['wellcube/device']?.model || '';

  if (model === 'basic purifier') return 'WellCube Air';
  if (model === 'advanced purifier') return 'WellCube Air+';

  return model;
}

export function getSensorModel(sensor: SensorModel): string {
  const model = sensor['wellcube/device']?.model || '';

  if (model === 'sensor') return 'WellCube Sense+';
  if (model === 'advanced sensor') return 'WellCube Sense+';

  return model;
}

export function getGatewayModel(gateway: GatewayModel): string {
  const model = gateway['wellcube/device']?.model || '';

  if (model === 'gateway') return 'WellCube Connect';

  return model;
}

const defaultDevicesMeta: DevicesMeta = {
  commissioned: 0,
  uncommissioned: 0,
  total: 0,
  online: 0,
  offline: 0,
};

export function dumpGatewayModel(gateway: GatewayModel): Gateway {
  const dumpedDevice = dumpDeviceModel(gateway);

  const associatedDevices = gateway['wellcube/devices']?.meta;

  return {
    ...dumpedDevice,
    model: getGatewayModel(gateway),
    ipAddress: gateway['wellcube/device']?.network_id,
    associatedDevices: associatedDevices || defaultDevicesMeta,
    associatedPurifiers: associatedDevices?.purifiers || defaultDevicesMeta,
    associatedSensors: associatedDevices?.sensors || defaultDevicesMeta,
    serialNumber: gateway['wellcube/device']?.serial_number,
  };
}
