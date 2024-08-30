import React from 'react';
import IconChevronDownLg from '../icons/IconChevronDownLg';
import IconChevronUpLg from '../icons/IconChevronUpLg';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
export interface CollapseSectionHeaderProps {
  header: string;
  className?: string;
  showProfile: boolean;
  handleToggleProfile: () => void;
}

export const CollapseSectionHeader = ({
  header,
  className,
  showProfile,
  handleToggleProfile,
}: CollapseSectionHeaderProps) => {
  return (
    <div
      className={twMerge(
        'flex min-h-[4rem] items-center justify-between border-b border-b-[#D4DFEA] px-5',
        showProfile && 'shadow-[0_-1px_0_#D4DFEA_inset]',
        className,
      )}
    >
      <div className="text-[1.25rem] leading-[1.25] tracking-[-0.0625rem]">{header}</div>
      <button onClick={handleToggleProfile} className="ml-[1.25rem] flex items-center justify-center ">
        <div className="relative flex items-center justify-center rounded-tr-lg text-blue-brilliant">
          <div
            className={clsx(
              'flex h-6 w-6 items-center justify-center rounded-[.25rem] shadow-[0_0_0_1px_#D4DFEA_inset] [&_svg]:w-3 [&_svg]:fill-[#667085]',
              showProfile && 'hidden',
              !showProfile && 'block',
            )}
          >
            <IconChevronDownLg />
          </div>
          <div
            className={clsx(
              'flex h-6 w-6 items-center justify-center rounded-[.25rem] bg-[#0061FF] shadow-com-new-active-button-shadow [&_svg]:w-3 [&_svg]:fill-white',
              !showProfile && 'hidden',
              showProfile && 'block',
            )}
          >
            <IconChevronUpLg />
          </div>
        </div>
      </button>
    </div>
  );
};

export default CollapseSectionHeader;
