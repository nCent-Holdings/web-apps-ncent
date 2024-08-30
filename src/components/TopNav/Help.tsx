import React, { MouseEventHandler } from 'react';

interface HelpProps {
  children?: React.ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
}

const Help = ({ onClick, onMouseEnter, children }: HelpProps) => {
  const handleOnClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <>
      <button
        className="flex h-[2.635rem] w-[2.625rem] items-center justify-center rounded-[.625rem] border border-[#DDE2EC]"
        onClick={handleOnClick}
        onMouseEnter={onMouseEnter}
      >
        {children}
      </button>
    </>
  );
};

export default Help;
