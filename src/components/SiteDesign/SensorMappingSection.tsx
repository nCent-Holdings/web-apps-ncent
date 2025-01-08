import React, { useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Dropdown, ToggleSwitch, Hint, Toggletip } from '@ncent-holdings/ux-components';
import { useDevices } from '@src/api-hooks/devices/devicesApi';
import { getDevicesNounFromSpacesIds } from './utils';
import { Link } from 'react-router-dom';
import IconInfo from '../icons/IconInfo';

type SensorDeviceData = {
  id: string;
  name: string;
  fullPath: string;
  local: boolean;
  enabled: boolean;
};

type SensorMappingSectionProps = {
  internalDevices: SensorDeviceData[];
  externalDevices: SensorDeviceData[];

  title: string;
  pollutant: string;
  openSpacesNearbyIds: Array<string>;

  onSensorAdd: (pollutant: string, id: string) => void;
  onSensorUpdate: (pollutant: string, id: string, value: boolean) => void;
  onSensorRemove: (pollutant: string, id: string) => void;
};

export const SensorMappingSection = ({
  internalDevices,
  externalDevices,
  title,
  pollutant,
  onSensorAdd,
  onSensorUpdate,
  onSensorRemove,
  openSpacesNearbyIds,
}: SensorMappingSectionProps) => {
  const [openAddDropdown, setOpenAddDropdown] = useState(false);

  const devicesNoun = getDevicesNounFromSpacesIds(openSpacesNearbyIds);

  const { devices: openSpacesDevices } = useDevices(
    { searchNoun: `${pollutant}.(${devicesNoun})` },
    { skip: !openSpacesNearbyIds.length || !openAddDropdown },
  );

  const optionStyle =
    'overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; word-break: break-all;';

  const options = useMemo(
    () =>
      openSpacesDevices
        .filter((device) => !externalDevices.find((d) => d.id === device.id))
        .map((device) => ({
          id: device.id,
          value: device.id,
          label: `<span style="${optionStyle}">${device['wellcube/location']?.full_path} > ${device.name}</span>`,
        })),
    [openSpacesDevices, externalDevices],
  );

  const renderAddSensor = () => {
    return (
      <>
        <div
          className={twMerge(
            'flex w-fit cursor-pointer select-none items-center gap-2 px-5 py-4 text-blue-web',
            openAddDropdown && 'hidden',
          )}
          onClick={() => setOpenAddDropdown(true)}
        >
          <div className="flex h-[1.1875rem] w-[1.1875rem] items-center justify-center rounded-[.25rem] bg-[#494D56] text-[12px] text-white">
            <i className="icon wcicon-plus" />
          </div>
          <div className="ml-1 whitespace-nowrap text-[.875rem] leading-[1.25] tracking-[-0.01em] text-[#272B32]">
            Add a sensor
          </div>
        </div>
        {!!openAddDropdown && (
          <div
            onClick={(e: any) => {
              // It is required to don't shrink right panel, when user clicks at a dropdown option
              e.target.setAttribute('data-keep-right-panel', 'true');
            }}
            className="px-5 py-4"
          >
            <Dropdown
              label="Add a sensor"
              options={options}
              placeholder="Select a sensor"
              handleSelection={async (options) => {
                if (options[0]) {
                  await onSensorAdd(pollutant, options[0].id);
                  setOpenAddDropdown(false);
                }
              }}
              isMulti={false}
            />
          </div>
        )}
      </>
    );
  };

  const renderSensorToggle = (device: SensorDeviceData) => {
    return (
      <div className="flex items-center gap-2 px-5 py-1.5 text-[.875rem] leading-[1.5]  [&:last-of-type]:border-b  [&:last-of-type]:border-b-[#D4DFEA]  [&:last-of-type]:pb-[1rem] [&:nth-of-type(2)]:pt-[1rem]">
        <ToggleSwitch
          checked={device.enabled}
          onToggleChange={() => onSensorUpdate(pollutant, device.id, !device.enabled)}
        />

        <Hint
          delay={3000}
          text={<span className="break-all">{`${device.fullPath} > ${device.name}`}</span>}
          placement="top"
        >
          <span className="line-clamp-2 break-all">
            {`... > ${device.name}`}
            {!device.local && <span className="font-bold text-blue-brilliant"> *</span>}
          </span>
        </Hint>

        {!device.local && (
          <div
            className="ml-auto flex h-full w-5 cursor-pointer hover:text-blue-brilliant"
            onClick={() => onSensorRemove(pollutant, device.id)}
          >
            <i className="icon wcicon-trash" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-16">
      <div className="flex items-center justify-between border-b border-b-[#D4DFEA] bg-[#F9FCFF] px-5 py-3 shadow-[0_-1px_0_#D4DFEA]">
        <div className="whitespace-nowrap font-semibold text-[#272B32] ">{title}</div>
        <Toggletip
          tooltipId={title}
          tooltipProps={{ place: 'top-start', positionStrategy: 'fixed' }}
          closable={false}
          className="ml-[1px]"
        >
          <div className="flex h-full flex-col">
            <div className="mb-3 self-start">
              {`Map ${title} sensor readings to this space for more sensor coverage.`}
            </div>
            <div className="mt-auto self-start pt-2">
              <Link
                className="flex basis-[265px] text-chart-blue underline"
                target="_blank"
                to="https://www.delos.com"
                rel="noopener noreferrer"
              >
                LEARN MORE
              </Link>
            </div>
          </div>
        </Toggletip>
        <IconInfo data-tooltip-id={title} className="fill-[#427596]" />
      </div>
      {!!openSpacesNearbyIds.length && renderAddSensor()}

      {internalDevices.map(renderSensorToggle)}
      {externalDevices.map(renderSensorToggle)}
    </div>
  );
};
