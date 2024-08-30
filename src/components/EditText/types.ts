import { ReactNode } from 'react';

export type EditTextTypes = 'input' | 'phone';

export type EditTextProps = {
  id: string;
  name?: string;
  value: string;
  startAdornment?: ReactNode;
  type?: EditTextTypes;
  errorMessage?: string;

  onChange?: (value: string) => void;
  onBlur?: () => void;
  onSubmit?: () => void;
};
