import * as React from 'react';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getExpandedRowModel,
  getGroupedRowModel,
  GroupingState,
  Updater,
  Row,
} from '@tanstack/react-table';
import LoaderOverlay from '@components/LoaderOverlay/LoaderOverlay';

import { TableWithGroupingProps } from './types';

import { twMerge } from 'tailwind-merge';

import './TableWithGrouping.css';
import sortingFns from './sortingFns';

export const TableWithGrouping = <T extends object>(props: TableWithGroupingProps<T>) => {
  // We are required to work with props component in this TableWithGrouping component
  // to determine if sorting state is managed outside or not
  // by checking props.hasOwnProperty('sorting')
  const {
    data,
    dataLoading = false,
    columns,
    groupByColumn,
    sorting = [],
    onSortChange,
    emptyMessage,
    onClickRow,
    renderGroupedRow,
    groupVariant = 'column',
    styleVariant = 'zebra',
  } = props;

  const [tableSorting, setTableSorting] = React.useState<SortingState>(sorting);
  const [tableGrouping, setTableGrouping] = React.useState<GroupingState>(groupByColumn ? [groupByColumn] : []);

  let currentGroupedRow: Row<T> | undefined;

  const updateSorting = (updater: Updater<SortingState>) => {
    if (!('sorting' in props)) {
      setTableSorting(updater);
    }

    if (onSortChange) {
      onSortChange(updater);
    }
  };

  React.useEffect(() => {
    if ('sorting' in props) {
      setTableSorting(sorting);
    }
  }, [sorting]);

  const table = useReactTable({
    data,
    columns,
    enableMultiSort: false,
    enableSortingRemoval: false,
    isMultiSortEvent: () => false,
    state: {
      sorting: tableSorting,
      expanded: true,
      grouping: tableGrouping,
    },
    onSortingChange: updateSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onGroupingChange: setTableGrouping,
    getGroupedRowModel: getGroupedRowModel(),
    sortingFns,
  });

  const renderSortIcon = (dir: string) => {
    return (
      <div
        className={twMerge(
          'flex h-8 w-6 flex-col items-center justify-center rounded-md border border-[#DDE2EC] text-[10px] leading-none text-black-soft',
          dir !== 'none' && 'border-blue-dark bg-white-soft',
        )}
      >
        <span className={dir === 'asc' ? 'text-grey-400' : ''}>
          <i className="icon wcicon-chevron-up" />
        </span>
        <span className={dir === 'desc' ? 'text-grey-400' : ''}>
          <i className="icon wcicon-chevron-down" />
        </span>
      </div>
    );
  };

  return (
    <table className="del-table isolate min-w-full border-separate border-spacing-0">
      <thead className="del-thead">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr className="del-tr" key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              if (header.column.getIsGrouped() && groupVariant !== 'column') {
                return null;
              }

              return (
                <th
                  className={twMerge(
                    'isolate',
                    'del-th sticky z-10 items-start border-b border-b-[#D4DFEA] p-0 align-middle text-[0.75rem] font-medium text-black-soft transition first:border-l-0 initial:text-left [&:first-of-type_.del-th-content]:rounded-tl-2xl [&:last-of-type_.del-th-content]:rounded-tr-2xl',
                    'top-[calc(2rem+var(--titleonscroll-height))] ',
                    '[&:first-child_.del-th-content]:border-l-0 [&_.del-th-content]:border-l [&_.del-th-content]:border-l-[#D4DFEA]',
                  )}
                  key={header.id}
                >
                  <div className=" del-th-sticky-spacer absolute top-0 z-[-1] h-[calc(3rem+var(--titleonscroll-height))] w-full -translate-y-[calc(100%-1rem)] bg-white-background shadow-[1px_0_0_#ECF4FA]"></div>
                  <div className="del-th-content z-[100] bg-white">
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: twMerge(
                            'h-14 isolate relative before:absolute before:bottom-0 before:z-[1] before:left-0 before:right-0 before:h-[3px] font-semibold',
                            header.column.getCanSort() &&
                              'cursor-pointer select-none items-center justify-between inline-flex hover:text-blue-brilliant px-5 w-full gap-5 before:opacity-0 before:bg-blue-brilliant',
                            header.column.getCanSort() &&
                              header.column.getIsSorted() &&
                              'text-blue-brilliant before:opacity-100',
                          ),
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort()
                          ? {
                              asc: renderSortIcon('asc'),
                              desc: renderSortIcon('desc'),
                            }[header.column.getIsSorted() as string] ?? renderSortIcon('none')
                          : null}
                      </div>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>

      <tbody className={`del-tbody_${styleVariant}`}>
        <LoaderOverlay colSpan={columns.length} loading={dataLoading}>
          {!data.length && emptyMessage && (
            <tr className="animate-fade-in" style={{ animationDuration: `300ms` }}>
              <td colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          )}

          {table.getRowModel().rows.map((row, rowIndex, rows) => {
            const isFirstInGroup = groupByColumn
              ? rows[rowIndex - 1] && rows[rowIndex - 1].getIsGrouped()
              : !rows[rowIndex - 1];

            const isLastInGroup = !rows[rowIndex + 1] || rows[rowIndex + 1].getIsGrouped();

            const groupingValue = groupByColumn && row.getGroupingValue(groupByColumn);

            const groupingCell = row.getVisibleCells().find((item) => item.column.id === groupByColumn);

            const renderGroupingCell = groupingCell
              ? flexRender(groupingCell?.column.columnDef.cell, groupingCell?.getContext())
              : groupingValue;

            const renderGroupingRow = renderGroupedRow ? renderGroupedRow(row) : groupingValue;

            const handleClickRow = (evt: any) => {
              if (onClickRow) {
                onClickRow(evt, row.original);
              }
            };

            if (row.getIsGrouped()) {
              currentGroupedRow = row;

              const cellAttr: Record<string, any> = {};

              if (groupVariant === 'column') {
                cellAttr.rowSpan = row.subRows.length + 1;
              } else if (groupVariant === 'row') {
                cellAttr.colSpan = row.getVisibleCells().length;
              }

              return (
                <tr
                  className={twMerge(
                    'animate-fade-in',
                    `del-tr_${styleVariant}`,
                    `del-tr_${styleVariant}--grouped-value`,
                  )}
                  style={{ animationDuration: `300ms` }}
                  key={row.id}
                >
                  <td
                    {...cellAttr}
                    className={twMerge(`del-td_${styleVariant}`, `del-td_${styleVariant}--grouped-value`)}
                  >
                    <>{groupVariant === 'column' ? renderGroupingCell : renderGroupingRow}</>
                  </td>
                </tr>
              );
            }

            return (
              <>
                <tr
                  className={`animate-fade-in del-tr_${styleVariant}`}
                  style={{ animationDuration: `300ms` }}
                  key={row.id}
                  onClick={handleClickRow}
                >
                  {row.getVisibleCells().map((cell) => {
                    return cell.getIsPlaceholder() ? null : (
                      <td
                        className={twMerge(
                          `del-td_${styleVariant}`,
                          isFirstInGroup && `del-td_${styleVariant}--first-in-group`,
                          isLastInGroup && `del-td_${styleVariant}--last-in-group`,
                        )}
                        key={cell.id}
                      >
                        <div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                      </td>
                    );
                  })}
                </tr>

                {/* Hack to have changing color rows */}
                {isLastInGroup && currentGroupedRow && currentGroupedRow.subRows.length % 2 === 0 ? (
                  <tr className={`del-tr_${styleVariant}`}></tr>
                ) : null}
              </>
            );
          })}
        </LoaderOverlay>
      </tbody>
      <tfoot className={`del-tfoot_${styleVariant}`}>
        <tr>
          <td className="h-5 rounded-bl-2xl rounded-br-2xl" colSpan={table.getAllColumns().length} />
        </tr>
      </tfoot>
    </table>
  );
};

export default TableWithGrouping;
