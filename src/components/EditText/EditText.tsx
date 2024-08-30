import React, { RefObject, useLayoutEffect, useRef, useState } from 'react';
import { Input, type InputProps } from '@ncent-holdings/ux-components';

import { EditTextTypes, EditTextProps } from './types';

const InputComponents: Record<EditTextTypes, React.FC<InputProps>> = {
  input: Input,
  phone: Input.Phone,
};

const EditText = ({
  id,
  name,
  value,
  startAdornment,
  type = 'input',
  errorMessage,

  onChange,
  onBlur,
  onSubmit,
}: EditTextProps) => {
  const [startAdornmentWidth, setStartAdornmentWidth] = useState<number | undefined>();
  const inputRef = useRef<RefObject<HTMLInputElement>>();
  const startAdornmentRef = useRef<HTMLSpanElement>(null);
  const InputComponent = InputComponents[type];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (onSubmit) onSubmit();
    }
  };

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.currentTarget.value);
  };

  useLayoutEffect(() => {
    const refRect = startAdornmentRef.current?.getBoundingClientRect();

    if (refRect) setStartAdornmentWidth(refRect.width);
  }, [startAdornmentRef, startAdornment]);

  return (
    <div className="flex w-full flex-1 flex-col">
      <InputComponent
        key={id}
        id={id}
        startAdornment={
          startAdornment && (
            <span ref={startAdornmentRef} className="pl-4 text-sm font-medium text-grey-light-400">
              {startAdornment}
            </span>
          )
        }
        name={`${name || id}`}
        value={value}
        type="text"
        inputRef={inputRef}
        onKeyDown={handleKeyDown}
        onChange={handleOnChange}
        onBlur={onBlur}
        style={startAdornment ? { paddingLeft: startAdornmentWidth } : {}}
      />
      {errorMessage && errorMessage.length > 0 && (
        <span className="text-[0.875rem] text-alert-error">{errorMessage}</span>
      )}
    </div>
  );
};

export default EditText;
