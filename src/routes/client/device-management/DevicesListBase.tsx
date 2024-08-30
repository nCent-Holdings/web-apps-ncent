import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { SortingState, Updater } from '@tanstack/react-table';

import { TableWithGrouping, Row, ColumnDef } from '../../../components/Table';

import { DEVICE_TYPE, Device } from './types';
import { mergeSortingStates } from './utils';

const persistSorting: SortingState = [{ id: 'isAttentionRequired', desc: true }];

export type DevicesListBaseProps<T extends Device> = {
  data: Device[];
  columns: ColumnDef<T, string>[];
  deviceType: DEVICE_TYPE;
  loading?: boolean;
  emptyMessage?: ReactNode;
  sorting: SortingState;
  onSortChange: (newSorting: SortingState) => void;
  onClickCard?: (...args: any[]) => void;
};

const DevicesListBase = <T extends Device>({
  data,
  loading = false,
  columns,
  emptyMessage,
  sorting,
  onSortChange,
  onClickCard,
}: DevicesListBaseProps<T>) => {
  const extendedSorting = mergeSortingStates(persistSorting, sorting);

  const updateSorting = (updater: Updater<SortingState>) => {
    const newSorting: SortingState = typeof updater === 'function' ? updater(sorting) : updater;

    onSortChange(newSorting);
  };

  const renderGroupedRow = (row: Row<Device>) => {
    const isAttentionRequired = row.getGroupingValue('isAttentionRequired') === 'true';
    const rowsCount = row.subRows.length;

    return (
      <div>
        <div className="flex w-full flex-row gap-3 pb-5">
          {isAttentionRequired ? <img src="/icons/danger.svg?react" /> : <img src="/icons/tick-circle.svg?react" />}
          {isAttentionRequired ? `Attention required (${rowsCount})` : `Operating optimally (${rowsCount})`}
        </div>
        <div
          className={twMerge(
            'h-1.5 w-full rounded-t-lg',
            isAttentionRequired && 'bg-alert-issue',
            !isAttentionRequired && 'bg-alert-ok-medium',
          )}
        />
      </div>
    );
  };

  return (
    <TableWithGrouping
      data={data}
      dataLoading={loading}
      columns={columns}
      groupByColumn={'isAttentionRequired'}
      renderGroupedRow={renderGroupedRow}
      groupVariant="row"
      styleVariant="devices"
      sorting={extendedSorting}
      onSortChange={updateSorting}
      emptyMessage={emptyMessage}
      onClickRow={onClickCard}
    />
  );
};

export default DevicesListBase;
