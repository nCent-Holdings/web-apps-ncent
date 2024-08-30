import React from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { StatusLabel, type StatusLabelType } from '@ncent-holdings/ux-components';

import { toSentenceCase } from '../../../utils';

import SpaceLocation from '../../../components/SpaceLocation';
import AssociatedDevicesTable from '../../../components/AssociatedDevicesTable';

import { Gateway } from './types';
import DeviceName from '@src/components/DeviceDetailsModal/common/DeviceName';
import DeviceIcon from '@src/components/DeviceIcon/DeviceIcon';

const columnHelper = createColumnHelper<Gateway>();

export const columns: ColumnDef<Gateway, string>[] = [
  columnHelper.accessor((gateway) => `${gateway.isAttentionRequired}`, {
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
      const gateway: Gateway = info.row.original;
      const { model, name, assetId, connectivity, deviceType, isAttentionRequired } = gateway;

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
    cell: (info) => <SpaceLocation location={info.row.original.location} classExtend="max-w-[320px]" />,
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
      if (value === 'offline') status = 'error';

      return <StatusLabel label={toSentenceCase(value)} status={status} />;
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((gateway) => `${gateway.associatedDevices.total || 0}`, {
    enableSorting: true,
    sortingFn: 'alphanumericv2',
    id: 'associatedDevices',
    header: () => <span className="whitespace-nowrap">{toSentenceCase('Devices')}</span>,
    cell: (info) => {
      const gateway: Gateway = info.row.original;
      const { associatedDevices, associatedSensors, associatedPurifiers } = gateway;

      return (
        <AssociatedDevicesTable
          associatedDevices={associatedDevices}
          associatedSensors={associatedSensors}
          associatedPurifiers={associatedPurifiers}
        />
      );
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('ipAddress', {
    enableSorting: true,
    sortingFn: 'alphanumericv2',
    header: () => <span className="whitespace-nowrap">{'IP Address'}</span>,
    cell: (info) => <span className="text-center text-mini capitalize text-grey-600">{info.getValue() || '--'}</span>,
    footer: (info) => info.column.id,
  }),
];
