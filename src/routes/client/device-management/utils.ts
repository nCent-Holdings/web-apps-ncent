import { SortingState } from '@tanstack/react-table';
import { Gateway } from './types';

export function mergeSortingStates(sortingA: SortingState, sortingB: SortingState): SortingState {
  const filteredSortingB = sortingB.filter(
    (sortingBCol) => !sortingA.find((sortingACol) => sortingACol.id === sortingBCol.id),
  );

  return [...sortingA, ...filteredSortingB];
}

export function cleanGateways(gateways: Gateway[]): Gateway[] {
  const defaultValue = {
    ipAddress: '',
    associatedDevices: {
      commissioned: 0,
      uncommissioned: 0,
      total: 0,
      online: 0,
      offline: 0,
      sensors: {
        total: 0,
        online: 0,
        offline: 0,
        commissioned: 0,
        uncommissioned: 0,
      },
      purifiers: {
        total: 0,
        online: 0,
        offline: 0,
        commissioned: 0,
        uncommissioned: 0,
      },
    },
    associatedPurifiers: {
      total: 0,
      online: 0,
      offline: 0,
      commissioned: 0,
      uncommissioned: 0,
    },
    associatedSensors: {
      total: 0,
      online: 0,
      offline: 0,
      commissioned: 0,
      uncommissioned: 0,
    },
  };

  return gateways.map((item) => {
    if (item.connectivity === 'uncommissioned') {
      return {
        ...item,
        ...defaultValue,
      };
    } else {
      return item;
    }
  });
}
