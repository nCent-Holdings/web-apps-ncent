import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Heading, Button, RadioGroup, Radio, Input, type SearchInputRef, Modal } from '@ncent-holdings/ux-components';
import { useDispatch, useSelector } from 'react-redux';
import { SortingState } from '@tanstack/react-table';
import _ from 'lodash';

import { useSpaces } from '@src/api-hooks/spaces/spacesApi';
import { useSensors } from '@src/api-hooks/sensors/sensorsApi';
import { usePurifiers } from '@src/api-hooks/purifiers/purifiersApi';
import { useGateways } from '@src/api-hooks/gateways/gatewaysApi';

import dmSelectors from '@src/features/device-management/dm.selectors';

import { dmActions } from '@src/features/device-management/dm.slice';

import ScrollVisibleElement from '../../../components/ScrollVisibleElement/ScrollVisibleElement';
import FleetSettingsModal from '../../../components/FleetSettingsModal';

import SensorsList from './SensorsList';
import PurifiersList from './PurifiersList';
import GatewaysList from './GatewaysList';

import { Device, DEVICE_TYPE } from './types';
import EmptyTableMessage, { EmptyTableMessageProps } from './EmptyTableMessage';
import DeviceDetailsModal from '../../../components/DeviceDetailsModal/DeviceDetailsModal';
import DeviceManagementRightPanel from './filter-space/DeviceManagementRightPanel';
import { createSearchValues } from '../../../utils/searchUtils';
import clsx from 'clsx';
import UncommissionedDeviceModal from '../../../components/UncommissionedDeviceModal/UncommissionedDeviceModal';
import { useAppNav } from '@src/contexts/AppNavContext/AppNavContext';
import { useDeviceDetailsContext } from '@src/contexts/DeviceDetailsContext/DeviceDetailsContext';
import useSiteSpacesLoader from './useSiteSpacesLoader';
import { useOrganizationFromHandle } from '@src/features/useOrganizationFromHandle';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

const initialSorting: SortingState = [{ id: 'name', desc: false }];

const DeviceManagement: React.FC = () => {
  const deviceDetails = useDeviceDetailsContext();
  const [showUncommissionedModal, setShowUncommissionedModal] = useState(false);
  useSiteSpacesLoader();

  const [deviceType, setDeviceType] = useState<string>(DEVICE_TYPE.PURIFIER);

  const searchSpacesFiltered: string = useSelector(dmSelectors.selectFilteredSearchSpacesIds);

  const searchSpacesIds = useSelector(dmSelectors.selectSearchSpacesIds);

  const { site: selectedSite } = useSiteFromHandleOrLastStored();
  const [search, setSearch] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    handleFilter(false);
  }, [selectedSite]);

  const searchNoun = createSearchValues(search, searchSpacesFiltered);

  const scrollRef = useRef<null | HTMLDivElement>(null);
  const searchInputRef = useRef<SearchInputRef>();
  const stickySearchInputRef = useRef<SearchInputRef>();

  const { orgName } = useOrganizationFromHandle();

  const { spaces } = useSpaces({ siteId: selectedSite?.id }, { skip: !selectedSite });
  const spacesCount = spaces.length;

  const [showSchedule, setShowSchedule] = useState(false);
  const siteSchedule = selectedSite?.['wellcube/site']?.active_schedule;
  const handleCloseSchedule = () => {
    setShowSchedule(false);
  };

  const handleOpenSchedule = () => {
    setShowSchedule(true);
  };

  const handleCloseDetails = () => {
    deviceDetails.closeDetails();
  };

  const handleShowDetails = (evt: unknown, device: Device) => {
    if (device.connectivity === 'uncommissioned') {
      setShowUncommissionedModal(true);
    } else {
      deviceDetails.openDetails(device.id);
    }
  };
  const handleClearFilters = () => {
    dispatch(dmActions.setSearchSpacesIds({ spacesIds: [] }));
  };

  const handleCloseUncommissionedModal = () => {
    setShowUncommissionedModal(false);
  };

  const siteId = selectedSite?.id || '';

  const queryArg = { siteId, searchNoun };
  const queryOptions = { skip: !siteId };

  const { sensors, isLoading: sensorsLoading } = useSensors(queryArg, queryOptions);
  const { purifiers, isLoading: purifiersLoading } = usePurifiers(queryArg, queryOptions);
  const { gateways, isLoading: gatewaysLoading } = useGateways(queryArg, queryOptions);

  const spacesFilterCount = useMemo(() => {
    const arrays = [...purifiers, ...sensors, ...gateways];

    const groupByLocalSpace = (...arrays: unknown[]) => {
      return _.chain(arrays)
        .flattenDeep()
        .groupBy((item) => _.get(item, 'wellcube/location.local_space'))
        .mapValues((items: unknown[]) => items.length);
    };

    const groupedByLocalSpace = groupByLocalSpace(arrays);
    return Object.keys(groupedByLocalSpace.value())?.length;
  }, [purifiers, sensors, gateways]);

  const devicesCount = useMemo(() => {
    return sensors.length + purifiers.length + gateways.length;
  }, [sensors, purifiers, gateways]);

  const updateSearch = (newSearch = '') => {
    setSearch(newSearch);
  };

  const clearSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.reset();
    }

    if (stickySearchInputRef.current) {
      stickySearchInputRef.current.reset();
    }
  };

  const contactManager = () => {
    window.location.href = `mailto:your.manager@mail.com?subject=Add Devices to ${orgName}/${selectedSite?.name}`;
  };

  const handleToggleFilters = () => {
    handleFilter(!isFilterOpen);
  };

  const handleOpenFilters = () => {
    handleFilter(true);
  };

  const handleFilter = (openFilters: boolean) => {
    if (openFilters) {
      appNav.overlayRightPanel();
      setIsFilterOpen(true);
    } else {
      appNav.hideRightPanel();
      setIsFilterOpen(false);
    }
  };

  const renderTable = () => {
    const getEmptyMessageProps = (devicesType: string): EmptyTableMessageProps => {
      const type: EmptyTableMessageProps['type'] = search ? 'no-search-match' : 'no-devices';
      const devices = devicesCount === 0 ? 'devices' : devicesType;

      return {
        type,
        devices,
        onClearSearch: clearSearch,
        onContactManager: contactManager,
      };
    };

    switch (deviceType) {
      case DEVICE_TYPE.PURIFIER:
        return (
          <PurifiersList
            purifiers={purifiers}
            loading={purifiersLoading}
            emptyMessage={<EmptyTableMessage {...getEmptyMessageProps('purifiers')} />}
            sorting={sorting}
            onSortChange={setSorting}
            onClickCard={handleShowDetails}
          />
        );
      case DEVICE_TYPE.SENSOR:
        return (
          <SensorsList
            sensors={sensors}
            loading={sensorsLoading}
            emptyMessage={<EmptyTableMessage {...getEmptyMessageProps('sensors')} />}
            sorting={sorting}
            onSortChange={setSorting}
            onClickCard={handleShowDetails}
          />
        );
      case DEVICE_TYPE.GATEWAY:
        return (
          <GatewaysList
            gateways={gateways}
            loading={gatewaysLoading}
            emptyMessage={<EmptyTableMessage {...getEmptyMessageProps('gateways')} />}
            sorting={sorting}
            onSortChange={setSorting}
            onClickCard={handleShowDetails}
          />
        );
      default:
        return null;
    }
  };

  const renderRadioLabel = (label: string, count: number) => {
    return (
      <div className="flex h-[22px] flex-row items-center gap-1">
        {label}
        {(search || searchSpacesFiltered) && count ? (
          <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-alert-issue text-mini font-semibold leading-none text-black-soft">
            {count}
          </div>
        ) : null}
      </div>
    );
  };

  interface deviceMgmtStickyHdTabProps {
    label: string;
    onClick: () => void;
    selected?: boolean;
  }

  const DeviceMgmtStickyHdTab = ({ onClick, label, selected }: deviceMgmtStickyHdTabProps) => {
    return (
      <button
        onClick={onClick}
        className={clsx(
          'relative rounded-sm px-[1.25rem] py-[.25rem] text-[0.75rem] font-medium capitalize leading-[1.25]',
          'before:absolute before:bottom-0 before:left-[1.25rem] before:right-[1.25rem] before:h-[.25rem] before:bg-[#0061FF]',
          'after:absolute after:left-0 after:top-1/2 after:h-[1.25rem] after:-translate-y-1/2 after:border-l after:border-l-[#C1DBEA] ',
          !selected && 'text-[#667085] before:hidden',
          selected && 'text-[#272B32] before:block ',
        )}
      >
        {label}
      </button>
    );
  };

  const renderFilterResult = (titleOnScroll: boolean) => {
    if (searchSpacesIds.length > 0 && devicesCount > 0) {
      return (
        <div className={clsx('relative z-[1]', 'flex justify-end', !titleOnScroll && 'mt-4', titleOnScroll)}>
          <div
            className={clsx(
              'flex items-center gap-3 rounded-lg bg-blue-water p-3',
              titleOnScroll && 'h-10 bg-[#E3EDF7] text-[0.75rem] font-medium leading-[1.25]',
            )}
          >
            <p>
              You have applied <span className="font-bold">{searchSpacesIds.length}</span> filters
            </p>
            <div className="rounded border-solid border-white-soft bg-white-soft p-1 shadow-icon-xmark ">
              <span
                className={clsx('flex cursor-pointer items-center text-blue-brilliant', !titleOnScroll && 'text-h6')}
                onClick={handleClearFilters}
              >
                <i className="icon wcicon-xmark " />
              </span>
            </div>
            <p onClick={handleOpenFilters} className="cursor-pointer text-[.75rem] font-medium text-blue-brilliant">
              <span>EDIT</span>
              {''} {!titleOnScroll && <span>FILTERS</span>}
            </p>
          </div>
        </div>
      );
    }

    {
      /* Filter Message with NO Results  */
    }
    if (searchSpacesFiltered && devicesCount === 0) {
      return (
        <div className="relative z-[1] flex flex-col">
          <div className="mb-[6px] mt-[57px] flex gap-1 text-[.75rem] font-medium text-blue-brilliant">
            <span onClick={handleClearFilters} className="cursor-pointer border-r border-blue-light-suede pr-2">
              CLEAR FILTERS
            </span>
            <span onClick={handleOpenFilters} className="cursor-pointer pl-2">
              EDIT FILTERS
            </span>
          </div>
          <p className="flex w-full gap-1 text-h5">
            {`The filters you have selected match no devices. You have applied`}{' '}
            <span className="font-bold">{searchSpacesIds.length}</span> <p>{`Filters.`}</p>
          </p>
        </div>
      );
    }
  };

  const appNav = useAppNav();

  useEffect(() => {
    const handleTitleOnScrollClick = (deviceType: DEVICE_TYPE) => {
      setDeviceType(deviceType);
      if (scrollRef?.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    appNav.setStickyHeader(
      <div className="flex min-w-[1200px]">
        <div className="flex items-center">
          <div className="text-[1.25rem] font-semibold leading-[1.25] tracking-[-.0625rem] ">Devices</div>
          <div className="ml-[1.25rem] h-[1.9375rem] border-l border-l-[#84ADC7]"></div>
          <div className="flex [&_button:first-child]:after:hidden [&_button]:cursor-pointer">
            <DeviceMgmtStickyHdTab
              label={DEVICE_TYPE.PURIFIER}
              onClick={() => handleTitleOnScrollClick(DEVICE_TYPE.PURIFIER)}
              selected={deviceType === DEVICE_TYPE.PURIFIER ? true : false}
            />
            <DeviceMgmtStickyHdTab
              label={DEVICE_TYPE.SENSOR}
              onClick={() => handleTitleOnScrollClick(DEVICE_TYPE.SENSOR)}
              selected={deviceType === DEVICE_TYPE.SENSOR ? true : false}
            />
            <DeviceMgmtStickyHdTab
              label={DEVICE_TYPE.GATEWAY}
              onClick={() => handleTitleOnScrollClick(DEVICE_TYPE.GATEWAY)}
              selected={deviceType === DEVICE_TYPE.GATEWAY ? true : false}
            />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Input.Search
            id="search-input"
            placeholder="Search by name, asset ID, or space"
            type="text"
            inputSize="small"
            onSearch={updateSearch}
            searchInputRef={stickySearchInputRef}
            classExtendWrapper={{
              default: 'w-[18.75rem]',
              active: 'w-[22rem] ',
            }}
          />
          {searchSpacesIds.length === 0 && (
            <Button
              size="small"
              disabled={spacesCount === 0 || devicesCount === 0}
              variant={searchSpacesFiltered ? 'primary' : 'inverse'}
              label={<i className="icon icon-lg icon-16 wcicon-sliders-up " />}
              onClick={handleToggleFilters}
            />
          )}
          {!isFilterOpen && renderFilterResult(true)}
        </div>
      </div>,
    );
  }, [deviceType, searchSpacesIds, devicesCount, spacesCount, search, stickySearchInputRef, isFilterOpen]);

  return (
    <div ref={scrollRef} className="relative min-w-[var(--content-max-lg)]">
      <div className="relative z-[3] flex flex-row items-center justify-between">
        <div className="mb-3 ">
          <ScrollVisibleElement scrollTitle="Devices">
            <Heading heading="Devices" />
          </ScrollVisibleElement>
        </div>
        <Button
          size="medium"
          variant="inverse"
          onClick={handleOpenSchedule}
          label={
            <span className="flex flex-row items-center gap-3">
              <span className="text-xs">SCHEDULING</span>
              <i className="icon icon-lg wcicon-gear-alt" />
            </span>
          }
        />
      </div>

      <div className="relative z-[2] mt-5 flex flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          <RadioGroup
            direction="horizontal"
            variant="inline"
            name="view-by-radiogroup"
            value={deviceType}
            onChange={setDeviceType}
            className="shadow-com-tab-container [&>.bg-blue-brilliant]:shadow-com-tab-selected"
          >
            <Radio
              key={DEVICE_TYPE.PURIFIER}
              id={DEVICE_TYPE.PURIFIER}
              label={renderRadioLabel(DEVICE_TYPE.PURIFIER, purifiers.length)}
              value={DEVICE_TYPE.PURIFIER}
            />
            <Radio
              key={DEVICE_TYPE.SENSOR}
              id={DEVICE_TYPE.SENSOR}
              label={renderRadioLabel(DEVICE_TYPE.SENSOR, sensors.length)}
              value={DEVICE_TYPE.SENSOR}
            />
            <Radio
              key={DEVICE_TYPE.GATEWAY}
              id={DEVICE_TYPE.GATEWAY}
              label={renderRadioLabel(DEVICE_TYPE.GATEWAY, gateways.length)}
              value={DEVICE_TYPE.GATEWAY}
            />
          </RadioGroup>
        </div>
        <div className="flex items-center gap-4 ">
          <Input.Search
            id="search-input"
            placeholder="Search by name, asset ID, or space"
            type="text"
            inputSize="medium"
            onSearch={updateSearch}
            searchInputRef={searchInputRef}
            classExtendWrapper={{
              default: 'w-[380px]',
              active: 'w-[550px] max-xl:w-[400px]',
            }}
          />
          <Button
            size="medium"
            disabled={spacesCount === 0 || devicesCount === 0}
            variant={searchSpacesFiltered ? 'primary' : 'inverse'}
            icon={<i className="icon icon-lg wcicon-sliders-up" />}
            onClick={handleToggleFilters}
          />
        </div>
      </div>

      {renderFilterResult(false)}

      {/* Filter Message with Results  */}
      {(searchSpacesFiltered || search) && devicesCount > 0 && (
        <div className={clsx('relative z-[1] ', !searchSpacesFiltered ? 'mt-12' : '', 'flex flex-row items-end gap-4')}>
          <span className="text-h5">
            {`Showing`} {''}
            <span className="font-bold">
              {`${devicesCount}`} {''}
            </span>
            {'devices in'} {''}
            <span className="font-bold">
              {`${spacesFilterCount}`} {''}
            </span>
            {'spaces'}
          </span>
        </div>
      )}

      <div className=" mt-12 rounded-2xl">
        <div className="table-container relative">{renderTable()}</div>
      </div>

      <Modal onClose={handleCloseSchedule} open={showSchedule} showCloseButton maxWidth="lg">
        <>
          {siteSchedule && (
            <FleetSettingsModal
              siteId={selectedSite?.id}
              siteSchedule={siteSchedule}
              onClose={handleCloseSchedule}
              isOpen={showSchedule}
            />
          )}
        </>
      </Modal>

      <DeviceDetailsModal onClose={handleCloseDetails} deviceId={deviceDetails.deviceId} />
      <UncommissionedDeviceModal onClose={handleCloseUncommissionedModal} isOpen={showUncommissionedModal} />

      {isFilterOpen && <DeviceManagementRightPanel handleFilter={handleFilter} />}
    </div>
  );
};

export default DeviceManagement;
