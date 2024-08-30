import React, { useRef, useState } from 'react';

import IconAngleSmDown from './icons/icon-angle-sm-down.svg?react';
import { DropdownContent, MenuItem } from '../TopNav/DropdownContent';
import useOutsideClickHandler from '../../hooks/useOutsideClickHandler';
import { useSites } from '@src/api-hooks/sites/sitesApi';
import { OrgSiteModel } from '@src/api-types/models';
import { useMatch, useNavigate, useParams } from 'react-router-dom';
import { useOrganizationFromHandle } from '@src/features/useOrganizationFromHandle';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

export const OrgSiteDropdown = () => {
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { siteHandle } = useParams<'siteHandle'>();
  const match = useMatch(siteHandle ? ':orgHandle/:siteHandle/*' : ':orgHandle/*');

  const { orgId, orgHandle } = useOrganizationFromHandle();
  const { siteName: selectedSiteName } = useSiteFromHandleOrLastStored();

  const { sites, isLoading: loadingSites } = useSites({ organizationId: orgId }, { skip: !orgId });

  useOutsideClickHandler(dropdownRef, () => {
    setIsDropdownOpen(false);
  });

  if (loadingSites) {
    return <div>...</div>;
  }

  const handleSelectedSite = (site: OrgSiteModel) => {
    const newSiteHandle = site['wellcube/site']?.handle;
    const newPage = match?.params['*'] || 'home';

    if (!newSiteHandle) {
      return;
    }

    navigate(`/${orgHandle}/${newSiteHandle}/${newPage}`);
  };

  const renderSitesItem: MenuItem[] = sites.map((site) => {
    return {
      name: site.name,
      handleClick: () => handleSelectedSite(site),
    };
  });

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const renderSites = () => (
    <>
      <div className=" mb-1 text-[.75rem] font-medium uppercase leading-[1.25] text-blue-suede">Viewing</div>
      <div
        ref={dropdownRef}
        className="relative flex w-fit cursor-pointer select-none items-center gap-[.875rem] outline-none"
        onClick={handleToggleDropdown}
      >
        <div className="font-semibold leading-[1.25] tracking-[-0.0625em] sm:text-[1.25rem]">{selectedSiteName}</div>
        <IconAngleSmDown className="h-[.625rem] w-[.625rem]" />
        {isDropdownOpen && (
          <DropdownContent
            menuItems={renderSitesItem}
            classExtendDropdownContent={'absolute dropdown-content right-0 left-0 top-[2.28rem]'}
            classExtendContainer={
              'absolute bg-[#F8FCFF] left-0 border border-[#D4DFE9] rounded-dropdown shadow-dropdown-sites overflow-auto min-w-[15rem] absolute'
            }
          />
        )}
      </div>
    </>
  );

  return siteHandle ? renderSites() : <></>;
};

export default OrgSiteDropdown;
