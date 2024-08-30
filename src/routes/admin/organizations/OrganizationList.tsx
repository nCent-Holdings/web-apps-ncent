import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heading, Card, Button } from '@ncent-holdings/ux-components';
import Table from '../../../components/Table/Table';
import { Org } from './types';
import { columns } from './OrgsColsDef';
import ScrollVisibleElement from '../../../components/ScrollVisibleElement/ScrollVisibleElement';
import { useOrganizations } from '@src/api-hooks/organizations/organizationsApi';
import { useAppNav } from '../../../contexts/AppNavContext/AppNavContext';

export const Organizations: React.FC = () => {
  const navigate = useNavigate();
  const appNav = useAppNav();

  const { organizations: orgList, selectById: selectOrgById } = useOrganizations();

  useEffect(() => {
    appNav.setStickyHeader(
      <div className="mx-auto flex w-full max-w-[var(--content-max-lg)] items-center">
        <div className="  text-[1.25rem] font-semibold leading-[1.25] tracking-[-0.0625rem] text-black-soft ">
          Client organizations
        </div>
        <div className="ml-auto flex items-center text-[.875rem] leading-[1.25] text-[#272B32]">
          <Link to="/organizations/new">
            <div className="flex items-center">
              <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-[0.3125rem] bg-blue-brilliant text-white">
                <i className="icon icon-16 wcicon-plus" />
              </div>
              Add an organization
            </div>
          </Link>
        </div>
      </div>,
    );
  }, []);

  const renderEmptyOrgTable = () => {
    return (
      <Card variant="main">
        <div className="flex h-[348px] w-[698px] flex-col items-center gap-[10px] p-[64px]">
          <div className="flex h-[220px] w-[570px] flex-col items-center gap-[48px] p-0">
            <div className="flex h-[116px] w-[570px] flex-col gap-[24px] p-0">
              <span className="text-center text-[32px] font-bold text-grey-900">No organizations found</span>
            </div>
            <div className="flex h-[50px] w-[570px] flex-col gap-[24px] p-0 ">
              <span className="text-form-label text-center text-grey-900">
                No organizations found. Please add a new organization.
              </span>
            </div>
            <Link to="/organizations/new">
              <Button variant="primary" label="ADD AN ORGANIZATION" size="large" />
            </Link>
          </div>
        </div>
      </Card>
    );
  };

  const handleViewOrg = (orgId: string) => {
    const org = selectOrgById(orgId);
    const orgHandle = org?.['wellcube/organization']?.handle;

    if (!orgHandle) {
      return;
    }

    navigate(`${orgHandle}`);
  };

  const renderOrgTable = () => {
    if (!orgList || !orgList.length) {
      return renderEmptyOrgTable();
    }

    const orgsData: Org[] = [];

    for (let i = 0; i < orgList.length; i++) {
      const orgInfo = orgList[i]?.['wellcube/organization'];
      const orgHandle = orgInfo?.handle || '';

      let fullAddress = '';

      if (orgInfo) {
        fullAddress = `${orgInfo['address1']}, ${orgInfo['address2']}; ${orgInfo['city']}, ${orgInfo['state']} ${orgInfo['postal_code']}, ${orgInfo['country']}`;
      } else {
        fullAddress = 'Unknown';
      }

      const newOrg: Org = {
        id: orgList[i].id,
        orgName: orgList[i].name,
        orgHandle,
        location: fullAddress,
        technicalSales: orgInfo?.['sales_name'] || 'WellCube',
      };

      orgsData.push(newOrg);
    }

    return <Table data={orgsData} columns={columns} onEdit={handleViewOrg} />;
  };

  return (
    <>
      <div className="relative z-[100] mb-9 flex items-end">
        <ScrollVisibleElement scrollTitle="Client organizations">
          <Heading heading="Client organizations" />
        </ScrollVisibleElement>
        <div className="ml-auto flex items-center text-[.875rem] leading-[1.25] text-[#272B32]">
          <Link to="/organizations/new">
            <div className="flex items-center">
              <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-[0.3125rem] bg-blue-brilliant text-white">
                <i className="icon icon-16 wcicon-plus" />
              </div>
              Add an organization
            </div>
          </Link>
        </div>
      </div>

      <div className="table-container">{renderOrgTable()}</div>
    </>
  );
};

export default Organizations;
