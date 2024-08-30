import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import siteDesignSelectors from '../../../features/site-design/siteDesign.selectors';
import { SpaceCard } from '../../../components/SpaceCard/SpaceCard';
import { Heading, ActionBar, ActionBarButton, SpWrap } from '@ncent-holdings/ux-components';
import AddSpace from './spaces/add/AddSpace';
import AddDevice from './devices/add/AddDevice';

import { useAppNav } from '../../../contexts/AppNavContext/AppNavContext';
import SiteDesignRightPanel from '../../../components/SiteDesign/SiteDesignRightPanel';
import { siteDesignActions } from '../../../features/site-design/siteDesign.slice';
import DeleteSpaces from './spaces/delete/DeleteSpaces';
import DeleteDevices from './devices/delete/DeleteDevices';
import clsx from 'clsx';
import ScrollVisibleElement from '../../../components/ScrollVisibleElement/ScrollVisibleElement';
import { twMerge } from 'tailwind-merge';
import IconActionAddSpace from '../../../components/icons/IconActionAddSpace';
import { useGateways } from '@src/api-hooks/gateways/gatewaysApi';
import IconActionAddDevice from '../../../components/icons/IconActionAddDevice';
import IconActionMove from '../../../components/icons/IconActionMove';
import IconActionDelete from '../../../components/icons/IconActionDelete';
import LoaderOverlay from '@components/LoaderOverlay/LoaderOverlay';
import MoveDevice from './devices/move/MoveDevice';
import MoveSpace from './spaces/move/MoveSpace';
import { useSpace } from '@src/api-hooks/spaces/spacesApi';
import { useDevice } from '@src/api-hooks/devices/devicesApi';
import useSiteSpacesLoader from './useSiteSpacesLoader';
import { compareSpacesByCreatedAt } from '@src/utils/sortingComparators';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

export const SiteDesign = () => {
  const [initialLoad, setInitialLoad] = useState(true);
  const dispatch = useDispatch();
  const appNav = useAppNav();

  const { isLoading: loadingSpaces } = useSiteSpacesLoader();

  const { siteId: selectedSiteId } = useSiteFromHandleOrLastStored();

  const selectedSpaceId = useSelector(siteDesignSelectors.selectSelectedSpaceId);
  const selectedDeviceId = useSelector(siteDesignSelectors.selectSelectedDeviceId);
  const { space: selectedSpace } = useSpace(selectedSpaceId, { skip: !selectedSpaceId });
  const { device: selectedDevice } = useDevice(selectedDeviceId, { skip: !selectedDeviceId });

  const [isModalDeleteSpacesOpen, setIsModalDeleteSpacesOpen] = useState(false);
  const [isModalDeleteDevicesOpen, setIsModalDeleteDevicesOpen] = useState(false);

  const [isModalMoveSpaceOpen, setIsModalMoveSpaceOpen] = useState(false);
  const [isModalMoveDeviceOpen, setIsModalMoveDeviceOpen] = useState(false);

  const [isAddTLSpace, setIsAddTLSpace] = useState(false);
  const [isModalAddSpaceOpen, setIsModalAddSpaceOpen] = useState(false);
  const [isModalAddDeviceOpen, setIsModalAddDeviceOpen] = useState(false);

  const overallExpandStatus = useSelector(siteDesignSelectors.selectOverallExpandStatus);
  const topLevelSpaces = useSelector(siteDesignSelectors.selectTopLevelSpaces);

  const showActionBar = selectedSpace || selectedDevice;

  const { gateways: gatewayList, isLoading: loadingGateways } = useGateways(
    { siteId: selectedSiteId },
    { skip: !selectedSiteId },
  );

  useEffect(() => {
    appNav.setRightPanelContent(<SiteDesignRightPanel />);
    appNav.shrinkRightPanel();

    appNav.setStickyHeader(
      <div className="mx-auto flex w-full max-w-[var(--content-max-lg)] items-end">
        <div className="  text-[1.25rem] font-semibold leading-[1.25] tracking-[-0.0625rem] text-black-soft ">
          System design
        </div>
        <div className="ml-auto flex items-center text-[.875rem] leading-[1.25] text-[#272B32]">
          <button onClick={handleTLAddSpace} className="flex items-center">
            <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-[0.3125rem] bg-blue-brilliant text-white">
              <i className="icon icon-16 wcicon-plus" />
            </div>
            Add a top-level space
          </button>
        </div>
      </div>,
    );

    return () => {
      appNav.hideRightPanel();
      dispatch(siteDesignActions.clear());
    };
  }, []);

  useEffect(() => {
    const showExpandedRightPanel = selectedSpaceId.length || selectedDeviceId.length;

    showExpandedRightPanel ? appNav.expandRightPanel() : appNav.shrinkRightPanel();
  }, [selectedSpaceId, selectedDeviceId]);

  useEffect(() => {
    if (!loadingSpaces && !loadingGateways && initialLoad) {
      setInitialLoad(false);
    }
  }, [loadingSpaces, loadingGateways]);

  const renderSpaces = () => {
    // 1. Sort by oldest first (check AC)
    // 2.

    const mappedSpaces = topLevelSpaces
      .sort(compareSpacesByCreatedAt)
      .map((space) => <SpaceCard key={space.id} spaceId={space.id} />);

    return <SpWrap>{mappedSpaces}</SpWrap>;
  };

  const handleClearSelectedSpace = () => {
    dispatch(siteDesignActions.setSelectedSpaceId({}));
  };

  const handleClearSelectedDevice = () => {
    dispatch(siteDesignActions.setSelectedDeviceId({}));
  };

  const handleAddSpace = () => {
    setIsAddTLSpace(false);
    setIsModalAddSpaceOpen(true);
  };

  const handleTLAddSpace = () => {
    setIsAddTLSpace(true);
    setIsModalAddSpaceOpen(true);
  };

  const handleAddDevice = () => {
    setIsModalAddDeviceOpen(true);
  };

  const handleMoveSpace = () => {
    setIsModalMoveSpaceOpen(true);
  };

  const handleDeleteSpace = () => {
    setIsModalDeleteSpacesOpen(true);
  };

  const handleDeleteDevice = () => {
    setIsModalDeleteDevicesOpen(true);
  };

  const cancelAddSpace = async () => {
    setIsModalAddSpaceOpen(false);
  };

  const saveAddSpace = async (spaceId: string) => {
    setIsModalAddSpaceOpen(false);

    dispatch(siteDesignActions.setSelectedSpaceId({ spaceId }));
    dispatch(siteDesignActions.expandParentSpace({ spaceId }));
    dispatch(siteDesignActions.expandSpace({ spaceId }));
  };

  const cancelAddDevice = async () => {
    setIsModalAddDeviceOpen(false);
  };

  const saveAddDevice = async (deviceId: string) => {
    setIsModalAddDeviceOpen(false);

    dispatch(siteDesignActions.setSelectedDeviceId({ deviceId }));

    // Selected space will be device parent space
    if (selectedSpace) {
      dispatch(siteDesignActions.expandSpace({ spaceId: selectedSpace.id }));
    }
  };

  const handleExpandAll = () => {
    dispatch(siteDesignActions.expandAll());
  };

  const handleCollapseAll = () => {
    dispatch(siteDesignActions.collapseAll());
  };

  const renderAddSpace = () => {
    const parentSpaceId = isAddTLSpace ? undefined : selectedSpace?.id;

    return (
      <AddSpace
        open={isModalAddSpaceOpen}
        onCancel={cancelAddSpace}
        onSave={saveAddSpace}
        parentSpaceId={parentSpaceId}
      />
    );
  };

  const renderAddDevice = () => {
    if (!selectedSpace || !selectedSiteId) {
      return <></>;
    }

    return (
      <AddDevice
        open={isModalAddDeviceOpen}
        onCancel={cancelAddDevice}
        onSave={saveAddDevice}
        siteId={selectedSiteId}
        spaceId={selectedSpace.id}
        gatewayList={gatewayList}
      />
    );
  };

  const renderSpaceList = () => {
    let collapseControls = <></>;
    const expandButton = (
      <div
        className="flex h-full min-w-[10rem] flex-1 cursor-pointer items-center justify-end pr-[1.375rem] font-semibold text-[#344054]"
        onClick={handleExpandAll}
      >
        <div>Expand all</div>
        <div className="ml-[1.25rem] flex h-8 w-6 flex-col items-center justify-center rounded-md border border-[#DDE2EC]">
          <i className="icon icon-16 wcicon-chevron-down-double" />
        </div>
      </div>
    );

    const collapseButton = (
      <div
        className="flex h-full min-w-[10rem] flex-1 cursor-pointer items-center justify-end pr-[1.375rem] font-semibold text-[#344054]"
        onClick={handleCollapseAll}
      >
        <div>Collapse all</div>
        <div className="ml-[1.25rem] flex h-8 w-6 flex-col items-center justify-center rounded-md border border-[#DDE2EC]">
          <i className="icon icon-16 wcicon-chevron-up-double" />
        </div>
      </div>
    );

    if (overallExpandStatus === 'mixed') {
      collapseControls = (
        <div className="flex h-full flex-1 [&>*:nth-child(2)]:border-l-[.5px] [&>*:nth-child(2)]:border-l-blue-suede-light">
          {collapseButton}
          {expandButton}
        </div>
      );
    } else if (overallExpandStatus === 'expanded') {
      collapseControls = collapseButton;
    } else if (overallExpandStatus === 'collapsed') {
      collapseControls = expandButton;
    }

    return (
      <div className="isolate">
        <div className="relative z-[100] mb-8 flex ">
          <Heading heading="System design" />
          <div className="ml-auto flex items-end text-[.875rem] leading-[1.25] text-[#272B32]">
            <button onClick={handleTLAddSpace} className="flex items-center">
              <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-[0.3125rem] bg-blue-brilliant text-white">
                <i className="icon icon-16 wcicon-plus" />
              </div>
              Add a top-level space
            </button>
          </div>
        </div>

        <div className="isolate">
          <div className="sticky top-[calc(2rem+var(--titleonscroll-height))] z-[1] border-b border-b-blue-light-suede ">
            <div className="del-th-sticky-spacer absolute top-0 z-[-1] h-[calc(3rem+var(--titleonscroll-height))] w-full -translate-y-[calc(100%-1rem)] bg-white-background shadow-[1px_0_0_#ECF4FA]"></div>
            <div className=" isolate z-[100] flex h-[3.75rem] rounded-tl-2xl rounded-tr-2xl bg-white-soft text-[.75rem] font-semibold  text-black-soft">
              <div className="flex flex-1">
                <div className="flex items-center pl-4">Spaces</div>
              </div>
              <div className=" border-l-[.5px] border-l-blue-suede-light">{collapseControls}</div>
            </div>
          </div>
          <div className="relative rounded-bl-2xl rounded-br-2xl bg-white-soft p-5 [&_.spchildren:empty]:hidden">
            <LoaderOverlay loading={loadingSpaces}>{renderSpaces()}</LoaderOverlay>
          </div>
        </div>
        <div className={twMerge('h-0 transition-height', showActionBar && 'h-28')} />
        <div
          className={clsx(
            'fixed bottom-0 left-0 right-0 z-[1000] flex ',
            // l0r0
            '[.l0.r0_&]:pl-[var(--left-l0r0-inset)]',
            '[.l0.r0_&]:pr-[var(--right-l0r0-inset)]',
            // l1r0
            '[.l1.r0_&]:pl-[var(--left-l1r0-inset)]',
            '[.l1.r0_&]:pr-[var(--right-l1r0-inset)]',
            // l0r1
            '[.l0.r1_&]:pl-[var(--left-l0r1-inset)]',
            '[.l0.r1_&]:pr-[var(--right-l0r1-inset)]',
            // l1r1
            '[.l1.r1_&]:pl-[var(--left-l1r1-inset)]',
            '[.l1.r1_&]:pr-[var(--right-l1r1-inset)]',
            // l0r2
            '[.l0.r2_&]:pl-[var(--left-l0r2-inset)]',
            '[.l0.r2_&]:pr-[var(--right-l0r2-inset)]',
            // l1r2
            '[.l1.r2_&]:pl-[var(--left-l1r2-inset)]',
            '[.l1.r2_&]:pr-[var(--right-l1r2-inset)]',
          )}
        >
          {renderActionBar()}
        </div>
      </div>
    );
  };

  const handleMoveDevice = () => {
    setIsModalMoveDeviceOpen(true);
  };

  const renderActionBar = () => {
    if (selectedSpace) {
      const spaceType = selectedSpace['wellcube/space']?.details.type;
      const commissionedDevices = selectedSpace['wellcube/devices']?.meta.commissioned || 0;

      return (
        <ActionBar open onClose={handleClearSelectedSpace} position="sticky-center" classExtend="static mx-0">
          {/* Space Action Buttons  */}

          {/* text: 'ADD SPACE', action: handleAddSpace, */}
          <ActionBarButton icon={<IconActionAddSpace />} onClick={handleAddSpace} label="Add a space" />

          {/* text: 'ADD A DEVICE', action: handleAddDevice, */}

          <ActionBarButton icon={<IconActionAddDevice />} onClick={handleAddDevice} label="Add a device" />

          {/* text: 'MOVE', action: handleMoveSpace, */}
          {spaceType !== 'floor' && spaceType !== 'building' && commissionedDevices == 0 && (
            <ActionBarButton icon={<IconActionMove />} onClick={handleMoveSpace} label="Move" />
          )}
          {/* text: 'DELETE', action: handleDeleteSpace, */}
          <ActionBarButton icon={<IconActionDelete />} onClick={handleDeleteSpace} label="Delete" />
        </ActionBar>
      );
    } else if (selectedDevice) {
      const deviceStatus = selectedDevice['wellcube/device']?.status || 'uncommissioned';

      console.log(`Device status = ${deviceStatus}`);
      return (
        <ActionBar open position="sticky-center" onClose={handleClearSelectedDevice} classExtend="static mx-0">
          {/* Device Action Buttons */}

          {/* text: 'MOVE', action: handleMoveDevice, */}
          {deviceStatus === 'uncommissioned' && (
            <ActionBarButton icon={<IconActionMove />} onClick={handleMoveDevice} label="Move" />
          )}

          {/* text: 'DELETE', action: handleDeleteDevice, */}
          <ActionBarButton icon={<IconActionDelete />} onClick={handleDeleteDevice} label="Delete" />
        </ActionBar>
      );
    }
  };

  const renderEmptyState = () => {
    return <></>;
  };

  const showLoader = loadingSpaces && loadingGateways && initialLoad;

  return (
    <div className="flex w-full flex-1 flex-col">
      <ScrollVisibleElement scrollTitle="System design"></ScrollVisibleElement>
      {showLoader && <div>...</div>}
      {!showLoader && topLevelSpaces.length === 0 && renderEmptyState()}
      {renderSpaceList()}
      {renderAddSpace()}
      {renderAddDevice()}
      {isModalDeleteDevicesOpen && selectedDevice && (
        <DeleteDevices
          isOpen={isModalDeleteDevicesOpen}
          setIsModalOpen={setIsModalDeleteDevicesOpen}
          selectedDevice={selectedDevice}
        />
      )}
      {isModalDeleteSpacesOpen && selectedSpace && (
        <DeleteSpaces
          isOpen={isModalDeleteSpacesOpen}
          setIsModalOpen={setIsModalDeleteSpacesOpen}
          selectedSpace={selectedSpace}
        />
      )}
      {isModalMoveDeviceOpen && selectedDevice && (
        <MoveDevice
          isOpen={isModalMoveDeviceOpen}
          onClose={() => setIsModalMoveDeviceOpen(false)}
          selectedDevice={selectedDevice}
        />
      )}
      {isModalMoveSpaceOpen && selectedSpace && (
        <MoveSpace
          isOpen={isModalMoveSpaceOpen}
          onClose={() => setIsModalMoveSpaceOpen(false)}
          selectedSpace={selectedSpace}
        />
      )}
    </div>
  );
};

export default SiteDesign;
