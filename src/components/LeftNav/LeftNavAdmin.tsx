import React from 'react';
import {
  NavIconHome,
  NavIconHomeOn2,
  NavIconProducts,
  NavIconSchedule,
  NavIconBudget,
  NavIconAssets,
  NavIconSettings,
} from './icons';
import LeftNavItem from './LeftNavItem';
import LeftNavLink from './LeftNavLink';

const LeftNavAdmin = () => {
  return (
    <>
      <LeftNavLink to={'/dashboard'}>
        <LeftNavItem label="Dashboard" icon={<NavIconHome />} iconSel={<NavIconHomeOn2 />} />
      </LeftNavLink>
      <LeftNavLink to={'/products'}>
        <LeftNavItem label="Products" icon={<NavIconProducts />} iconSel={<NavIconProducts />} />
      </LeftNavLink>
      <LeftNavLink to={'/schedule'}>
        <LeftNavItem label="Schedule" icon={<NavIconSchedule />} iconSel={<NavIconSchedule />} />
      </LeftNavLink>
      <LeftNavLink to={'/budget'}>
        <LeftNavItem label="Budget" icon={<NavIconBudget />} iconSel={<NavIconBudget />} />
      </LeftNavLink>
      <LeftNavLink to={'/assets'}>
        <LeftNavItem label="Assets" icon={<NavIconAssets />} iconSel={<NavIconAssets />} />
      </LeftNavLink>
      <LeftNavLink to={'/settings'}>
        <LeftNavItem label="Settings" icon={<NavIconSettings />} iconSel={<NavIconSettings />} />
      </LeftNavLink>
    </>
  );
};

export default LeftNavAdmin;
