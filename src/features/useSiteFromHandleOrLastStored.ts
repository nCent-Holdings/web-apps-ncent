import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useSite } from '@src/api-hooks/sites/sitesApi';
import lastSiteStorage from '@src/utils/lastSiteStorage';

import { useOrganizationFromHandle } from './useOrganizationFromHandle';

export const useSiteFromHandleOrLastStored = () => {
  const params = useParams<'siteHandle'>();

  const { orgId, orgHandle } = useOrganizationFromHandle();
  const lastSiteHandle = lastSiteStorage.getLastSite(orgHandle);
  const siteHandle = params.siteHandle || lastSiteHandle || '';

  const { site, isLoading, isUninitialized, ...apiResponse } = useSite(orgId, siteHandle, {
    skip: !orgId || !siteHandle,
  });

  useEffect(() => {
    if (isUninitialized || isLoading) {
      return;
    }

    if (orgHandle && siteHandle && site) {
      lastSiteStorage.setLastSite(orgHandle, siteHandle);
    } else if (orgHandle && siteHandle && !site) {
      lastSiteStorage.removeLastSite(orgHandle);
    }
  }, [orgHandle, siteHandle, site, isLoading, isUninitialized]);

  return {
    ...apiResponse,
    site,
    isLoading,
    isUninitialized,

    lastSiteHandle,
    siteHandle,
    siteId: site?.id || '',
    siteName: site?.name || '',
    siteTz: site?.['wellcube/site']?.timezone?.timeZoneId || 'UTC',
  };
};
