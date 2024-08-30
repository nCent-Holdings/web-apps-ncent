import React, { useMemo } from 'react';
import DeviceDetailsSection from '../common/DeviceDetailsSection';
import { SensorPurifierDetailProps } from '../common/types';
import { twMerge } from 'tailwind-merge';
import { dumpGatewayModel, dumpPurifierModel, dumpSensorModel } from '@src/routes/client/device-management/dumps';
import { Button, OvalLoader } from '@ncent-holdings/ux-components';

import AirQuality from './AirQuality';
import ThermalComfort from './ThermalComfort';
import EnhancedSensing from './EnhancedSensing';
import DeviceConnectivity from '../common/DeviceConnectivity';
import DeviceName from '../common/DeviceName';
import DeviceDetail from '../common/DeviceDetail';
import DeviceStatus from '../common/DeviceStatus';
import { useGateway } from '@src/api-hooks/gateways/gatewaysApi';
import SensorPurifierAdv from '@components/DeviceDetailsModal/SensorPurifierDetails/SensorPurifierAdv';
import { Purifier, Sensor } from '@src/routes/client/device-management/types';
import deviceTooltips from '../common/DeviceTooltips';
import SpaceLocation from '../../SpaceLocation';
import DeviceLocation from '../../DeviceLocation/DeviceLocation';
import { useDeviceDetailsContext } from '@src/contexts/DeviceDetailsContext/DeviceDetailsContext';
import { useOrganizationFromHandle } from '@src/features/useOrganizationFromHandle';

import { motion } from 'framer-motion';

const FALLBACK_EMAIL = 'contact@wellcube.io';

export const SensorPurifierDetails: React.FC<SensorPurifierDetailProps> = ({ device }: SensorPurifierDetailProps) => {
  const { tsmEmail = FALLBACK_EMAIL } = useOrganizationFromHandle();
  const gatewayId = device?.['wellcube/device']?.gateway_id;

  const { gateway: deviceGateway, isLoading: loadingGateway } = useGateway(gatewayId || '', {
    skip: !gatewayId,
  });

  const deviceModel: Purifier | Sensor =
    device?.['wellcube/purifier'] != null ? dumpPurifierModel(device) : dumpSensorModel(device);

  const handleReorderFilter = () => {
    window.open('https://www.delos.com', '_blank');
  };

  const hasEnhancedSensing = useMemo(() => {
    return device['sensor/light'] != null && device['sensor/occupancy'] != null && device['sensor/noise'] != null;
  }, [device]);

  const renderFilterLife = () => {
    const { filterLifeStatus, isFilterLifeRunningOut, isFilterLifeCritical } = deviceModel as Purifier;

    return (
      <>
        <div className="flex w-full items-center">
          <div data-tooltip-id="dd-filter-life" className="flex items-center">
            <div
              className={twMerge(
                'mr-2.5 h-2 w-2 rounded-full bg-alert-ok-light transition-all',
                isFilterLifeRunningOut && 'bg-alert-issue-light',
                isFilterLifeCritical && 'bg-alert-error-light',
                filterLifeStatus === 'unknown' && 'bg-alert-error-light',
              )}
            />
            <div
              className={twMerge(
                'text-sm font-medium',
                isFilterLifeCritical && 'capitalize',
                filterLifeStatus === 'unknown' && 'capitalize',
              )}
            >
              {filterLifeStatus}
            </div>
          </div>
          {(isFilterLifeCritical || isFilterLifeRunningOut) && (
            <div className="ml-2.5 border-l border-[#D4DFEA] pl-2.5">
              <Button
                variant="ghost-primary"
                label={
                  <div className="flex items-center gap-x-1 capitalize">
                    <div>REORDER</div>
                    <i className="icon wcicon-chevron-right w-3" />
                  </div>
                }
                className="h-auto !border-none p-0 text-sm font-medium text-blue-brilliant hover:bg-transparent hover:text-blue-brilliant"
                onClick={handleReorderFilter}
              />
            </div>
          )}
        </div>
        {deviceTooltips.FilterLifeTooltip('dd-filter-life')}
      </>
    );
  };

  const renderMode = () => {
    const fanMode = (deviceModel as Purifier).fanMode;

    const mode = fanMode?.mode;

    const FAN_SPEED_INDEX: { [key: number]: string } = {
      0: 'Off',
      25: 'Low',
      50: 'Medium',
      75: 'High',
      100: 'Turbo',
    };

    if (mode === 'standby') {
      return <>Standby</>;
    } else {
      return (
        <div className="flex">
          {fanMode?.mode === 'manual' && <div>{`Manual: ${FAN_SPEED_INDEX[fanMode?.percent || 0]}`}</div>}
          {fanMode?.mode === 'auto' && <div>Auto</div>}
          <div className="mx-2 text-[#D4DFEA]">|</div>
          <div>{fanMode?.cfm} CFM</div>
        </div>
      );
    }
  };

  const deviceDetails = useDeviceDetailsContext();
  const handleNavGateway = () => {
    if (!deviceGateway) {
      return;
    }

    deviceDetails.selectDevice(deviceGateway.id);
  };

  const handleNavAdvanced = () => {
    deviceDetails.showAdvanced();
  };

  const renderGateway = () => {
    if (loadingGateway && !deviceGateway) {
      return <OvalLoader />;
    } else if (!deviceGateway) {
      return <OvalLoader />;
    }

    const gatewayModel = dumpGatewayModel(deviceGateway);

    return (
      <DeviceLocation
        location={gatewayModel.location}
        deviceName={gatewayModel.name}
        onClickDevice={handleNavGateway}
      />
    );
  };

  if (deviceDetails.isAdvanced) {
    return (
      <motion.div
        key={`${device?.id}_adv`}
        className="flex flex-1 items-center justify-center gap-x-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <SensorPurifierAdv device={device} />
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`${device?.id}_basic`}
      className="flex flex-1 gap-x-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-[300px]">
        <DeviceDetailsSection
          heading={
            <div className="flex max-h-[91px] min-h-[68px] px-6">
              <div className="mr-3 w-[171px] border-r border-[#D4DFEA] py-3 pr-3">
                <DeviceName name={deviceModel.name} model={deviceModel.model} />
              </div>
              <div className="flex flex-1 items-center justify-center py-3">
                <DeviceConnectivity status={deviceModel.connectivity} />
              </div>
            </div>
          }
          classExtend="w-full h-[658px]"
        >
          <div className="w-full flex-1 border-b border-[#D4DFEA]">
            <DeviceDetail label="Location" classExtend="pt-3">
              <SpaceLocation
                location={deviceModel.location}
                topClassExtend="font-medium text-black-light-soft mb-0.5 max-w-[252px]"
                localClassExtend="font-medium max-w-[252px]"
              />
            </DeviceDetail>
            {device?.['wellcube/device']?.asset_id && (
              <DeviceDetail label="Asset ID">{device?.['wellcube/device']?.asset_id}</DeviceDetail>
            )}
            {device?.['wellcube/device']?.serial_number && (
              <DeviceDetail label="Device serial:">{device?.['wellcube/device']?.serial_number}</DeviceDetail>
            )}
            <DeviceDetail label="Gateway:">
              <div className="text-sm font-medium">{renderGateway()}</div>
            </DeviceDetail>
            {device['wellcube/purifier'] && (
              <DeviceDetail label="Mode:">
                <div className="truncate text-sm font-medium">{renderMode()}</div>
              </DeviceDetail>
            )}
            <DeviceDetail label="Power consumption:">
              <div data-tooltip-id="dd-power-consumption" className="w-fit">
                {device?.['power/consumption']?.power?.toFixed(1) || `??`} {device?.['power/consumption']?.units || 'W'}
              </div>
            </DeviceDetail>
            {deviceTooltips.PowerConsumptionTooltip('dd-power-consumption')}
            {device['wellcube/purifier'] && (
              <DeviceDetail label="Filter life:" classExtend="px-6 pb-[50px] pt-2.5">
                {renderFilterLife()}
              </DeviceDetail>
            )}
          </div>
          <div className="flex max-h-[100px] border-b border-[#D4DFEA] py-2.5 pr-6">
            <DeviceStatus
              sensorStatus={device['sensor/status']?.statuses}
              lastReportedTimestamp={deviceModel?.lastReportedTimestamp}
              connectivity={deviceModel.connectivity}
            />
          </div>
          <div className="max-h-[42px] p-3">
            <div
              className="flex cursor-pointer items-center justify-center gap-x-1 text-blue-brilliant"
              onClick={handleNavAdvanced}
            >
              <div className="text-sm font-medium">Advanced device details</div>
              <i className="icon wcicon-chevron-right w-3" />
            </div>
          </div>
        </DeviceDetailsSection>
      </div>
      <div className="flex w-[492px] flex-col gap-y-5">
        <AirQuality device={device} />
        <ThermalComfort device={device} />
        {hasEnhancedSensing && <EnhancedSensing device={device} />}
        {!hasEnhancedSensing && (
          <DeviceDetailsSection heading="About the Air Quality Index" classExtend="w-full h-[184px] overflow-hidden">
            <div className="px-[26px] py-6 text-sm text-black-soft">
              This device does not provide an AQI score because it has no CO2 sensing capabilities available. CO2
              measurement is required for AQI calculation. If you&apos;d like to understand the AQI score for this
              space, please talk to your{' '}
              <a
                href={`mailto:${tsmEmail}?subject=Understanding%20my%20WellCube%20Air%20Device%20and%20AQI`}
                target="_blank"
                className="text-blue-brilliant underline"
                rel="noreferrer"
              >
                Technical Sales Manager
              </a>{' '}
              about outfitting this device with CO2 sensing capabilities.
            </div>
          </DeviceDetailsSection>
        )}
      </div>
    </motion.div>
  );
};

export default SensorPurifierDetails;
