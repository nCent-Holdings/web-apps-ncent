type DevicesMeta = {
  commissioned: number;
  uncommissioned: number;
  total: number;
  online: number;
  offline: number;
};

export type AssociatedDevicesTableProps = {
  associatedDevices: DevicesMeta;
  associatedSensors: DevicesMeta;
  associatedPurifiers: DevicesMeta;
};
