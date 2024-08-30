import React, { useCallback, useEffect, useState } from 'react';
import { Dropdown } from '@ncent-holdings/ux-components';
import { twMerge } from 'tailwind-merge';

export type Option = {
  id: string;
  value: string;
  label?: string;
};

const roomTypes: Option[] = [
  {
    id: 'conferenceRoom',
    value: 'Conference Room',
    label: 'Conference Room',
  },
  {
    id: 'huddleRoom',
    value: 'Huddle Room',
    label: 'Huddle Room',
  },
  {
    id: 'cafe_Kitchen',
    value: 'Cafe/Kitchen',
    label: 'Cafe/Kitchen',
  },
  {
    id: 'collaborativeWorkArea',
    value: 'Collaborative Work Area',
    label: 'Collaborative Work Area',
  },
  {
    id: 'reception',
    value: 'Reception',
    label: 'Reception',
  },
  {
    id: 'office',
    value: 'Office',
    label: 'Office',
  },
];

interface RoomSelectorProps {
  handleSelection: (items: Option[]) => void;
  id?: string;
  placeholderClass?: string;
  items?: Option[];
  value?: string;
}

const RoomSelector = ({ id, items, handleSelection, placeholderClass, value }: RoomSelectorProps) => {
  const [valueSelected, setValueSelected] = useState<Option | undefined>(undefined);

  useEffect(() => {
    if (!value) {
      setValueSelected(undefined);
      return;
    }
    getRoomType(value);
  }, [value]);

  const getRoomType = useCallback(
    (value: string) => {
      if (!value) return undefined;
      const selectedOpt = roomTypes.filter((room) => room.value === value)?.[0];
      setValueSelected(selectedOpt);
    },
    [value],
  );

  const formatOptionlabel = ({ label }: { label: string }) => (
    <div style={{ display: 'flex' }}>
      <div className="text-[.875rem] font-medium not-italic text-black-soft">{label}</div>
    </div>
  );

  return (
    <div>
      <Dropdown
        inputId={id}
        label="Type (optional)"
        options={items || roomTypes}
        placeholder="Select a room type"
        handleSelection={handleSelection}
        value={valueSelected}
        formatOptionLabel={formatOptionlabel}
        classNames={{
          placeholder: ({ isDisabled }) =>
            twMerge('font-medium not-italic', isDisabled ? 'text-grey-700' : 'leading-[110%]', placeholderClass),
        }}
      />
    </div>
  );
};

export default RoomSelector;
