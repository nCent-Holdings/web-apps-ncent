import React from 'react';
import { Hint } from '@ncent-holdings/ux-components';
import { WellcubeLocation } from '../../../api-types/wellcube';

type DeviceDetailPathProps = {
  location?: WellcubeLocation;
};

export const DeviceDetailPath: React.FC<DeviceDetailPathProps> = ({ location }: DeviceDetailPathProps) => {
  const { full_path, top_space, local_space } = location || { full_path: '' };
  const spaceCount = full_path.split('>').length - 1;

  return (
    <Hint text={full_path}>
      <div className="flex items-center">
        {spaceCount > 0 && (
          <>
            <div className="max-w-[115px] truncate break-all text-blue-brilliant">
              <span className="text-black-soft">{top_space}</span>
            </div>
          </>
        )}
        {spaceCount === 1 && (
          <>
            <i className="icon wcicon-chevron-right" />
          </>
        )}
        {spaceCount > 1 && (
          <div className="flex w-[45px]">
            <i className="icon wcicon-chevron-right" />
            <span className="text-blue-brilliant">...</span>
            <i className="icon wcicon-chevron-right" />
          </div>
        )}
        <div className="truncate break-all font-semibold text-blue-brilliant">
          <span className="text-black-soft">{local_space}</span>
        </div>
      </div>
    </Hint>
  );
};

export default DeviceDetailPath;
