import React from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Org } from './types';
import { toSentenceCase } from '../../../utils';
import { NavLink } from 'react-router-dom';

const columnHelper = createColumnHelper<Org>();

export const columns: ColumnDef<Org, string>[] = [
  columnHelper.accessor('orgName', {
    header: () => <span className="whitespace-nowrap">{toSentenceCase('Organization')}</span>,
    cell: (info) => (
      <NavLink to={`/organizations/${info.row.original.orgHandle}`}>
        <span className="capitalize text-black-soft underline">{info.getValue()}</span>
      </NavLink>
    ),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('orgHandle', {
    header: () => <span className="whitespace-nowrap">{toSentenceCase('Handle')}</span>,
    cell: (info) => <span className="capitalize text-black-soft">{info.getValue()}</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('location', {
    header: () => <span className="whitespace-nowrap">{toSentenceCase('Location')}</span>,
    cell: (info) => <span className="capitalize text-black-soft">{info.getValue()}</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('technicalSales', {
    header: () => <span className="whitespace-nowrap">{toSentenceCase('Technical Sales')}</span>,
    cell: (info) => <span className="capitalize text-black-soft">{info.getValue()}</span>,
    footer: (info) => info.column.id,
  }),
];
