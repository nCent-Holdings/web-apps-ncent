import React from 'react';

import {
  NavIconHome,
  NavIconHomeOn2,
  NavIconReports,
  NavIconApi,
  NavIconUsers,
  NavIconControl,
  NavIconSystem,
  NavIconOrg,
  NavIconSystemOn2,
  NavIconControlOn2,
  NavIconOrgOn2,
  NavIconApiOn2,
  NavIconReportsOn2,
  NavIconUsersOn2,
} from './icons';
import LeftNavItem from './LeftNavItem';
import LeftNavLink from './LeftNavLink';
import LeftNavSectionHd from './LeftNavSectionHd';
import { useOrganizationFromHandle } from '@src/features/useOrganizationFromHandle';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

const LeftNavClient = () => {
  const { orgHandle } = useOrganizationFromHandle();
  const { siteHandle } = useSiteFromHandleOrLastStored();

  return (
    <>
      <LeftNavLink to={`${orgHandle}/${siteHandle}/home`} hideNavLink={!siteHandle}>
        <LeftNavItem label="Home" icon={<NavIconHome />} iconSel={<NavIconHomeOn2 />} />
      </LeftNavLink>
      <LeftNavLink to={`${orgHandle}/${siteHandle}/reporting`} hideNavLink={!siteHandle}>
        <LeftNavItem label="Reporting" icon={<NavIconReports />} iconSel={<NavIconReportsOn2 />} />
      </LeftNavLink>
      <LeftNavSectionHd title="Plan & install" hideSection={!siteHandle} />
      <LeftNavLink to={`${orgHandle}/${siteHandle}/system-design`} hideNavLink={!siteHandle}>
        <LeftNavItem label="System design" icon={<NavIconSystem />} iconSel={<NavIconSystemOn2 />} />
      </LeftNavLink>
      <LeftNavSectionHd title="Control Center" hideSection={!siteHandle} />
      <LeftNavLink to={`${orgHandle}/${siteHandle}/devices`} hideNavLink={!siteHandle}>
        <LeftNavItem label="Devices" icon={<NavIconControl />} iconSel={<NavIconControlOn2 />} />
      </LeftNavLink>
      <LeftNavSectionHd title="Manage teams" />
      <LeftNavLink to={`${orgHandle}/organization`}>
        <LeftNavItem label="Organization" icon={<NavIconOrg />} iconSel={<NavIconOrgOn2 />} />
      </LeftNavLink>
      <LeftNavLink to={`${orgHandle}/users`}>
        <LeftNavItem label="Users" icon={<NavIconUsers />} iconSel={<NavIconUsersOn2 />} />
      </LeftNavLink>
      <LeftNavSectionHd title="Connect with ecosystem" hideSection={!siteHandle} />
      <LeftNavLink to={`${orgHandle}/${siteHandle}/api`} hideNavLink={!siteHandle}>
        <LeftNavItem label="API key" icon={<NavIconApi />} iconSel={<NavIconApiOn2 />} />
      </LeftNavLink>
    </>
  );
};

export default LeftNavClient;
