import React from 'react';
import { NavIconHome, NavIconHomeOn2, NavIconOrg, NavIconOrgOn2, NavIconUsers, NavIconUsersOn2 } from './icons';
import LeftNavItem from './LeftNavItem';
import LeftNavLink from './LeftNavLink';

const LeftNavAdmin = () => {
  return (
    <>
      <LeftNavLink to={'/partners'}>
        <LeftNavItem label="Partners" icon={<NavIconHome />} iconSel={<NavIconHomeOn2 />} />
      </LeftNavLink>
      <LeftNavLink to={'/delos-users'}>
        <LeftNavItem label="Delos users" icon={<NavIconUsers />} iconSel={<NavIconUsersOn2 />} />
      </LeftNavLink>
      <LeftNavLink to={'/organizations'}>
        <LeftNavItem
          label="Client organizations"
          labelClassNames="whitespace-normal text-justify"
          icon={<NavIconOrg />}
          iconSel={<NavIconOrgOn2 />}
        />
      </LeftNavLink>
    </>
  );
};

export default LeftNavAdmin;
