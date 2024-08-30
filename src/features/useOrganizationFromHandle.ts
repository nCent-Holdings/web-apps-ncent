import { useParams } from 'react-router-dom';

import { useOrganization } from '@src/api-hooks/organizations/organizationsApi';

export const useOrganizationFromHandle = () => {
  const { orgHandle = '' } = useParams<'orgHandle'>();

  const { organization, ...apiResponse } = useOrganization(orgHandle, { skip: !orgHandle });

  return {
    ...apiResponse,
    organization,

    orgHandle,
    orgId: organization?.id || '',
    orgName: organization?.name || '',
    tsmEmail: organization?.['wellcube/organization']?.sales_email || '',
  };
};
