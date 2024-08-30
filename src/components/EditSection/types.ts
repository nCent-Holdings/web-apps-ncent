import { ReactNode } from 'react';

export type TValidateCallback = (value: string) => TOptionalPromise<{ isValid: boolean; errorMessage?: string }>;

export interface EditSectionItem {
  key: string;
  value: string;
  startAdornment?: ReactNode;
  type?: 'dropdown' | 'input' | 'phone';
  options?: string[];
  validate?: TValidateCallback;
  readOnly?: boolean;

  title: string;
  titleClassExtend?: string;
  tooltip?: string;
}
