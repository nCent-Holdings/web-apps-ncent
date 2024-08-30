import { DetailsProps } from '../../../../components/OrganizationProfile/types';

export type Site = {
  id: string;
  site: string;
  siteHandle: string;
  address: string;
  status: string;
  creationDate: string;
};

export const AccountDetailsData: DetailsProps[] = [
  {
    key: 'tsm',
    title: 'Technical Sales Manager',
    value: 'Ted Slaeborm',
  },
  {
    key: 'created',
    title: 'Created',
    value: '11/09/2022',
  },
  {
    key: 'industry',
    title: 'Industry',
    value: 'Professional Consulting',
  },
];
