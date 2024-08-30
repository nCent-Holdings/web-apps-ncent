import { Button, Dropdown } from '@ncent-holdings/ux-components';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../../../../../actions/spaces';
import { SpaceModel } from '@src/api-types/models';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

type SelectLocationProps = {
  currentSubspacesIds: string[];
  selectedSpace: SpaceModel;
  hasDevices: boolean;
  retain: boolean;
  onCancel: () => void;
  onOk: (id: string) => void;
};

type Option = {
  id: string;
  value: string;
  label?: string;
};

const SelectLocation = ({
  currentSubspacesIds,
  selectedSpace,
  hasDevices,
  retain,
  onCancel,
  onOk,
}: SelectLocationProps) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [destinationSpace, setDestinationSpace] = useState<Option>();

  const { siteId: selectedSiteId } = useSiteFromHandleOrLastStored();

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    const spacesList = await get([
      ...currentSubspacesIds.map((id) => `(id!=${id})`),
      `(id!=${selectedSpace.id})`,
      `(id!=${selectedSpace['wellcube/space']?.parent_space_id})`,
      `(site_id==${selectedSiteId})`,
      '(wellcube/location.full_path!=)',
      '(sort=wellcube/location.full_path)',
    ]);

    setOptions(
      spacesList
        .sort((a, b) => {
          const firstEl = a['wellcube/location']?.full_path.toLowerCase().replaceAll('>', '') || '';
          const secondEl = b['wellcube/location']?.full_path.toLowerCase().replaceAll('>', '') || '';
          return firstEl?.localeCompare(secondEl);
        })
        .map((space) => ({
          id: space.id,
          value: space.id,
          label: `${space['wellcube/location']?.full_path}`,
        })),
    );
  };

  const handleSubmit = async () => {
    if (destinationSpace) await onOk(destinationSpace.value);
  };

  const renderHeadline = () => {
    const header = retain
      ? 'You have opted to retain all device assignments.'
      : 'You will remove all device assignments.';

    return hasDevices ? (
      <div className="mb-9">
        <p className="mb-3 font-semibold">{header}</p>
        <p>To move this space including any spaces inside it, choose a new destination from the list below.</p>
      </div>
    ) : (
      <p className="mb-6">To move this space, including any subspaces, choose a new destination from the list below.</p>
    );
  };

  const renderHeader = () => {
    return hasDevices ? (
      <div className="mb-6 text-h4 font-semibold">Are you sure?</div>
    ) : (
      <>
        <div className={'text-sm font-semibold text-grey-500'}>MOVE</div>
        <div className="mb-6 text-h4 font-semibold">{selectedSpace?.name}</div>
      </>
    );
  };

  return (
    <>
      <div className="mb-[45px] flex max-w-[414px] flex-col">
        {renderHeader()}
        {renderHeadline()}
        <Dropdown
          inputId="locationSelect"
          options={options}
          value={destinationSpace}
          handleSelection={(items) => setDestinationSpace(items[0])}
          label="New location"
          placeholder="Choose a space"
          containerClassExtend={'py-0 mb-3'}
          classNames={{
            control: () => 'py-[7px] pl-4 cursor-pointer rounded-lg',
            menuList: () => 'overflow-x-hidden h-[200px]',
          }}
          labelClassExtend="text-sm font-medium text-grey-500"
        />
        <p className="mb-2 text-sm font-medium text-blue-suede">
          If the desired space isn&apos;t listed, you will first need to exit this action and create it.
        </p>
        <Link
          to="https://support.delos.com/hc/en-us"
          target="_blank"
          className="self-start text-sm font-medium text-blue-brilliant"
        >
          Learn more
        </Link>
      </div>

      <div className="flex w-full items-center justify-center gap-3">
        <Button
          size="medium"
          variant="secondary"
          className="w-fit min-w-[140px] px-[22px]"
          label="Cancel"
          onClick={onCancel}
        />
        <Button
          size="medium"
          variant="primary"
          className="w-fit min-w-[140px] px-[22px]"
          label="Move"
          onClick={handleSubmit}
          disabled={!destinationSpace}
        />
      </div>
    </>
  );
};

export default SelectLocation;
