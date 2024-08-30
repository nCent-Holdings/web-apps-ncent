import React, { useEffect, useState } from 'react';
import { OpenInputProps } from './types';
import { Field, Input } from '@ncent-holdings/ux-components';

export const OpenInput: React.FC<OpenInputProps> = ({
  id,
  name,
  label = '',
  placeholder,
  errorText = '',
  hasError = false,
  onChange,
  onConfirm,
  value = '',
}: OpenInputProps) => {
  useEffect(() => {
    setAutoFocus(true);
  }, []);

  const [autoFocus, setAutoFocus] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleKeyDown = async (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter' && onConfirm != undefined) {
      const confirmed = await onConfirm(value);

      if (confirmed) {
        setEditing(false);
      }
    }
  };

  const handleStartEditing = () => {
    if (!editing) setEditing(true);
  };

  const renderLabel = () => {
    return <div className="mb-2 text-[0.875rem] font-medium leading-[1.25] text-[#344054]">{label}</div>;
  };

  const handleInputChange = (evt: React.FormEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(evt as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  if (!editing) {
    if (value) {
      return (
        <>
          {renderLabel()}
          <div
            className="cursor-pointer text-[1rem] font-[600] leading-[1.25] tracking-[-.01rem] text-black-soft"
            onClick={handleStartEditing}
          >
            {value}
          </div>
        </>
      );
    } else {
      return (
        <Field label={label} htmlFor={id} errorMsg={errorText}>
          <>
            <Input
              autoFocus={autoFocus}
              id={id}
              inputSize="large"
              name={name}
              placeholder={placeholder}
              type="text"
              onChange={handleInputChange}
              onClick={handleStartEditing}
              value={value}
              hasError={hasError}
            />
          </>
        </Field>
      );
    }
  }

  return (
    <Field label={label} htmlFor={id} errorMsg={errorText}>
      <>
        <Input
          autoFocus={autoFocus}
          id={id}
          inputSize="large"
          name={name}
          placeholder={placeholder}
          type="text"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={value}
          hasError={hasError}
        />
      </>
    </Field>
  );
};

export default OpenInput;
