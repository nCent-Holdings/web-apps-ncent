import { useState, useEffect, useCallback, ReactNode } from 'react';
import { TValidateCallback } from './types';

export type TDataRecord = {
  key: string;
  value: string;
  startAdornment?: ReactNode;
  title: string;
  validate?: TValidateCallback;
  readOnly?: boolean;
};

export type TItem = {
  key: TDataRecord['key'];
  value: TDataRecord['value'];
  title: TDataRecord['title'];
  startAdornment?: TDataRecord['startAdornment'];

  isSubmitted: boolean;
  isTouched: boolean;

  errorMessage?: string;
  readOnly?: boolean;
};

type TUseEditModeParams = {
  initialData: TDataRecord[];

  onEdit?: (items: TItem[]) => TOptionalPromise<void>;
};

type TUseEditModeReturn = {
  items: TItem[];

  handleItemChange: (value: string, index: number) => void;
  handleSubmit: () => Promise<void>;
};

const useEditMode = ({ initialData, onEdit }: TUseEditModeParams): TUseEditModeReturn => {
  const [items, setItems] = useState<TItem[]>([]);

  useEffect(() => {
    const newItems: TItem[] = initialData.map((dataItem) => {
      return {
        key: dataItem.key,
        value: dataItem.value,
        startAdornment: dataItem.startAdornment,
        title: dataItem.title,
        readOnly: dataItem.readOnly,
        isSubmitted: false,
        isTouched: false,
      };
    });

    setItems(newItems);
  }, [initialData]);

  const changeItem = useCallback(
    (value: string, index: number, currentItems: TItem[]) => {
      if (initialData[index].readOnly) {
        return;
      }

      currentItems[index].value = value;
      currentItems[index].isTouched = true;
    },
    [initialData],
  );

  const validateItem = useCallback(
    async (value: string, index: number, currentItems: TItem[]) => {
      currentItems[index].errorMessage = '';

      const validate = initialData[index]?.validate;

      const { isValid, errorMessage } = validate ? await validate(value) : { isValid: true, errorMessage: '' };

      if (!isValid) {
        currentItems[index].errorMessage = errorMessage || 'Some error';
      }

      return currentItems;
    },
    [initialData],
  );

  const handleItemChange = (value: string, index: number) => {
    if (initialData[index].readOnly) {
      return;
    }

    const updatedItems = [...items];

    // changeItem updates value in "updatedItems"
    changeItem(value, index, updatedItems);

    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    const updatedItems = [...items];

    const validatePromises = updatedItems.map((item, index) => {
      if (!item.isTouched) {
        return;
      }

      // validateItem updates errorMessage in "updatedItems"
      return validateItem(item.value, index, updatedItems);
    });

    await Promise.all(validatePromises);

    setItems(updatedItems);

    if (updatedItems.find((item) => item.errorMessage)) {
      return;
    }

    if (onEdit) {
      const editedItems = updatedItems.filter((item) => item.isTouched);

      await onEdit(editedItems);
    }

    updatedItems.forEach((item) => {
      item.isSubmitted = true;
      item.isTouched = false;
    });

    setItems(updatedItems);
  };

  return {
    items,

    handleItemChange,
    handleSubmit,
  };
};

export default useEditMode;
