import React, { useEffect, useState } from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { ApiKey } from './types';
import { toSentenceCase } from '../../../utils';
import CopyClipboard from '@src/components/CopyClipboard';
import { formatDate } from '@src/utils/dateUtils';
import EditOffIcon from './icons/EditOffIcon.svg?react';
import EditOnIcon from './icons/EditOnIcon.svg?react';
import Note from './Note';
import { MAX_NOTE_LENGTH } from './ClientApiSettings';

const columnHelper = createColumnHelper<ApiKey>();

export function getColumns(actions: {
  onDelete: (evt: React.MouseEvent<Element, MouseEvent>, apiKeyData: ApiKey) => void;
  onUpdate: (apiKeyData: ApiKey) => void;
}): ColumnDef<ApiKey, string>[] {
  return [
    columnHelper.accessor('apiKey', {
      enableSorting: true,
      sortingFn: 'ASCIIAsc',
      header: () => <span className="whitespace-nowrap">{toSentenceCase('Api Key')}</span>,
      cell: (info) => (
        <div className="flex items-center gap-3">
          <span className="text-black-soft">{info.getValue()}</span>
          <div className="ml-auto">
            <CopyClipboard text={info.getValue()} />
          </div>
        </div>
      ),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('dateCreated', {
      header: () => <span className="whitespace-nowrap">{toSentenceCase('Date created')}</span>,
      cell: (info) => {
        const formattedCrDate = formatDate(info.getValue());
        return <span className="capitalize text-black-soft">{formattedCrDate}</span>;
      },
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('note', {
      header: () => <span className="whitespace-nowrap">{toSentenceCase('Note')}</span>,
      cell: (info) => {
        const [showEdit, setShowEdit] = useState(false);
        const [value, setValue] = useState('');
        const [invalidApiKeyNote, setInvalidApiKeyNote] = useState('');
        const rowData = info.row.original;
        const { apiKey }: ApiKey = rowData;

        useEffect(() => {
          if (rowData?.note) {
            setValue(rowData?.note);
          }
        }, [rowData?.note]);

        const handleApiKeyNoteValidation = (evt?: React.FormEvent<HTMLInputElement>) => {
          const { value } = evt?.target as HTMLInputElement;
          setValue(value);

          if (value?.length > MAX_NOTE_LENGTH) {
            setInvalidApiKeyNote(`You cannot enter more than ${MAX_NOTE_LENGTH} characters`);
            return;
          } else setInvalidApiKeyNote('');
        };

        const handleOnPressEnter = (evt: React.KeyboardEvent<HTMLInputElement>) => {
          if (evt.key === 'Enter' && invalidApiKeyNote?.length === 0) {
            const { value: newNote } = (evt?.target as HTMLInputElement) || {};

            const newData = {
              apiKey,
              note: newNote,
            };

            actions.onUpdate(newData);
            setShowEdit(false);
          }
        };

        const handleOnEdit = () => {
          setShowEdit(!showEdit);
          setValue(rowData?.note || '');
        };

        return (
          <div className="flex items-center">
            {showEdit ? (
              <div className="flex w-full items-center">
                <Note
                  handleOnKeyDown={handleOnPressEnter}
                  handleApiKeyNoteValidation={handleApiKeyNoteValidation}
                  invalidApiKeyNote={invalidApiKeyNote}
                  className="w-auto"
                  value={value}
                />
                <div
                  className="ml-auto cursor-pointer rounded bg-blue-brilliant p-[5px] shadow-icon-edit-active"
                  onClick={handleOnEdit}
                >
                  <EditOnIcon />
                </div>
              </div>
            ) : (
              <>
                <span className="capitalize text-black-soft">{info.getValue()}</span>
                <div className="ml-auto cursor-pointer" onClick={handleOnEdit}>
                  <EditOffIcon />
                </div>
              </>
            )}
          </div>
        );
      },
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('monthlyCalls', {
      header: () => <span className="whitespace-nowrap">{toSentenceCase('Monthly calls')}</span>,
      cell: (info) => <span className="flex justify-center capitalize text-black-soft">{info.getValue()}</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('action', {
      header: () => <span className="whitespace-nowrap">{toSentenceCase('Action')}</span>,
      cell: (info) => {
        const apiKey: ApiKey = info.row.original;

        return (
          <div
            className="flex h-full cursor-pointer justify-center hover:text-blue-brilliant"
            onClick={(evt) => actions.onDelete(evt, apiKey)}
          >
            <i className="icon wcicon-trash" />
          </div>
        );
      },
      footer: (info) => info.column.id,
    }),
  ];
}
