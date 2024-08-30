import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Toggletip } from '@ncent-holdings/ux-components';
import { twMerge } from 'tailwind-merge';

import Container from '../Layout/Container/Container';

import useEditMode, { type TItem } from './useEditMode';
import EditText from '../EditText';

import { EditSectionItem } from './types';
import useIdleTracker from '@src/hooks/useIdleTracker';
import IconPencilSmallWide from '@components/icons/IconPencilSmallWide';

// 3 seconds
const INPUT_SAVE_DELAY = 3;
const STATUS_TIMEOUT = 1500;

type SectionHeader = {
  title: string;
};

interface EditSectionProps {
  data: EditSectionItem[];
  onEdit(data: { key: string; value: string }[]): void;
  sectionHeader?: SectionHeader;
}

const EditSection = ({ data, onEdit, sectionHeader }: EditSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');

  const { idleSeconds, startIdleTracker, stopIdleTracker } = useIdleTracker();

  const { items, handleItemChange, handleSubmit } = useEditMode({
    initialData: data,
    onEdit: handleEdit,
  });
  const wrapEditItems = items.length > 4;

  useEffect(() => {
    const statusTimeOut = setTimeout(() => setSaveStatus('idle'), STATUS_TIMEOUT);

    return () => {
      clearTimeout(statusTimeOut);
    };
  }, [saveStatus]);

  useEffect(() => {
    if (saveStatus === 'saving' || idleSeconds < INPUT_SAVE_DELAY) {
      return;
    }

    handleSubmit();
  }, [saveStatus, idleSeconds]);

  async function handleEdit(editedItems: TItem[]) {
    if (editedItems.length === 0) {
      return;
    }

    stopIdleTracker();
    setSaveStatus('saving');

    try {
      await onEdit(editedItems);
    } catch (error) {
      console.log('Edit error: ', error);
    } finally {
      setSaveStatus('saved');
    }
  }

  function toggleEditMode() {
    setIsEditing(!isEditing);
  }

  function renderField(item: TItem, index: number) {
    const { key, value, errorMessage, startAdornment } = item;
    const { type = 'input', options = [] } = data[index] || {};

    if (type === 'dropdown') {
      const dumpOption = (option: string) => ({
        id: option,
        value: option,
        label: option,
      });

      return (
        <Dropdown
          value={dumpOption(value)}
          options={options.map(dumpOption)}
          handleSelection={(selectedOptions) => {
            if (selectedOptions[0]?.value) {
              handleItemChange(selectedOptions[0]?.value, index);
              handleSubmit();
            }
          }}
          containerClassExtend={'py-1 w-[448px] z-[200]'}
          classNames={{
            control: () => 'cursor-pointer rounded-lg',
          }}
        />
      );
    } else if (type === 'phone' || type === 'input') {
      return (
        <EditText
          id={key}
          value={value}
          startAdornment={startAdornment}
          type={type}
          errorMessage={errorMessage}
          onChange={(newValue) => {
            handleItemChange(newValue, index);
            startIdleTracker();
          }}
          onSubmit={handleSubmit}
        />
      );
    }
  }

  function renderHeaderTitle() {
    return (
      <div className="mb-8 flex w-full">
        <span className="text-h3 text-black-soft">{sectionHeader?.title}</span>
      </div>
    );
  }

  return (
    <Container className="relative">
      {sectionHeader && renderHeaderTitle()}
      <div className="mt-8 flex">
        <div className="absolute right-0 top-0 flex items-start gap-5">
          <div
            className={twMerge(
              'rounded px-2 py-1 text-[10px] font-semibold transition-all',
              saveStatus === 'idle' && 'opacity-0 transition-none',
              saveStatus === 'saving' && 'bg-[#D1E9FF] text-blue-brilliant',
              saveStatus === 'saved' && 'bg-green-success-50 text-green-success',
            )}
          >
            {saveStatus.toUpperCase()}
          </div>

          <Button
            size="small"
            variant={isEditing ? 'primary' : 'inverse'}
            onClick={toggleEditMode}
            label={<IconPencilSmallWide />}
          />
        </div>
      </div>
      <div className={twMerge('w-full xl:w-7/12', wrapEditItems && 'flex flex-wrap gap-x-12')}>
        {items.map((item, index) => {
          const editItem = data[index] || {};
          const isActive = isEditing && !item.readOnly;

          return (
            <div key={editItem.title} className={twMerge('w-full max-w-[28rem]', wrapEditItems && 'lg:w-5/12')}>
              <div className={isActive ? 'mb-4' : 'mb-5'}>
                <div
                  className={twMerge(
                    'text-form-hint mb-1 flex text-[.75em] font-medium text-[#427596]',
                    editItem.titleClassExtend,
                  )}
                >
                  {editItem.title}
                </div>
                <div className="flex items-end gap-1">
                  {isActive ? (
                    renderField(item, index)
                  ) : (
                    <div className="text-[1rem] font-semibold leading-[1.25]">
                      {`${editItem.startAdornment || ''}${editItem.value}`}
                    </div>
                  )}
                  {editItem.tooltip && (
                    <>
                      <Toggletip
                        tooltipId={editItem.key}
                        singleLine
                        tooltipProps={{ place: 'top-start' }}
                        closable={false}
                      >
                        {editItem.tooltip}
                      </Toggletip>
                      <i className="icon wcicon-information icon-24 text-grey-500" data-tooltip-id={editItem.key} />
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default EditSection;
