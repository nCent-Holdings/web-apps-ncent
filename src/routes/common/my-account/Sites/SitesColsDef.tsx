import React from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Site } from './types';
import { toSentenceCase } from '@src/utils';

const columnHelper = createColumnHelper<Site>();

export function getColumns(): ColumnDef<Site, string>[] {
  return [
    columnHelper.accessor('organization', {
      header: () => <span className="whitespace-nowrap">{toSentenceCase('Organization')}</span>,
      cell: (info) => <span className="capitalize text-black-soft">{info.getValue()?.toLowerCase()}</span>,
      footer: (info) => info.column.id,
    }),

    columnHelper.accessor('site', {
      header: () => <span className="whitespace-nowrap">{toSentenceCase('Site')}</span>,
      cell: (info) => <span className="capitalize text-black-soft">{info.getValue()}</span>,
      footer: (info) => info.column.id,
    }),

    columnHelper.accessor('address', {
      header: () => <span className="whitespace-nowrap">{toSentenceCase('Address')}</span>,
      cell: (info) => <span className="capitalize text-black-soft">{info.getValue()}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('permission', {
      header: () => <span className="whitespace-nowrap">{toSentenceCase('Permission')}</span>,
      cell: (info) => <span className="capitalize text-black-soft">{info.getValue()}</span>,
      footer: (info) => info.column.id,
    }),
  ];
}
