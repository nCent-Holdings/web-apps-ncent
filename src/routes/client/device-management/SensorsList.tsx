import React from 'react';
import { SortingState } from '@tanstack/react-table';

import { SensorModel } from '../../../api-types/models';

import DevicesListBase from './DevicesListBase';
import { columns } from './SensorColsDef';

import { Sensor, DEVICE_TYPE } from './types';
import { dumpSensorModel } from './dumps';

export type SensorsListProps = {
  sensors: SensorModel[];
  loading?: boolean;
  emptyMessage?: React.ReactNode;
  sorting: SortingState;
  onSortChange: (newSorting: SortingState) => void;
  onClickCard?: (...args: any[]) => void;
};

const SensorsList: React.FC<SensorsListProps> = ({
  sensors,
  loading,
  emptyMessage,
  sorting,
  onSortChange,
  onClickCard,
}) => {
  const sensorsData: Sensor[] = sensors.map(dumpSensorModel);

  return (
    <DevicesListBase<Sensor>
      data={sensorsData}
      columns={columns}
      deviceType={DEVICE_TYPE.SENSOR}
      loading={loading}
      emptyMessage={emptyMessage}
      sorting={sorting}
      onSortChange={onSortChange}
      onClickCard={onClickCard}
    />
  );
};

export default React.memo(SensorsList);
