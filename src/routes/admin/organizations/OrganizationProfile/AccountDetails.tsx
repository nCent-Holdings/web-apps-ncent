import React, { useMemo } from 'react';
import EditSection, { type EditSectionItem } from '@components/EditSection';
import { WellcubeOrganization } from '@src/api-types/wellcube';

interface AccountDetailsProps {
  data?: WellcubeOrganization;
  onEdit(data: EditSectionItem[]): void;
}

const AccountDetails = ({ data, onEdit }: AccountDetailsProps) => {
  const { sales_name = 'Wellcube', sales_phone_number = '', sales_email = '' } = data || {};

  const accountDetailsData: EditSectionItem[] = useMemo(() => {
    return [
      {
        key: 'sales_name',
        title: 'Technical Sales Manager',
        value: sales_name,
      },
      {
        key: 'sales_phone_number',
        title: 'Phone',
        value: sales_phone_number,
      },
      {
        key: 'sales_email',
        title: 'Email',
        value: sales_email,
      },
    ];
  }, [sales_name, sales_phone_number, sales_email]);

  const sectionHeader = {
    title: 'Wellcube contact',
  };

  return (
    <>
      <div className="rounded-2xl border border-[#D4DFEA] bg-white p-8">
        <EditSection data={accountDetailsData} onEdit={onEdit} sectionHeader={sectionHeader} />
      </div>
    </>
  );
};

export default React.memo(AccountDetails);
