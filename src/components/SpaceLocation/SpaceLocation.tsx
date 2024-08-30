import React, { useMemo } from 'react';
import { SpaceLocationProps } from './types';
import { twMerge } from 'tailwind-merge';
import { IconLocation } from '@ncent-holdings/ux-components';
import { Tooltip } from '@ncent-holdings/ux-components';

import { v4 as uuidv4 } from 'uuid';

export const SpaceLocation = ({
  location,
  inline = false,
  classExtend,
  localClassExtend,
  topClassExtend,
}: SpaceLocationProps) => {
  if (!location) {
    return <div className={twMerge('text-sm font-semibold', !!classExtend && classExtend)}>Location unknown</div>;
  }

  const tooltipId = useMemo(() => {
    return uuidv4();
  }, [location]);

  const spaceCount = useMemo(() => {
    return location?.full_path?.split('>')?.length;
  }, [location]);

  return (
    <>
      <Tooltip tooltipId={tooltipId} singleLine tooltipProps={{ place: 'top-start', positionStrategy: 'fixed' }}>
        {location?.full_path}
      </Tooltip>
      <div
        className={twMerge('w-fit', inline && 'flex items-center', !!classExtend && classExtend)}
        data-tooltip-id={tooltipId}
      >
        {spaceCount > 1 && (
          <div
            className={twMerge(
              'line-clamp-1 w-fit break-all text-sm font-semibold text-grey-light-500',
              !inline && 'mb-1',
              inline && 'mr-1.5',
              !!topClassExtend && topClassExtend,
            )}
          >
            {location?.top_space}
          </div>
        )}
        <div
          className={twMerge(
            'flex w-fit items-center font-semibold text-black-light-soft',
            inline && 'font-medium',
            !!localClassExtend && localClassExtend,
          )}
        >
          <div className="mr-1 h-4 w-4">
            <IconLocation variant="filled" />
          </div>
          <div className="line-clamp-1 break-all">{location?.local_space}</div>
        </div>
      </div>
    </>
  );
};

export default SpaceLocation;
