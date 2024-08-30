import { DatePicker, Input } from '@ncent-holdings/ux-components';
import { getMonth, getYear } from 'date-fns';
import { range } from 'lodash';
import React from 'react';
import IconCalendarRounded from './IconCalendarRounded';
import IconAngleLeft from '@src/components/LeftNav/icons/IconAngleLeft';
import IconAngleRight from '@src/components/LeftNav/icons/IconAngleRight';

interface CustomInputProps {
  value?: string;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

type CustomHeaderProps = {
  date: Date;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const years = range(1990, getYear(new Date()) + 1, 1);

export default function CustomDatePicker({
  value = new Date(),
  onChange,
  disabled,
  inputClasses,
}: {
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  inputClasses?: string;
}) {
  function handleChange(date: Date | null) {
    onChange(date);
  }

  const CustomInput = ({ value, onFocus, onClick }: CustomInputProps) => (
    <Input
      type="text"
      onFocus={onFocus}
      value={value}
      id="example-custom-input"
      classes={inputClasses}
      endAdornment={
        <button onClick={onClick} className="[&>svg]:h-4 [&>svg]:w-4">
          <IconCalendarRounded />
        </button>
      }
      disabled={disabled}
    />
  );

  return (
    <DatePicker
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }: CustomHeaderProps) => (
        <div className="flex">
          <button
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className="ml-2 mr-auto flex h-8 w-8 flex-[0_0_auto] items-center justify-center"
          >
            <IconAngleLeft />
          </button>
          <select
            value={getYear(date)}
            onChange={({ target: { value } }) => changeYear(Number(value))}
            className="font-bold"
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={months[getMonth(date)]}
            onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
            className="font-bold"
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className="ml-auto mr-2 flex h-8 w-8 flex-[0_0_auto] items-center justify-center"
          >
            <IconAngleRight />
          </button>
        </div>
      )}
      selected={value}
      onChange={handleChange}
      customInput={<CustomInput />}
    />
  );
}
