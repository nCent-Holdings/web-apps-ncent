import React, { useMemo, useState } from 'react';
import { siteDesignActions } from '@src/features/site-design/siteDesign.slice';
import { useDispatch, useSelector } from 'react-redux';
import { SpCard, SpButton } from '@ncent-holdings/ux-components';
import { advTitleCase } from '../../utils/stringUtils';
import siteDesignSelectors from '@src/features/site-design/siteDesign.selectors';
import SpaceDevice from './SpaceDevice/SpaceDevice';
import { SpaceCardProps } from './types';
import AddSpace from '../../routes/client/site-design/spaces/add/AddSpace';
import { compareDevicesByCreatedAt } from '@src/utils/sortingComparators';
import { DeviceModel } from '../../api-types/models';
import SpacePath from '../SpacePath';
import { useDevices } from '@src/api-hooks/devices/devicesApi';
import IconExportSm from './IconExportSm';

export const SpaceCard = ({ spaceId, devicesDisplayMax = 3 }: SpaceCardProps) => {
  const space = useSelector(siteDesignSelectors.selectSpace(spaceId));
  const isSelected = useSelector(siteDesignSelectors.selectIsSelectedSpaceId(spaceId));
  const childSpacesIds = useSelector(siteDesignSelectors.selectChildSpacesIds(spaceId));

  const dispatch = useDispatch();

  const parentSpaceId = space?.['wellcube/space']?.parent_space_id;
  const spaceLocation = space?.['wellcube/location'];
  const spaceInfo = space?.['wellcube/space'];
  const childDevices = space?.['wellcube/devices'];
  const childSpacesMeta = space?.['wellcube/spaces']?.meta;

  const isIncomplete = spaceInfo?.setup?.status === 'incomplete';
  const notStarted = spaceInfo?.setup?.status === 'not-started';

  let cardState: 'not-started' | 'incomplete' | 'complete' | 'contents-incomplete' = 'complete';
  let cardStateMsg: string | React.ReactNode = '';
  let cardButton: React.ReactNode | undefined = undefined;

  const spacePath = spaceLocation?.full_path ?? '';

  const [toggleShowAllDevices, setToggleShowAllDevices] = useState(false);
  const [showEditSpace, setShowEditSpace] = useState(false);

  const isExpanded = useSelector(siteDesignSelectors.selectExpansionStatus(spaceId));
  const areAllDescExpanded = useSelector(siteDesignSelectors.selectAreAllDescExpanded(spaceId));

  const { devices, isLoading: loadingDevices } = useDevices({ spaceId }, { skip: !isExpanded });
  const devicesSorted = devices.sort(compareDevicesByCreatedAt);

  const allowShowAllDevices = useMemo(() => {
    return devicesSorted?.length > devicesDisplayMax;
  }, [devicesSorted, devicesDisplayMax]);

  const handleSelectSpace = () => {
    if (isSelected) {
      dispatch(siteDesignActions.setSelectedSpaceId({}));
    } else {
      dispatch(siteDesignActions.setSelectedSpaceId({ spaceId }));
    }
  };

  const handleExpandSpace = () => {
    if (isExpanded) {
      dispatch(siteDesignActions.collapseSpace({ spaceId }));
    } else {
      dispatch(siteDesignActions.expandSpace({ spaceId }));
    }
  };

  const handleExpandDevices = () => {
    setToggleShowAllDevices(!toggleShowAllDevices);
  };

  const handleCompleteSetup = () => {
    setShowEditSpace(true);
  };

  const cancelEditSpace = async () => {
    setShowEditSpace(false);
  };

  const saveEditSpace = async () => {
    setShowEditSpace(false);
  };

  const renderEditSpace = () => {
    return (
      showEditSpace && (
        <AddSpace
          open={showEditSpace}
          onCancel={cancelEditSpace}
          onSave={saveEditSpace}
          editId={spaceId}
          parentSpaceId={parentSpaceId}
        />
      )
    );
  };

  const handleToggleDescTree = () => {
    handleExpandSpace();
    handleExpandDevices();

    if (areAllDescExpanded) {
      dispatch(siteDesignActions.collapseDescendants({ spaceId }));
    } else {
      dispatch(siteDesignActions.expandDescendants({ spaceId }));
    }
  };

  if (notStarted) {
    cardState = 'not-started';
  } else if (isIncomplete) {
    cardState = 'incomplete';
    cardStateMsg = (
      <button
        className="relative z-[1] inline-flex h-6 items-center rounded-[0.1875rem] bg-[#FFDFA1] px-2 text-[.75rem] font-medium leading-[1.25] text-[#805400]"
        onClick={handleCompleteSetup}
      >
        <span className="mr-1">Incomplete setup</span>
        <IconExportSm />
      </button>
    );
  } else if (childSpacesMeta?.incomplete) {
    cardState = 'contents-incomplete';
    cardStateMsg = `${childSpacesMeta?.incomplete} incomplete components`;
    cardButton = (
      <SpButton
        label={areAllDescExpanded ? 'Collapse All' : 'Expand All'}
        variant="hide-show"
        onClick={handleToggleDescTree}
        classExtend="relative pl-4 pr-8 rounded-md"
        icon={
          areAllDescExpanded ? (
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-[14px]">
              <i className="icon wcicon-chevron-up-double" />
            </div>
          ) : (
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-[14px]">
              <i className="icon wcicon-chevron-down-double" />
            </div>
          )
        }
      />
    );
  } else {
    const spaceDevices = space?.['wellcube/devices'];
    if (spaceDevices?.meta?.commissioned) {
      cardStateMsg = 'Contains commissioned devices';
    }

    if (childSpacesMeta?.comm_devices) {
      cardStateMsg = 'Contains commissioned devices';
    }
  }

  let deviceMsg = '';
  if (childDevices?.meta?.total) {
    deviceMsg += `Devices in space: ${childDevices?.meta?.total}`;
  }

  if (childSpacesMeta?.total_spaces) {
    deviceMsg += ` Nested spaces: ${childSpacesMeta?.total_spaces}`;
  }

  if (childSpacesMeta?.total_devices) {
    deviceMsg += ` Total nested devices: ${childSpacesMeta?.total_devices}`;
  }
  const spaceType = spaceInfo?.details?.type ?? 'Unknown Type';
  let cardTypeMsg = advTitleCase(spaceType);

  if (spaceInfo?.details?.custom_type) {
    cardTypeMsg += ` | ${advTitleCase(spaceInfo?.details?.custom_type)}`;
  }
  if (spaceInfo?.details?.layout) {
    cardTypeMsg += ` | ${advTitleCase(spaceInfo?.details?.layout)}`;
  }

  const renderChildSpaces = () => {
    if (!isExpanded) {
      return <></>;
    }

    const spaceMap = childSpacesIds.map((chSpaceId) => {
      return <SpaceCard key={chSpaceId} spaceId={chSpaceId} />;
    });

    return <>{spaceMap}</>;
  };

  const renderChildDevices = () => {
    if (!isExpanded) {
      return <></>;
    }

    if (loadingDevices) {
      return (
        <div className="flex items-center justify-center border-t border-t-[#D4DFEA] p-5 text-sm text-blue-suede">
          ...
        </div>
      );
    }

    if (devicesSorted.length === 0) {
      return (
        <div className="flex items-center justify-center border-t border-t-[#D4DFEA] p-5 text-sm text-blue-suede">
          No Devices
        </div>
      );
    }

    const visibleDevices = toggleShowAllDevices ? devicesSorted : devicesSorted.slice(0, devicesDisplayMax);

    const devicesRender = visibleDevices?.map((device: DeviceModel) => {
      return <SpaceDevice key={device.id} device={device} />;
    });

    return <>{devicesRender}</>;
  };

  const renderCardTitle = () => {
    if (spacePath !== '') {
      return (
        <SpacePath
          classExtendWrapper="text-h5 font-[400]"
          fullPath={spacePath}
          pathSeparator={<div className="w-[16px] text-center">|</div>}
        />
      );
    }

    return <>{space?.name}</>;
  };

  return (
    <SpCard
      cardTitle={renderCardTitle()}
      cardState={cardState}
      cardSelected={isSelected}
      cardExpanded={isExpanded}
      cardButton={cardButton}
      cardDeviceMsg={deviceMsg}
      cardStateMsg={cardStateMsg}
      cardTypeMsg={cardTypeMsg}
      onSelectSpace={handleSelectSpace}
      onExpandSpace={handleExpandSpace}
      onExpandDevices={handleExpandDevices}
      items={renderChildDevices()}
      showExpandDevices={allowShowAllDevices}
      devicesExpanded={toggleShowAllDevices}
      checkboxAttributes={{
        'data-keep-right-panel': true,
      }}
    >
      {renderChildSpaces()}
      {renderEditSpace()}
    </SpCard>
  );
};
