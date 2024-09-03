import React from 'react';
import { Heading } from '@ncent-holdings/ux-components';

export const BuyerMain: React.FC = () => {
  const renderBuyerMain = () => (
    <div className="flex flex-col max-sm:gap-4 max-sm:px-4 sm:gap-9 md:w-[458px]">
      <Heading heading="Hi there Buyer!" subheading="Welcome to nCent" size="h1" />
    </div>
  );

  return renderBuyerMain();
};

export default BuyerMain;
