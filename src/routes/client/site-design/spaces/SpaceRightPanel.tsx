import React from 'react';
import { advTitleCase } from '../../../../utils/stringUtils';
import { Button } from '@ncent-holdings/ux-components';
import { SpaceModel } from '@src/api-types/models';

interface SpaceRightPanelProps {
  space?: SpaceModel;
}

export const SpaceRightPanel = ({ space }: SpaceRightPanelProps) => {
  const spaceInfo = space?.['wellcube/space'];

  return (
    <div className="py-8">
      <div className="px-5">
        <div className="text-sm font-medium text-blue-suede">
          {spaceInfo?.details?.type && advTitleCase(spaceInfo?.details?.type)}
        </div>
        <div className="text-h4 font-semibold">{space?.name}</div>
      </div>
      <div className="h-8" />
      <div className="flex items-center justify-between bg-white-background px-5 py-2">
        <div className="text-h5">Profile</div>
        <Button variant="inverse" size="small" label={<i className="icon icon-16 wcicon-chevron-up" />} />
      </div>
      <div className="h-4" />
      <div className="flex flex-col justify-between bg-white-background px-5 py-2">
        <div className="text-[12px] font-medium text-blue-suede">LOCATION</div>
        <div className="h-1" />
        <div className="text-sm font-semibold text-grey-500">
          {'Full > Path > Goes > '}
          <span className="text-black-soft">Here</span>
        </div>
      </div>
      <div className="h-6" />
      <div className="px-5">
        <p>This side panel is not implemented yet and is just a visual placeholder for now.</p>
      </div>
    </div>
  );
};

export default SpaceRightPanel;
