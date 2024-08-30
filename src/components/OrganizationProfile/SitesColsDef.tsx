import React from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { toSentenceCase } from '../../utils';
import { Dropdown } from '@ncent-holdings/ux-components';
import { Site, Status, StatusMessages } from './types';

const columnHelper = createColumnHelper<Site>();

export function getColumns(
  actions: {
    onStatusChange: (newStatus: string, site: Site) => void;
  },
  admin?: boolean,
): ColumnDef<Site, string>[] {
  return [
    columnHelper.accessor('site', {
      header: () => <span className="whitespace-nowrap">{toSentenceCase('Site')}</span>,
      cell: (info) => <span className="capitalize text-black-soft">{info.getValue()}</span>,
      footer: (info) => info.column.id,
    }),
    ...(admin
      ? [
          columnHelper.accessor('siteHandle', {
            header: () => <span className="whitespace-nowrap">{toSentenceCase('Site Handle')}</span>,
            cell: (info) => <span className="text-black-soft">{info.getValue()?.toLowerCase()}</span>,
            footer: (info) => info.column.id,
          }),
        ]
      : []),
    columnHelper.accessor('address', {
      header: () => <span className="whitespace-nowrap">{toSentenceCase('Address')}</span>,
      cell: (info) => <span className="capitalize text-black-soft">{info.getValue()}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('creationDate', {
      header: () => <span className="whitespace-nowrap">{toSentenceCase('Creation Date')}</span>,
      cell: (info) => <span className="text-sm capitalize text-black-soft">{info.getValue()}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor((site) => site.status as string, {
      id: 'status',
      header: () => <span className="whitespace-nowrap">{toSentenceCase('Status')}</span>,
      cell: (info) => {
        const site = info.row.original;
        const status = info.getValue() as Status;
        const displayValue = StatusMessages[status] || 'Pending Installation';

        if (!admin) return displayValue;

        const statusOption = Object.entries(StatusMessages).map(([id, value]) => ({
          id,
          value,
          label: value,
        }));

        const defaultValue = {
          id: displayValue,
          value: displayValue,
          label: displayValue,
        };

        return (
          <div className="w-[90%]">
            <Dropdown
              containerClassExtend="py-0 mb-4"
              classNames={{
                container: () => 'w-full p-0',
                singleValue: () => 'not-italic text-black-soft font-medium',
                control: () => 'rounded-lg border border-solid border-grey-light-200 p-2',
                menu: () => 'not-italic text-black-soft leading-[115%] tracking-[-0.0416em]',
              }}
              value={defaultValue}
              options={statusOption}
              handleSelection={(items) => actions.onStatusChange(items[0]?.value, site)}
              isMulti={false}
            />
          </div>
        );
      },
      footer: (info) => info.column.id,
    }),
  ];
}
