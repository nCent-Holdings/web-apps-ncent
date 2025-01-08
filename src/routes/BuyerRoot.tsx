import React from 'react';
import { Outlet } from 'react-router-dom';
import BuyerLayout from './buyer/BuyerLayout';

export const BuyerRoot: React.FC = () => {
  return (
    <BuyerLayout>
      <Outlet />
    </BuyerLayout>
  );
};

export default BuyerRoot;
