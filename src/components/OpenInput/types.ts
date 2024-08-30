import React from 'react';

export interface OpenInputProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  errorText?: string;
  hasError?: boolean;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm?: (value: string) => Promise<boolean> | boolean;
  value: string;
  isEditing?: boolean;
}
