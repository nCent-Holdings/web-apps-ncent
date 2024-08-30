import React from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { StatusLabel, type StatusLabelType } from '@ncent-holdings/ux-components';

import { toSentenceCase, capitalize } from '../../../utils';

import SpaceLocation from '../../../components/SpaceLocation';

import { Sensor, SensorStatus } from './types';
import DeviceName from '@src/components/DeviceDetailsModal/common/DeviceName';
import DeviceIcon from '@src/components/DeviceIcon/DeviceIcon';

const columnHelper = createColumnHelper<Sensor>();

export const columns: ColumnDef<Sensor, string>[] = [
  columnHelper.accessor((sensor) => `${sensor.isAttentionRequired}`, {
    enableSorting: true,
    enableGrouping: true,
    id: 'isAttentionRequired',
    header: () => '',
    cell: () => '',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('name', {
    enableSorting: true,
    sortingFn: 'alphanumericv2',
    header: () => <span className="whitespace-nowrap">{toSentenceCase('Device')}</span>,
    cell: (info) => {
      const sensor: Sensor = info.row.original;
      const { model, name, assetId, connectivity, deviceType, isAttentionRequired } = sensor;
      return (
        <div className="flex flex-row items-center gap-5">
          <DeviceIcon
            connectivity={connectivity}
            deviceType={deviceType}
            isAttentionRequired={isAttentionRequired}
            containerClassName="my-[9px]"
          />
          <div className="flex max-w-[180px] flex-col gap-1.5 ">
            <DeviceName name={name} model={model} modelClassExtend="mb-0" />
            {assetId && <span className="truncate text-mini text-grey-500">{assetId}</span>}
          </div>
        </div>
      );
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('fullPath', {
    enableSorting: true,
    sortingFn: 'fullPath',
    header: () => <span className="whitespace-nowrap">{toSentenceCase('Location')}</span>,
    cell: (info) => <SpaceLocation location={info.row.original.location} classExtend="max-w-[300px]" />,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('connectivity', {
    enableSorting: true,
    sortingFn: 'alphanumericv2',
    header: () => <span className="whitespace-nowrap">{toSentenceCase('Connectivity')}</span>,
    cell: (info) => {
      const value = info.getValue() === 'uncommissioned' ? 'Not commissioned' : info.getValue();
      let status: StatusLabelType = 'unknown';

      if (value === 'online') status = 'ok';
      else if (value === 'offline') status = 'error';

      return <StatusLabel label={toSentenceCase(value)} status={status} />;
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((sensor) => sensor.sensorStatus as string, {
    id: 'sensorStatus',
    enableSorting: true,
    sortingFn: 'alphanumericv2',
    header: () => <span className="whitespace-nowrap">{toSentenceCase('Sensor Status')}</span>,
    cell: (info) => {
      const value = info.getValue() as SensorStatus;
      let status: StatusLabelType;

      if (value && value === 'operational') status = 'ok';
      else if (value && value === 'unknown') status = 'unknown';
      else if (value) status = 'error';

      return <StatusLabel label={capitalize(value || '--')} status={status} />;
    },
    footer: (info) => info.column.id,
  }),
];
