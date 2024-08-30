import React, { useEffect, useState } from 'react';
import { GatewayModel } from '@src/api-types/models';
import DeviceName from '@components/DeviceDetailsModal/common/DeviceName';
import DeviceConnectivity from '@components/DeviceDetailsModal/common/DeviceConnectivity';
import DeviceDetailsSection from '@components/DeviceDetailsModal/common/DeviceDetailsSection';
import { dumpGatewayModel } from '@src/routes/client/device-management/dumps';
import DeviceDetail from '@components/DeviceDetailsModal/common/DeviceDetail';
import SpaceLocation from '@components/SpaceLocation';
import { Input, Tooltip } from '@ncent-holdings/ux-components';
import * as deviceAPI from '@actions/devices';
import { useDeviceDetailsContext } from '@src/contexts/DeviceDetailsContext/DeviceDetailsContext';
import { twMerge } from 'tailwind-merge';

export const GatewayAdv = ({ device }: { device: GatewayModel }) => {
  const deviceModel = dumpGatewayModel(device);
  const deviceDetails = useDeviceDetailsContext();

  const [deviceName, setDeviceName] = useState(device?.name);
  const [deviceNameError, setDeviceNameError] = useState<string | boolean>(false);
  const [deviceNameTimeout, setDeviceNameTimeout] = useState<string | number | NodeJS.Timeout | undefined>('');

  useEffect(() => {
    setDeviceName(device?.name);
  }, [device?.name]);

  const onChangeDeviceName = (evt: React.SyntheticEvent) => {
    const { value: newDeviceName } = evt.target as HTMLInputElement;

    setDeviceName(newDeviceName);
    setDeviceNameError(false);
  };

  const saveDeviceName = async (newName: string) => {
    setDeviceNameError(false);
    clearTimeout(deviceNameTimeout);

    if (newName === device?.name) {
      console.warn('Device name was not changed: ', {
        newName,
        dvc: device?.name,
      });
      return;
    }

    const validationResult = await deviceAPI.validateDeviceName(
      device?.['wellcube/device']?.space_id as string,
      newName,
    );
    if (!validationResult.isValid) {
      setDeviceNameError(validationResult.message || 'You have specified an invalid device name.');
      return;
    }

    try {
      deviceDetails.startSave('device_name');
      await deviceAPI.updateDeviceName(device?.id, newName);
      deviceDetails.finishSave('device_name');
    } catch (err) {
      deviceDetails.saveError('device_name', err);
      setDeviceNameError(true);
    }
  };

  const handleBlurDeviceName = async (evt: React.SyntheticEvent) => {
    saveDeviceName(deviceName);

    const inputId = (evt.target as HTMLInputElement)?.id;
    setShowError({ ...showError, [inputId]: false });
  };

  const handleKeyDownName = async (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter') {
      saveDeviceName(deviceName);
    }
  };

  useEffect(() => {
    const saveDebounceFn = setTimeout(() => {
      saveDeviceName(deviceName);
    }, 2000);

    setDeviceNameTimeout(saveDebounceFn);

    return () => clearTimeout(saveDebounceFn);
  }, [deviceName]);

  const [assetId, setAssetId] = useState(device?.['wellcube/device']?.asset_id || '');
  const [assetIdError, setAssetIdError] = useState<string | boolean>(false);
  const [assetIdTimeout, setAssetIdTimeout] = useState<string | number | NodeJS.Timeout | undefined>('');

  useEffect(() => {
    setAssetId(device?.['wellcube/device']?.asset_id || '');
  }, [device?.['wellcube/device']?.asset_id]);
  const onChangeAssetId = (evt: React.SyntheticEvent) => {
    const { value: newAssetId } = evt.target as HTMLInputElement;

    setAssetId(newAssetId);
    setAssetIdError(false);
  };
  const saveAssetId = async (newAssetId: string) => {
    setAssetIdError(false);
    clearTimeout(assetIdTimeout);

    if (newAssetId === device?.['wellcube/device']?.asset_id) {
      console.warn('Asset ID was not changed: ', {
        newAssetId,
        dvc: device?.['wellcube/device']?.asset_id,
      });
      return;
    }

    const validationResult = await deviceAPI.validateAssetId(
      device?.['wellcube/device']?.site_id as string,
      newAssetId,
    );
    if (!validationResult.isValid) {
      setAssetIdError(validationResult.message || 'You have specified an invalid Asset ID');
      return;
    }

    try {
      deviceDetails.startSave('asset_id');
      await deviceAPI.updateAssetId(device?.id, newAssetId);
      deviceDetails.finishSave('asset_id');
    } catch (err) {
      deviceDetails.saveError('asset_id', err);
    }
  };

  const handleBlurAssetId = async (evt: React.SyntheticEvent) => {
    const inputId = (evt.target as HTMLInputElement)?.id;

    setShowError({ ...showError, [inputId]: false });
    saveAssetId(assetId);
  };

  const handleKeyDownAssetId = async (evt: React.KeyboardEvent) => {
    if (evt?.key === 'Enter') {
      saveAssetId(assetId);
    }
  };

  useEffect(() => {
    const saveDebounceFn = setTimeout(() => {
      saveAssetId(assetId);
    }, 2000);

    setAssetIdTimeout(saveDebounceFn);

    return () => clearTimeout(saveDebounceFn);
  }, [assetId]);

  const [showError, setShowError] = useState<{ [key: string]: boolean }>({});
  const handleShowError = (evt: React.SyntheticEvent) => {
    const inputId = (evt.target as HTMLInputElement)?.id;
    setShowError({ ...showError, [inputId]: true });
  };

  return (
    <>
      <div className="flex h-full max-w-[300px] flex-1 flex-col">
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
          <DeviceDetail label="Location" classExtend="pt-3">
            <SpaceLocation
              location={deviceModel.location}
              topClassExtend="font-medium text-black-light-soft mb-0.5 max-w-[252px]"
              localClassExtend="font-medium max-w-[252px]"
            />
          </DeviceDetail>
          <DeviceDetail label="Device name:">
            <Tooltip
              tooltipId="device_name_error"
              tooltipProps={{
                isOpen: (!!deviceNameError && showError?.['device_name']) || false,
                style: { backgroundColor: '#DC4201' },
                arrowColor: '#DC4201',
                place: 'right',
              }}
              singleLine
            >
              {deviceNameError}
            </Tooltip>
            <div className="mt-2" data-tooltip-id="device_name_error">
              <Input
                type="string"
                id="device_name"
                onChange={onChangeDeviceName}
                value={deviceName}
                onBlur={handleBlurDeviceName}
                hasError={!!deviceNameError}
                onKeyDown={handleKeyDownName}
                onFocus={handleShowError}
              />
            </div>
          </DeviceDetail>
          <DeviceDetail label="Asset ID (optional):">
            <div className="mt-2" data-tooltip-id="asset_id_error">
              <Tooltip
                tooltipId="asset_id_error"
                tooltipProps={{
                  isOpen: (!!assetIdError && showError?.['asset_id']) || false,
                  style: { backgroundColor: '#DC4201' },
                  arrowColor: '#DC4201',
                  place: 'right',
                }}
                singleLine
              >
                {assetIdError}
              </Tooltip>
              <Input
                type="string"
                id="asset_id"
                onChange={onChangeAssetId}
                value={assetId}
                onBlur={handleBlurAssetId}
                hasError={!!assetIdError}
                onKeyDown={handleKeyDownAssetId}
                onFocus={handleShowError}
                placeholder="Asset ID"
              />
            </div>
          </DeviceDetail>
        </DeviceDetailsSection>
      </div>
      <div className="flex h-full max-w-[492px] flex-1 flex-col gap-y-5">
        <DeviceDetailsSection heading="Device properties" classExtend={twMerge('flex-1')}>
          <div className="flex flex-1 p-6">
            <div className="flex flex-1 flex-col gap-y-4">
              <DeviceDetail label="Device Model #" classExtend="px-0 pt-0 pb-0.5">
                {device?.['wellcube/device']?.model_number}
              </DeviceDetail>
              <DeviceDetail label="Network ID" classExtend="px-0 py-0.5">
                {device?.['wellcube/device']?.network_id}
              </DeviceDetail>
              <DeviceDetail label="Device Firmware version(s)" classExtend="px-0 py-0.5">
                {device?.['wellcube/device']?.firmware_version}
              </DeviceDetail>
            </div>
            <div className="flex flex-1 flex-col gap-y-4">
              <DeviceDetail label="Device Serial #" classExtend="px-0 pt-0 py-0.5">
                {device?.['wellcube/device']?.serial_number}
              </DeviceDetail>
              <DeviceDetail label="Thread Network ID" classExtend="px-0 pb-0 py-0.5">
                {device?.['wellcube/device']?.thread_network_id}
              </DeviceDetail>
            </div>
          </div>
        </DeviceDetailsSection>
      </div>
    </>
  );
};

export default GatewayAdv;
