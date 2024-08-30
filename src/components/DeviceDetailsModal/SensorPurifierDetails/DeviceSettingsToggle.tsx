import React from 'react';
import { twMerge } from 'tailwind-merge';

export const DeviceSettingsToggle = ({
  label,
  toggled = false,
  onClick,
}: {
  label: string;
  toggled?: boolean;
  id?: string;
  onClick: () => void;
}) => {
  return (
    <label className="relative inline-flex cursor-pointer items-center gap-x-2.5">
      <input type="checkbox" checked={toggled} className="peer sr-only" onChange={onClick} />
      <div
        className={twMerge(
          'peer h-6 w-10 rounded-full border-[2px] border-grey-light-200 bg-grey-light-200 px-0.5 transition-all',
          // Default handle
          "after:absolute after:left-[4px] after:top-[4px] after:h-4 after:w-4 after:rounded-full after:bg-grey-light-500 after:shadow-com-toggle after:transition-all after:content-['']",
          // Checked handle
          'peer-checked:after:translate-x-full peer-checked:after:bg-white',
          // Checked background
          'peer-checked:border-blue-brilliant peer-checked:bg-blue-brilliant',
        )}
      />
      <div
        className={twMerge(
          ' cursor-pointer text-sm font-medium text-grey-light-400 transition-all',
          toggled && 'text-black-light-soft',
        )}
      >
        {label}
      </div>
    </label>
  );
};

export default DeviceSettingsToggle;
