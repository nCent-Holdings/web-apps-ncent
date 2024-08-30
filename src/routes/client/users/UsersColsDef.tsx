import React from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Tooltip } from '@ncent-holdings/ux-components';
import { toSentenceCase } from '@src/utils';
import { UserActionsDropdown, UserPermissionsDropdown } from './user-dropdown';
import { type User } from './types';

const columnHelper = createColumnHelper<User>();

export const columns: ColumnDef<User, string>[] = [
  columnHelper.accessor('id', {
    header: () => <span className="whitespace-nowrap">{toSentenceCase('User')}</span>,
    cell: (info) => (
      <div className="max-w-[260px] truncate">
        <a href={`mailto:${info.row.original.email}`} className="text-blue-brilliant underline">
          {info.row.original.email}
        </a>
        {(info.row.original.secondName || info.row.original.firstName) && (
          <>
            <p className="capitalize text-grey-500" data-tooltip-id={`${info.getValue()}`}>
              {info.row.original.secondName}, {info.row.original.firstName}
            </p>
            <Tooltip
              tooltipId={`${info.getValue()}`}
              tooltipProps={{
                place: 'top-start',
              }}
              singleLine
            >
              {info.row.original.secondName}, {info.row.original.firstName}
            </Tooltip>
          </>
        )}
      </div>
    ),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('siteName', {
    header: () => (
      <span className="flex h-full items-center whitespace-nowrap px-5">{toSentenceCase('Site name')}</span>
    ),
    cell: (info) =>
      info.row.original.permissionScope === 'organization' ? (
        <span className=" capitalize text-black-soft">All sites</span>
      ) : (
        <div className="max-w-[260px] truncate">
          <span
            className=" capitalize text-black-soft"
            data-tooltip-id={`${info.getValue()}_${info.row.original.siteId}`}
          >
            {info.getValue()}
          </span>
          <Tooltip
            tooltipId={`${info.getValue()}_${info.row.original.siteId}`}
            tooltipProps={{
              place: 'top-start',
            }}
            singleLine
          >
            {info.getValue()}
          </Tooltip>
        </div>
      ),
    footer: (info) => info.column.id,
    enableSorting: false,
  }),
  columnHelper.accessor('permissionScope', {
    header: () => (
      <span className="flex h-full items-center whitespace-nowrap px-5">{toSentenceCase('Permissions')}</span>
    ),
    cell: (info) => <UserPermissionsDropdown user={info.row.original} />,
    footer: (info) => info.column.id,
    enableSorting: false,
  }),
  columnHelper.accessor('status', {
    header: () => <span className="flex h-full items-center whitespace-nowrap px-5">{toSentenceCase('Status')}</span>,
    cell: (info) => <span className="capitalize text-black-soft">{info.getValue().toLowerCase()}</span>,
    footer: (info) => info.column.id,
    enableSorting: false,
  }),
  columnHelper.accessor('statusDate', {
    header: () => (
      <span className="flex h-full items-center whitespace-nowrap px-5">{toSentenceCase('Status date')}</span>
    ),
    cell: (info) => <span className="capitalize text-black-soft">{info.getValue()}</span>,
    footer: (info) => info.column.id,
    enableSorting: false,
  }),
  columnHelper.display({
    id: 'action',
    header: () => (
      <span className="flex h-full items-center justify-center whitespace-nowrap px-5">{toSentenceCase('Action')}</span>
    ),
    cell: (info) => <UserActionsDropdown user={info.row.original} />,
    footer: (info) => info.column.id,
  }),
];
