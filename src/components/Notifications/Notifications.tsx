import React, { MouseEventHandler } from 'react';
import { twMerge } from 'tailwind-merge';

interface NotificationsProps {
  children?: React.ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  hasNewNotifications?: boolean;
}

const Notifications = ({ onClick, onMouseEnter, children, className, hasNewNotifications }: NotificationsProps) => {
  const handleOnClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      onClick={handleOnClick}
      onMouseEnter={onMouseEnter}
      className={twMerge(
        'relative flex h-[2.635rem] w-[2.625rem] items-center justify-center rounded-[.625rem] border border-[#DDE2EC]',
        hasNewNotifications &&
          'after:absolute after:right-[-3px] after:top-[-3px] after:h-[10px] after:w-[10px] after:w-[10px] after:rounded-full after:bg-[#FF7C10]',
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Notifications;
