import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import useSession from '@src/api-hooks/session/useSession';
import { useSites } from '@src/api-hooks/sites/sitesApi';

import { ColumnDef, TableWithGrouping } from '@src/components/Table';

import { getColumns } from './SitesColsDef';
import { Site } from './types';
import { useOrganizations } from '@src/api-hooks/organizations/organizationsApi';

const Sites = () => {
  const [, sessionAPI] = useSession();
  const { sites } = useSites();
  const { selectById: selectOrgById } = useOrganizations();

  const sitesData: Site[] = sites.map((site) => {
    const userRoles = sessionAPI.getUserRoles();
    const organization = selectOrgById(site['wellcube/site']?.organization_id || '');

    return {
      organization: organization?.['wellcube/organization']?.handle,
      site: site.name,
      address: [
        site['wellcube/site']?.address1,
        site['wellcube/site']?.address2,
        site['wellcube/site']?.city,
        site['wellcube/site']?.country,
      ]
        .filter(Boolean)
        .join(', '),
      permission: userRoles.join(','),
    };
  });

  const columns: ColumnDef<Site, string>[] = useMemo(() => {
    return getColumns();
  }, []);

  return (
    <TableWithGrouping<Site>
      data={sitesData}
      columns={columns}
      isEditEnabled={false}
      groupByColumn="organization"
      emptyMessage={
        <div className="flex w-full flex-col items-center justify-center rounded-b-2xl bg-white p-[80px]">
          <p className="mb-[24px] text-center text-h4 font-semibold text-grey-900">
            You currently have access to no sites in your organization
          </p>
          <p className="flex flex-col items-center justify-center">
            Learn more about user permissions in the{' '}
            <Link className=" font text-blue-brilliant underline" to={'#'}>
              {'Knowledge Base.'}
            </Link>
          </p>
        </div>
      }
    />
  );
};

export default Sites;
