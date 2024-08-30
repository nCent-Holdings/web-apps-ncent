import React from 'react';

import { dumpGatewayModel } from '../../../routes/client/device-management/dumps';
import { GatewayDetailProps } from '../common/types';
import DeviceDetailsSection from '../common/DeviceDetailsSection';
import DeviceName from '../common/DeviceName';
import DeviceConnectivity from '../common/DeviceConnectivity';
import DeviceDetail from '../common/DeviceDetail';

import dayjs from 'dayjs';
import { FULL_DATE_FORMAT } from '../common/constants';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import GatewayDevices from './GatewayDevices';
import SpaceLocation from '../../SpaceLocation';
import { useDeviceDetailsContext } from '@src/contexts/DeviceDetailsContext/DeviceDetailsContext';

import { motion } from 'framer-motion';
import GatewayAdv from '@components/DeviceDetailsModal/GatewayDetails/GatewayAdv';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

dayjs.extend(utc);
dayjs.extend(timezone);

export const GatewayDetails: React.FC<GatewayDetailProps> = ({ device }: GatewayDetailProps) => {
  const deviceDetails = useDeviceDetailsContext();

  const { siteTz } = useSiteFromHandleOrLastStored();
  const deviceModel = dumpGatewayModel(device);
  const lrDay = dayjs.unix(deviceModel.lastReportedTimestamp || 0).tz(siteTz);

  const handleNavAdvanced = () => {
    deviceDetails.showAdvanced();
  };

  const renderDeviceSummary = () => {
    const totalDevices = deviceModel.associatedDevices.total;
    const offlineSensors = deviceModel.associatedSensors.offline;
    const offlinePurifiers = deviceModel.associatedPurifiers.offline;
    const unCommDevices = deviceModel.associatedDevices.uncommissioned;

    return (
      <table className="border-collapse border-none text-sm font-medium text-black-soft">
        <tbody>
          <tr className="pb-1.5 font-semibold">
            <td className="min-w-[25px]">{totalDevices}</td>
            <td className="pl-1.5">Total devices</td>
          </tr>
          {offlineSensors > 0 && (
            <tr className="pb-1.5">
              <td>{offlineSensors}</td>
              <td className="flex items-center pl-1.5">
                <div>Sensors</div>
                <div className="ml-2.5 mr-1.5 h-1.5 w-1.5 rounded-full bg-alert-error-light" />
                <div>Offline</div>
              </td>
            </tr>
          )}
          {offlinePurifiers > 0 && (
            <tr className="pb-1.5">
              <td>{offlinePurifiers}</td>
              <td className="flex items-center pl-1.5">
                <div>Purifiers</div>
                <div className="ml-2.5 mr-1.5 h-1.5 w-1.5 rounded-full bg-alert-error-light" />
                <div>Offline</div>
              </td>
            </tr>
          )}
          {unCommDevices > 0 && (
            <tr>
              <td>{unCommDevices}</td>
              <td className="pl-1.5">Uncommissioned</td>
            </tr>
          )}
        </tbody>
      </table>
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
        <GatewayAdv device={device} />
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
          classExtend="w-full h-full"
        >
          <div className="w-full flex-1 border-b border-[#D4DFEA]">
            <DeviceDetail label="Last report" classExtend="pt-3">
              {lrDay.format(FULL_DATE_FORMAT)}
            </DeviceDetail>
            <DeviceDetail label="Location">
              <SpaceLocation
                location={deviceModel.location}
                topClassExtend="font-medium text-black-light-soft mb-0.5 max-w-[252px]"
                localClassExtend="font-medium max-w-[252px]"
              />
            </DeviceDetail>
            {deviceModel.assetId && <DeviceDetail label="Asset ID">{deviceModel.assetId}</DeviceDetail>}
            {deviceModel.serialNumber && <DeviceDetail label="Device serial">{deviceModel.serialNumber}</DeviceDetail>}
            <DeviceDetail label="Devices">{renderDeviceSummary()}</DeviceDetail>
            <DeviceDetail label="IP Address">{deviceModel.ipAddress || '--'}</DeviceDetail>
          </div>
          <div className="max-h[42px] p-3">
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
      <div className="flex flex-1">
        <DeviceDetailsSection
          heading={
            <div className="flex max-h-[66px] flex-col justify-center px-6 py-3 text-bdy">
              <div className="mb-1">Devices</div>
              {deviceModel.connectivity === 'offline' && (
                <div className="text-mini text-alert-error-light">
                  All associated devices are unable to communicate with this gateway
                </div>
              )}
            </div>
          }
          classExtend="flex flex-col flex-1"
        >
          <GatewayDevices gateway={device} />
        </DeviceDetailsSection>
      </div>
    </motion.div>
  );
};

export default GatewayDetails;
