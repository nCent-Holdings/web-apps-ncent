import React from 'react';

export const BuyerLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen flex-col">
      <div className="relative flex min-h-screen w-full">
        <div className="flex flex-1 rounded-tr-3xl bg-white-background pb-[73px] pl-[80px] pt-[80px]">{children}</div>
      </div>
    </div>
  );
};

export default BuyerLayout;
