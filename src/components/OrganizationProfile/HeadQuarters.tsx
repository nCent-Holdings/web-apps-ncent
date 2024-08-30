import React, { useMemo } from 'react';
import EditSection, { EditSectionItem } from '@components/EditSection';
import { WellcubeOrganization } from '@src/api-types/wellcube';

export interface HeadQuartersItem {
  key: string;
  value: string;
}

interface HeadQuartersProps {
  data?: WellcubeOrganization;
  onEdit(data: HeadQuartersItem[]): void;
}

const HeadQuarters = ({ data, onEdit }: HeadQuartersProps) => {
  const {
    address1 = '',
    address2 = '',
    country = '',
    city = '',
    state = '',
    postal_code = '',
    keywords = '',
  } = data || {};

  const headQuartersData: EditSectionItem[] = useMemo(() => {
    return [
      {
        key: 'address1',
        title: 'Address line 1',
        value: address1,
      },
      {
        key: 'address2',
        title: 'Address line 2',
        value: address2,
      },
      {
        key: 'country',
        title: 'Country',
        value: country,
      },
      {
        key: 'city',
        title: 'City',
        value: city,
      },
      {
        key: 'state',
        title: 'State',
        value: state,
      },
      {
        key: 'postal_code',
        title: 'ZIP/Postal Code',
        value: postal_code,
      },
      {
        key: 'keywords',
        title: 'Keywords',
        value: keywords,
      },
    ];
  }, [address1, address2, country, city, state, postal_code, keywords]);

  const sectionHeader = {
    title: 'Admin information',
  };

  return (
    <>
      <div className="rounded-2xl border border-[#D4DFEA] bg-white p-8">
        <EditSection data={headQuartersData} onEdit={onEdit} sectionHeader={sectionHeader} />
      </div>
    </>
  );
};

export default React.memo(HeadQuarters);
