import React from 'react';
import DeviceRightPanel from '../../routes/client/site-design/devices/RightPanel/DeviceRightPanel';
import SpacePanel from './SpacePanel';
import { useSelector } from 'react-redux';
import siteDesignSelectors from '@src/features/site-design/siteDesign.selectors';
import { useDevice } from '@src/api-hooks/devices/devicesApi';
import { useSpace } from '@src/api-hooks/spaces/spacesApi';
import { SquareLoader } from '@ncent-holdings/ux-components';

export const SiteDesignRightPanel = () => {
  const selectedSpaceId = useSelector(siteDesignSelectors.selectSelectedSpaceId);
  const selectedDeviceId = useSelector(siteDesignSelectors.selectSelectedDeviceId);

  const { space: selectedSpace, isFetching: isSpaceLoading } = useSpace(selectedSpaceId, { skip: !selectedSpaceId });
  const { device: selectedDevice, isFetching: isDeviceLoading } = useDevice(selectedDeviceId, {
    skip: !selectedDeviceId,
  });

  if (isSpaceLoading || isDeviceLoading) {
    return <SquareLoader className="flex h-full w-full items-center justify-center" />;
  }

  if (selectedSpace) {
    return <SpacePanel selectedSpace={selectedSpace} />;
  } else if (selectedDevice) {
    return <DeviceRightPanel device={selectedDevice} />;
  } else {
    return (
      <div className=" my-auto flex flex-1 flex-col py-5">
        {/* EVERGREEN PROPERTIES PANEL */}
        <div className="my-auto flex max-h-[700px] flex-col gap-[40px] px-4 text-center">
          <div className="flex-[0_0_auto]">
            <img src="/images/illus-rightpanel-evergreen-02.svg?react" className="mx-auto block" />
          </div>
          <div className="justify-space-between flex flex-[1_1_auto] flex-col justify-center  py-4">
            <div className="text-[1.5rem] font-semibold leading-[1.25] tracking-[-0.0416em]">
              Find and update system design details
            </div>
            <div className="mt-3 text-[1rem] leading-[1.5]">
              <div>Select a space or device in the table to view or edit it here.</div>
              <div className="mt-3">
                To learn more about system design, visit the{' '}
                <a
                  href="https://support.delos.com/hc/en-us"
                  className="inline-block text-blue-brilliant underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Knowledge Base
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default SiteDesignRightPanel;
