import React, { useCallback, useEffect, useState } from 'react';
import { Heading } from '@ncent-holdings/ux-components';
import dayjs from 'dayjs';

import ScrollVisibleElement from '../../../components/ScrollVisibleElement/ScrollVisibleElement';
import Tabs, { TabData } from '../../../components/Tabs';
import WellcubeContact from './WellcubeContact';
import HeadQuarters from '../../../components/OrganizationProfile/HeadQuarters';
import Sites from '../../../components/OrganizationProfile/Sites';
import { twMerge } from 'tailwind-merge';
import * as orgActions from '../../../actions/organizations';
import * as listActions from '../../../actions/lists';
import EditSection, { type EditSectionItem } from '@src/components/EditSection';
import { useOrganizationFromHandle } from '@src/features/useOrganizationFromHandle';
import { arrayToObject } from '@src/utils';

const CREATED_AT_FORMAT = 'MM/DD/YYYY';

export const ClientOrganization = () => {
  const { organization, orgHandle } = useOrganizationFromHandle();

  const organizationData = organization?.['wellcube/organization'];

  const [industryList, setIndustryList] = useState<string[]>([]);

  useEffect(() => {
    loadIndustryList();
  }, []);

  const loadIndustryList = async () => {
    const newList = await listActions.getSortedIndustryList(true);

    setIndustryList(newList);
  };

  const intSecs = parseInt(organizationData?.created_at || '0');
  const crDate = new Date(0).setUTCSeconds(intSecs);
  const formattedCrDate = organizationData?.created_at ? dayjs(crDate).format(CREATED_AT_FORMAT) : '';

  const handleOnEdit = useCallback(
    async (orgDetails: { key: string; value: string }[]) => {
      if (!organization) {
        return;
      }

      await orgActions.updateOrg(organization.id, arrayToObject(orgDetails));
    },
    [organization],
  );

  const orgDetailsData: EditSectionItem[] = [
    {
      key: 'name',
      title: 'Organization name',
      value: organization?.name || '',
      readOnly: true,
    },
    {
      key: 'handle',
      title: 'Unique domain',
      value: `${window.location.host}/${orgHandle}` || '',
      readOnly: true,
      tooltip: 'To modify this detail, contact your Technical Sales Manager.',
    },
    {
      key: 'industry',
      title: 'Industry',
      value: organizationData?.industry || '',
      type: 'dropdown',
      options: industryList,
    },
  ];

  const AccountDetailsData: EditSectionItem[] = [
    {
      key: 'name',
      title: 'Technical Sales Manager',
      value: organizationData?.sales_name || 'WellCube',
    },
    {
      key: 'phone',
      title: 'Phone',
      value: organizationData?.sales_phone_number || '',
    },
    {
      key: 'email',
      title: 'Email',
      value: organizationData?.sales_email || '',
    },
  ];

  const tabs: TabData[] = [
    {
      label: 'HEADQUARTERS',
      content: <HeadQuarters data={organizationData} onEdit={handleOnEdit} />,
    },
    {
      label: 'WELLCUBE CONTACT',
      content: <WellcubeContact data={AccountDetailsData} />,
    },
    {
      label: 'SITES',
      content: <Sites orgId={organization?.id} />,
    },
  ];

  return (
    <>
      <ScrollVisibleElement scrollTitle="Organization details">
        <Heading heading="Organization details" />
        <div className="text-lg mt-3 leading-[1.25] text-blue-suede">
          <span className="text-bdy font-semibold text-blue-suede">Created on:</span>
          <span className="ml-1 text-bdy text-blue-suede">{formattedCrDate}</span>
        </div>
      </ScrollVisibleElement>
      <EditSection data={orgDetailsData} onEdit={handleOnEdit} />
      <div className={twMerge('relative isolate mt-8 border-t border-t-[#D4DFEA] pt-8')}>
        <div className="relative [&_.com-tabs-panel]:relative [&_.com-tabs-panel]:z-[1] [&_.com-tabs-tabs]:relative [&_.com-tabs-tabs]:z-[2]">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </>
  );
};

export default ClientOrganization;
