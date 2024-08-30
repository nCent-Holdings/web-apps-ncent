import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Outlet, useMatch, useNavigate, useParams } from 'react-router-dom';
import LeftNavClient from '../../components/LeftNav/LeftNavClient';
import OrgSiteDropdown from '../../components/OrgSiteDropdown/OrgSiteDropdown';
import { useAppNav } from '../../contexts/AppNavContext/AppNavContext';
import * as orgCoreAPI from '../../actions/organizations';
import * as siteCoreAPI from '../../actions/sites';
import ErrorPage from '../ErrorPage';

import { useOrganizationFromHandle } from '@src/features/useOrganizationFromHandle';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';
import lastSiteStorage from '@src/utils/lastSiteStorage';
import LoaderOverlay from '@src/components/LoaderOverlay/LoaderOverlay';

export const ClientRoot = () => {
  const navigate = useNavigate();

  const { orgHandle = '', siteHandle = '' } = useParams<'orgHandle' | 'siteHandle'>();
  const match = useMatch(siteHandle ? '/:orgHandle/:siteHandle/*' : '/:orgHandle/*');

  const { organization, isLoading: organizationLoading } = useOrganizationFromHandle();
  const { site, lastSiteHandle, isLoading: siteLoading } = useSiteFromHandleOrLastStored();

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoadingFirstOrg, setIsLoadingFirstOrg] = useState(false);

  const isLoading = !isInitialized || isLoadingFirstOrg || organizationLoading || siteLoading;
  const isError = !isLoading && (!organization || !site);
  const page = match?.params['*'];

  const appNav = useAppNav();

  const loadAndNavigate = async () => {
    setIsLoadingFirstOrg(true);

    try {
      // 1. Load first available org
      const firstOrg = await orgCoreAPI.getFirstOrgByHandle(orgHandle);
      const firstOrgHandle = firstOrg?.['wellcube/organization']?.handle;

      if (!firstOrg || !firstOrgHandle) {
        return;
      }

      // 2. Load first available site for org
      const lastSiteHandle = lastSiteStorage.getLastSite(firstOrgHandle);
      const firstSite = await siteCoreAPI.getFirstSiteByOrgIdAndHandle(firstOrg.id, lastSiteHandle);
      const firstSiteHandle = firstSite?.['wellcube/site']?.handle;

      if (!firstSiteHandle) {
        return;
      }

      if (!page) {
        // 3. Navigate
        navigate(`/${firstOrgHandle}/${firstSiteHandle}/home`, { replace: true });
      }
    } finally {
      setIsLoadingFirstOrg(false);
    }
  };

  useEffect(() => {
    if (!page && orgHandle && siteHandle) {
      navigate(`/${orgHandle}/${siteHandle}/home`, { replace: true });
    } else if (!page && orgHandle && lastSiteHandle) {
      navigate(`/${orgHandle}/${lastSiteHandle}/home`, { replace: true });
    } else if (!orgHandle || !lastSiteHandle) {
      loadAndNavigate();
    }
  }, [orgHandle, siteHandle, lastSiteHandle, page]);

  useLayoutEffect(() => {
    if (!isLoading && isError) {
      appNav.setStickyHeader(<></>);
    } else if (!isError) {
      appNav.expandLeftNav();
      appNav.setLeftNavContent(<LeftNavClient />);
      appNav.setTopNavContent(<OrgSiteDropdown />);
    }
  }, [isLoading, isError]);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  if (isLoading) {
    return <LoaderOverlay loading>...</LoaderOverlay>;
  } else if (isError) {
    return <ErrorPage />;
  } else {
    return <Outlet />;
  }
};
