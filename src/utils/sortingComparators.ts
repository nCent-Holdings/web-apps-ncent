import { SpaceModel, DeviceModel } from '@src/api-types/models';

export function compareSpacesByCreatedAt(itemA: SpaceModel, itemB: SpaceModel) {
  const aCr = itemA?.['wellcube/space']?.created_at || '';
  const bCr = itemB?.['wellcube/space']?.created_at || '';

  if (aCr > bCr) return -1;
  if (aCr < bCr) return 1;
  return 0;
}

export function compareDevicesByCreatedAt(itemA: DeviceModel, itemB: DeviceModel) {
  const aCr = itemA?.['wellcube/device']?.created_at || '';
  const bCr = itemB?.['wellcube/device']?.created_at || '';

  if (aCr > bCr) return -1;
  if (aCr < bCr) return 1;
  return 0;
}
