import { Field, Input } from '@ncent-holdings/ux-components';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { MAX_NOTE_LENGTH } from './ClientApiSettings';

interface NoteProps {
  invalidApiKeyNote?: string;
  handleApiKeyNoteValidation?: (evt?: React.FormEvent<HTMLInputElement>) => void;
  handleOnBlur?: (evt?: React.FormEvent<HTMLInputElement>) => void;
  handleOnKeyDown?: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
  value?: string;
}

export const Note = ({
  invalidApiKeyNote,
  handleApiKeyNoteValidation,
  handleOnBlur,
  handleOnKeyDown,
  className,
  label,
  value,
}: NoteProps) => {
  return (
    <Field
      htmlFor="note"
      label={label || ''}
      labelClass={label ? 'text-grey-500 my-3 font-medium' : ''}
      labelSize="small"
      errorMsg={invalidApiKeyNote}
    >
      <div className={twMerge('w-[600px]', className)}>
        <Input
          id="note"
          type="text"
          placeholder="Usage note (90 characters)"
          name="deviceName"
          onChange={handleApiKeyNoteValidation}
          onKeyDown={handleOnKeyDown}
          onBlur={handleOnBlur}
          value={value}
          hasError={invalidApiKeyNote !== ''}
          maxLength={MAX_NOTE_LENGTH + 1}
        />
      </div>
    </Field>
  );
};

export default Note;
