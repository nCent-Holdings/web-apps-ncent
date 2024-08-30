import * as React from 'react';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  Row,
  Updater,
} from '@tanstack/react-table';

import { ReactTableProps } from './types';

import useOutsideClickHandler from '@src/hooks/useOutsideClickHandler';
import LoaderOverlay from '@components/LoaderOverlay/LoaderOverlay';

import sortingFns from './sortingFns';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export const Table = <T extends object>(props: ReactTableProps<T>) => {
  // We are required to work with props component in this TableWithGrouping component
  // to determine if sorting state is managed outside or not
  // by checking props.hasOwnProperty('sorting')
  const {
    data,
    dataLoading = false,
    columns,
    sorting = [],
    isEditEnabled = true,
    onSortChange,
    onEdit = undefined,
    onDelete = undefined,
    emptyMessage,
  } = props;
  const [tableSorting, setTableSorting] = React.useState<SortingState>(sorting);
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [toggleMenu, setToggleMenu] = React.useState(false);

  const wrappedMenuRef = React.useRef(null);
  useOutsideClickHandler(wrappedMenuRef, () => {
    setToggleMenu(false);
  });

  const handleClick = (index: any) => {
    setSelectedIndex(index);
    setToggleMenu(!toggleMenu);
  };

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
    state: {
      sorting: tableSorting,
    },
    onSortingChange: updateSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    sortingFns,
  });

  // () => onEdit((row.original as any).id), () => onDelete((row.original as any)))
  const renderDropdown = (row: Row<any>) => {
    const rowId = (row.original as any).id;

    return (
      <div className="absolute right-[3.5rem] top-[1.4rem] z-[10] flex flex-col">
        <div
          className={clsx(
            'absolute right-[-15px] top-[1.3rem] h-4 w-4 -translate-y-1/2',
            'after:border-6 after:absolute after:top-1/2 after:-translate-y-1/2 after:border-[8px] after:border-b-transparent after:border-l-[white] after:border-r-transparent after:border-t-transparent ',
            'before:border-6 before:absolute before:top-1/2 before:-translate-y-1/2 before:border-[9px] before:border-b-transparent before:border-l-card-stroke before:border-r-transparent before:border-t-transparent ',
          )}
        ></div>
        <div
          ref={wrappedMenuRef}
          className={clsx(
            ' w-44 flex-col gap-y-4 rounded-lg border border-card-stroke bg-white text-[.875rem] font-semibold leading-[1.25] text-black-soft shadow-com-tooltip-shadow [&>*:first-child]:border-t-0  [&>*]:border-t [&>*]:border-t-card-stroke',
          )}
        >
          {onEdit !== undefined && (
            <button className="block w-full cursor-pointer px-4 py-3 text-left  " onClick={() => onEdit(rowId)}>
              Edit
            </button>
          )}
          {onDelete !== undefined && (
            <button className="block w-full cursor-pointer px-4 py-3 text-left" onClick={() => onDelete(row.original)}>
              Delete
            </button>
          )}
        </div>
      </div>
    );
  };

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
    <table className="del-table min-w-full border-separate border-spacing-0">
      <thead className="del-thead">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr className="del-tr" key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                className={twMerge(
                  'del-th sticky top-0 z-10 items-start border-b border-b-[#D4DFEA] bg-white p-0 align-middle text-[0.75rem] font-medium text-black-soft transition initial:text-left [&:first-of-type_.del-th-content]:rounded-tl-2xl [&:last-of-type_.del-th-content]:rounded-tr-2xl',
                  'top-[calc(2rem+var(--titleonscroll-height))] ',
                  '[&:first-child>.del-th-content]:rounded-tl-2xl [&:last-child>.del-th-content]:rounded-tr-2xl ',
                  '[&:last-child_.del-th-content]:border-r [&:last-child_.del-th-content]:border-r-[#D4DFEA] [&_.del-th-content]:border-l [&_.del-th-content]:border-l-[#D4DFEA]',
                  '[&_.del-th-content]:border-t [&_.del-th-content]:border-t-[#D4DFEA]',
                )}
                key={header.id}
              >
                <div className="del-th-sticky-spacer absolute top-0 z-[-1] h-[calc(3rem+var(--titleonscroll-height))] w-full -translate-y-[calc(100%-1rem)] bg-white-background shadow-[1px_0_0_#ECF4FA]"></div>
                <div className="del-th-content h-14 bg-white">
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: twMerge(
                          'h-14 isolate relative before:absolute before:bottom-0 before:z-[1] before:left-0 before:right-0 before:h-[3px] before:bg-blue-brilliant font-semibold',
                          header.column.getCanSort() &&
                            'cursor-pointer select-none items-center justify-between inline-flex hover:text-blue-brilliant px-5 w-full gap-5 before:opacity-0',
                          header.column.getIsSorted() && 'text-blue-brilliant before:opacity-100',
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
            ))}
          </tr>
        ))}
      </thead>
      <tbody
        className={clsx(
          'del-tbody bg-[#F8FCFF]',
          '[&>tr:last-of-type>td:first-of-type]:rounded-bl-2xl [&>tr:last-of-type>td:last-of-type]:rounded-br-2xl',
          '[&_td:first-of-type]:border-l [&_td:first-of-type]:border-l-[#D4DFEB] [&_td:last-of-type]:border-r [&_td:last-of-type]:border-r-[#D4DFEB]',
          '[&_tr:last-of-type_td]:border-b [&_tr:last-of-type_td]:border-b-[#D4DFEB]',
        )}
      >
        <LoaderOverlay colSpan={columns.length} loading={dataLoading}>
          {!data.length && emptyMessage && (
            <tr className="animate-fade-in" style={{ animationDuration: `300ms` }}>
              <td colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          )}

          {table.getRowModel().rows.map((row, index) => (
            <tr
              className={clsx(
                'animate-fade-in',
                'del-tr relative',
                '[&:nth-child(even)>td]:bg-white [&:nth-child(odd)>td]:bg-[#F8FCFF]',
              )}
              style={{ animationDuration: `300ms` }}
              key={row.id}
            >
              {row.getVisibleCells().map((cell, idx, arr) => {
                const { _rowSpan: rowSpanData } = row.original as {
                  [key: string]: any;
                };
                const rowSpan = rowSpanData?.[cell.column.id];

                if (rowSpan === 0) return null;

                return (
                  <td
                    className={twMerge(
                      'del-td px-4 py-4 text-sm font-medium leading-[145%] text-black-soft ',
                      rowSpan ? 'align-top' : 'align-middle',
                      rowSpanData ? 'h-8' : 'h-[5.375rem]',
                      rowSpanData?.[arr[0].column.id] === 0 && '!border-l-0',
                      rowSpanData?.[arr[arr.length - 1].column.id] === 0 && '!border-r-0',
                    )}
                    key={cell.id}
                    rowSpan={rowSpan}
                  >
                    <div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                  </td>
                );
              })}

              {isEditEnabled && (
                <>
                  <button
                    className={clsx(
                      'absolute bottom-0 right-4 top-0 flex h-full w-[2rem] max-w-none cursor-pointer items-center justify-center',
                    )}
                    onClick={() => handleClick(index)}
                  >
                    <div
                      className={clsx(
                        'flex h-8 w-8 flex-col items-center justify-center rounded-full ',
                        // index === selectedIndex && toggleMenu && 'bg-black/5',
                      )}
                    >
                      <i className="icon icon-lg wcicon-dots-vertical " />
                    </div>
                  </button>
                  {index === selectedIndex && toggleMenu && renderDropdown(row)}
                </>
              )}
            </tr>
          ))}
        </LoaderOverlay>
      </tbody>
    </table>
  );
};

export default Table;
