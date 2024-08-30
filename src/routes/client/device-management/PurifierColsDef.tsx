import React from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { twMerge } from 'tailwind-merge';
import { Button, Hint, StatusLabel, type StatusLabelType } from '@ncent-holdings/ux-components';

import { toSentenceCase, capitalize } from '../../../utils';

import SpaceLocation from '../../../components/SpaceLocation';

import { Purifier, SensorStatus } from './types';
import DeviceName from '@src/components/DeviceDetailsModal/common/DeviceName';
import DeviceIcon from '@src/components/DeviceIcon/DeviceIcon';

const columnHelper = createColumnHelper<Purifier>();

export function getColumns(actions: {
  onFanModeEdit: (evt: React.MouseEvent<Element, MouseEvent>, purifier: Purifier) => void;
  onReorder: (evt: React.MouseEvent<Element, MouseEvent>, purifier: Purifier) => void;
}): ColumnDef<Purifier, string>[] {
  return [
    columnHelper.accessor((purifier) => `${purifier.isAttentionRequired}`, {
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
        const purifier: Purifier = info.row.original;
        const { model, name, assetId, connectivity, deviceType, isAttentionRequired } = purifier;

        return (
          <div className="flex max-w-[220px] flex-row items-center gap-5">
            <DeviceIcon
              connectivity={connectivity}
              deviceType={deviceType}
              isAttentionRequired={isAttentionRequired}
              containerClassName="my-[9px]"
            />
            <div className="flex flex-col gap-1.5 ">
              <DeviceName name={name} model={model} modelClassExtend="mb-0 text-black-soft" />
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
      cell: (info) => <SpaceLocation location={info.row.original.location} classExtend="max-w-[180px]" />,
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
    columnHelper.accessor((purifier) => purifier.sensorStatus as string, {
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
    columnHelper.accessor((purifier) => `${purifier.fanMode?.speed || 0}`, {
      id: 'fanMode',
      enableSorting: true,
      sortingFn: 'alphanumericv2',
      header: () => <span className="whitespace-nowrap">{toSentenceCase('Mode')}</span>,
      cell: (info) => {
        const purifier: Purifier = info.row.original;
        const { fanMode } = purifier;

        if (!fanMode) {
          return <span className="whitespace-nowrap text-sm font-medium text-grey-600">--</span>;
        }

        const isManual = fanMode.mode === 'manual';
        const isStandby = fanMode.mode === 'standby';

        const mode = isManual ? `${fanMode.mode} @ ${fanMode.percent}%` : fanMode.mode;

        return (
          <div
            className={twMerge(
              'flex items-start whitespace-nowrap text-sm font-medium text-grey-600',
              !isStandby && 'flex-col',
              isStandby && 'flex-row gap-2',
            )}
          >
            <span>{toSentenceCase(mode || '--')}</span>

            <div className="flex flex-row items-center gap-2">
              {!isStandby && <span>{`${fanMode.cfm} CFM`} </span>}
              <Button
                variant="outline-primary"
                label={<i className="icon wcicon-pen icon-16" />}
                className="inline h-auto min-w-0 border-none p-0 text-sm hover:bg-transparent hover:text-blue-brilliant"
                onClick={(evt) => actions.onFanModeEdit(evt, purifier)}
              />
            </div>
          </div>
        );
      },
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('filterLifeStatus', {
      enableSorting: true,
      sortingFn: 'alphanumericv2',
      header: () => <span className="whitespace-nowrap">{toSentenceCase('Filter Life')}</span>,
      cell: (info) => {
        const purifier: Purifier = info.row.original;
        const {
          filterLifeStatus: value,
          isFilterLifeRunningOut,
          isFilterLifeCritical,
          isOnline,
          filterExpirationDate,
        } = purifier;

        let status: StatusLabelType;

        if (value && value === 'unknown') status = 'unknown';
        else if (value && isFilterLifeRunningOut) status = 'issue';
        else if (value && isFilterLifeCritical) status = 'error';
        else if (value) status = 'ok';

        const showHint = status === 'ok' || status === 'issue' || status === 'error';

        return (
          <div className="flex flex-col items-start">
            {showHint && (
              <Hint text={filterExpirationDate}>
                <StatusLabel label={toSentenceCase(value || '--')} status={status} />
              </Hint>
            )}
            {!showHint && <StatusLabel label={toSentenceCase(value || '--')} status={status} />}
            {isOnline && (isFilterLifeRunningOut || isFilterLifeCritical) && (
              <Button
                variant="outline-primary"
                label="REORDER"
                className="h-auto border-none p-0 pl-3.5 text-sm font-medium uppercase hover:bg-transparent hover:text-blue-brilliant"
                onClick={(evt) => actions.onReorder(evt, purifier)}
              />
            )}
          </div>
        );
      },
      footer: (info) => info.column.id,
    }),
  ];
}
