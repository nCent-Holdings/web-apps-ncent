import React, { MouseEventHandler, ReactNode, FC } from 'react';
interface AvatarProps {
  firstName?: string;
  secondName?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
}

const Avatar: FC<AvatarProps> = ({ firstName, secondName, onClick, onMouseEnter, onMouseLeave, children }) => {
  const initials = (firstName?.charAt(0) ?? '') + secondName?.charAt(0);

  return (
    <>
      <button
        className="flex h-[2.635rem] w-[2.625rem] items-center justify-center rounded-[.625rem] border border-[#DDE2EC] text-[.75rem] font-medium"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {initials?.toUpperCase()}
        {children}
      </button>
    </>
  );
};

export default Avatar;
