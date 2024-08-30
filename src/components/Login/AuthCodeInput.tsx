import clsx from 'clsx';
import { Input } from '@ncent-holdings/ux-components';
import React, { RefObject, useEffect, useRef, useState, MutableRefObject } from 'react';

const DEFAULT_CODE_LENGTH = 6;
const DEFAULT_INPUT_PATTERN = '[0-9A-Za-z]';

export interface AuthCodeInputProps {
  codeLength?: number;
  pattern?: string;
  disabled?: boolean;
  error?: string;
  onEntered(code: string): Promise<void>;
  authCodeInputRef?: MutableRefObject<AuthCodeInputRef | undefined>;
}

export interface AuthCodeInputRef {
  getCode(): string;
  reset(): void;
  focus(): void;
}

export const AuthCodeInput: React.FC<AuthCodeInputProps> = ({
  codeLength = DEFAULT_CODE_LENGTH,
  pattern = DEFAULT_INPUT_PATTERN,
  disabled,
  error,
  onEntered,
  authCodeInputRef,
}) => {
  const [codes, setCodes] = useState(new Array(codeLength).fill(''));
  const [activeInput, setActiveInput] = useState(0);

  const inputsRefs = useRef<RefObject<HTMLInputElement>[]>(
    Array.from({ length: codeLength }, () => ({ current: null })),
  );

  const getCode = () => {
    return codes.join('');
  };

  const reset = () => {
    setCodes(new Array(codeLength).fill(''));
    setActiveInput(0);
  };

  const focus = () => {
    focusInput(activeInput);
  };

  if (authCodeInputRef) {
    authCodeInputRef.current = {
      getCode,
      reset,
      focus,
    };
  }

  useEffect(() => {
    setActiveInput(0);
  }, []);

  useEffect(() => {
    focusInput(activeInput);
  }, [activeInput]);

  useEffect(() => {
    if (codes.filter(Boolean).length === codeLength) {
      onEntered(codes.join(''));
    }
  }, [codes]);

  const focusInput = (inputIndex: number) => {
    if (inputsRefs.current[inputIndex] && inputsRefs.current[inputIndex].current) {
      inputsRefs.current[inputIndex].current?.focus();
    }
  };

  const updateCodes = (codeIndex: number, codeValue?: string) => {
    const newCodes = [...codes];

    newCodes[codeIndex] = codeValue;

    setCodes(newCodes);
  };

  const handleKeyDown = (evt: React.KeyboardEvent) => {
    if (evt.metaKey) {
      return;
    }

    const { name: fieldName } = evt.target as HTMLInputElement;
    const codeIndex = +fieldName;
    const codeValue = evt.key;

    const regex = new RegExp(`^${pattern}$`);

    if (regex.test(codeValue)) {
      updateCodes(codeIndex, codeValue);
      setActiveInput(codeIndex + 1);
    }

    if (evt.key === 'Backspace') {
      if (codes[codeIndex] !== '') {
        updateCodes(codeIndex, '');
      } else {
        updateCodes(codeIndex - 1, '');
      }

      if (codeIndex - 1 >= 0) {
        setActiveInput(codeIndex - 1);
      }
    }
  };

  const handlePaste = (evt: React.ClipboardEvent) => {
    const clipboardData = evt.clipboardData.getData('text');
    const codeData = clipboardData.slice(0, codeLength);

    const regex = new RegExp(`^${pattern}{${codeLength}}$`);
    if (regex.test(codeData)) {
      setCodes(codeData.split(''));
    }
  };

  return (
    <div className="flex flex-row max-sm:mt-8 max-sm:gap-3 sm:mt-14 sm:gap-[22px]" onFocus={focus}>
      {codes.map((codeValue, index) => {
        return (
          <Input
            key={`code-${index}`}
            inputRef={inputsRefs.current[index]}
            type="text"
            pattern={pattern}
            id={`code-${index}`}
            value={codeValue}
            name={`${index}`}
            onKeyDown={handleKeyDown}
            readonly
            isCustom
            onPaste={handlePaste}
            disabled={disabled || (!codeValue && activeInput !== index)}
            className={clsx(
              'rounded-lg border-2 border-solid border-black-soft bg-white-soft text-center font-spezia text-[32px] font-semibold leading-[130%] text-grey-300 outline-none focus:border-blue-brilliant focus:bg-white focus:shadow-com-input-codes disabled:border-grey-200 disabled:text-grey-200 max-sm:h-16 max-sm:w-12 sm:h-20 sm:w-[60px]',
              error && 'border-alert-error disabled:border-alert-error',
            )}
          />
        );
      })}
    </div>
  );
};

export default AuthCodeInput;
