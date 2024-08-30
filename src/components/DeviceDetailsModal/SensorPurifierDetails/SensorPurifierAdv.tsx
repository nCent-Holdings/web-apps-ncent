import React, { useEffect, useMemo, useState } from 'react';
import { SensorPurifierDetailProps } from '@components/DeviceDetailsModal/common/types';
import { FAN_SPEED, FanMode, FanCfm, Purifier } from '@src/routes/client/device-management/types';
import { dumpPurifierModel, dumpSensorModel } from '@src/routes/client/device-management/dumps';
import DeviceName from '@components/DeviceDetailsModal/common/DeviceName';
import DeviceConnectivity from '@components/DeviceDetailsModal/common/DeviceConnectivity';
import DeviceDetailsSection from '@components/DeviceDetailsModal/common/DeviceDetailsSection';
import SpaceLocation from '@components/SpaceLocation';
import DeviceDetail from '@components/DeviceDetailsModal/common/DeviceDetail';
import { Dropdown, Input, Toggletip, Tooltip } from '@ncent-holdings/ux-components';
import { ModeButton } from '@components/DeviceDetailsModal/SensorPurifierDetails/ModeButton';
import { twMerge } from 'tailwind-merge';

import * as purifierAPI from '../../../actions/purifiers';
import * as deviceAPI from '../../../actions/devices';

import FanSpeedButton from '@components/DeviceDetailsModal/SensorPurifierDetails/FanSpeedButton';
import DeviceSettingsToggle from '@components/DeviceDetailsModal/SensorPurifierDetails/DeviceSettingsToggle';
import { useDeviceDetailsContext } from '@src/contexts/DeviceDetailsContext/DeviceDetailsContext';
import { GatewayModel } from '@src/api-types/models';

import { useGateway, useGateways } from '@src/api-hooks/gateways/gatewaysApi';
import { SensorPurifierFirmware } from '@components/DeviceDetailsModal/SensorPurifierDetails/SensorPurifierFirmware';
import { checkFirmware, updateFirmware } from '../../../actions/devices';
import { getFirmwareList } from '@actions/lists';

export const SensorPurifierAdv: React.FC<SensorPurifierDetailProps> = ({ device }: SensorPurifierDetailProps) => {
  const gatewayId = device?.['wellcube/device']?.gateway_id || '';
  const siteId = device?.['wellcube/device']?.site_id || '';

  const { gateway: currentGateway } = useGateway(gatewayId, { skip: !gatewayId });
  const { gateways, isLoading: loadingGateways } = useGateways({ siteId }, { skip: !siteId });

  const deviceDetails = useDeviceDetailsContext();

  const deviceModel = useMemo(() => {
    if (device?.['wellcube/purifier']) {
      return dumpPurifierModel(device);
    } else {
      return dumpSensorModel(device);
    }
  }, [device]);

  const [activeMode, setActiveMode] = useState<FanMode | undefined>((deviceModel as Purifier)?.fanMode?.mode);

  const handleSetMode = (mode: FanMode) => {
    setActiveMode(mode);
    saveActiveMode(mode);
  };

  const saveActiveMode = async (newMode: FanMode) => {
    try {
      // set context saving (dispatch?)
      deviceDetails.startSave('fan_mode');
      await purifierAPI.setMode(deviceModel?.id, newMode);
      deviceDetails.finishSave('fan_mode');
    } catch (err) {
      deviceDetails.saveError('fan_mode', err);
    }
  };

  useEffect(() => {
    setActiveMode((deviceModel as Purifier)?.fanMode?.mode);
  }, [(deviceModel as Purifier)?.fanMode?.mode]);

  const [activeCfm, setFanCfm] = useState<FanCfm | undefined>((deviceModel as Purifier)?.fanMode?.cfm);

  const handleSetCfm = (cfm: FanCfm) => {
    setFanCfm(cfm);
    saveFanSpeed(cfm);
  };

  const saveFanSpeed = async (newCfm: FanCfm) => {
    try {
      deviceDetails.startSave('fan_cfm');
      await purifierAPI.changeFanSpeedCfm(deviceModel?.id, newCfm);
      deviceDetails.finishSave('fan_cfm');
    } catch (err) {
      deviceDetails.saveError('fan_cfm', err);
    }
  };

  const [iaqLight, setIaqLight] = useState(
    device?.['wellcube/sensor']?.light_iaq ?? device?.['wellcube/purifier']?.light_iaq,
  );
  useEffect(() => {
    setIaqLight(device?.['wellcube/sensor']?.light_iaq ?? device?.['wellcube/purifier']?.light_iaq);
  }, [device?.['wellcube/sensor']?.light_iaq, device?.['wellcube/purifier']?.light_iaq]);
  const handleToggleIaqLight = async () => {
    const updValue = !iaqLight;
    setIaqLight(updValue);

    if (!deviceModel?.productType) return;

    try {
      deviceDetails.startSave('iaq_light');
      await deviceAPI.updateDeviceSetting(device?.id, deviceModel?.productType, {
        name: 'light_iaq',
        value: updValue,
      });
      deviceDetails.finishSave('iaq_light');
    } catch (err) {
      deviceDetails.saveError('iaq_light', err);
    }
  };

  const [filterLight, setFilterLight] = useState(device?.['wellcube/purifier']?.light_filter);
  useEffect(() => {
    setFilterLight(device?.['wellcube/purifier']?.light_filter);
  }, [device?.['wellcube/purifier']?.light_filter]);
  const handleToggleFilterLight = async () => {
    const updValue = !filterLight;
    setFilterLight(updValue);

    if (!deviceModel?.productType) return;

    try {
      deviceDetails.startSave('filter_light');
      await deviceAPI.updateDeviceSetting(device?.id, deviceModel?.productType, {
        name: 'light_filter',
        value: updValue,
      });
      deviceDetails.finishSave('filter_light');
    } catch (err) {
      deviceDetails.saveError('filter_light', err);
    }
  };

  const [noiseSensing, setNoiseSensing] = useState(device?.['sensor/noise']?.enabled);
  useEffect(() => {
    setNoiseSensing(device?.['sensor/noise']?.enabled);
  }, [device?.['sensor/noise']?.enabled]);
  const handleToggleNoise = async () => {
    const updValue = !noiseSensing;
    setNoiseSensing(updValue);

    if (!deviceModel?.productType) return;

    try {
      deviceDetails.startSave('noise_sensing');
      await deviceAPI.updateDeviceSetting(device?.id, deviceModel?.productType, {
        name: 'noise',
        value: updValue,
      });
      deviceDetails.finishSave('noise_sensing');
    } catch (err) {
      deviceDetails.saveError('noise_sensing', err);
    }
  };

  const [allowTurbo, setAllowTurbo] = useState(device?.['wellcube/purifier']?.allow_turbo);
  useEffect(() => {
    setAllowTurbo(device?.['wellcube/purifier']?.allow_turbo);
  }, [device?.['wellcube/purifier']?.allow_turbo]);
  const handleToggleTurbo = async () => {
    const updValue = !allowTurbo;
    setAllowTurbo(updValue);

    if (!deviceModel?.productType) return;

    try {
      deviceDetails.startSave('allow_turbo');
      await deviceAPI.updateDeviceSetting(device?.id, deviceModel?.productType, {
        name: 'allow_turbo',
        value: updValue,
      });
      deviceDetails.finishSave('allow_turbo');
    } catch (err) {
      deviceDetails.saveError('allow_turbo', err);
    }
  };

  const mappedGw = (gateway: GatewayModel) => ({
    id: gateway?.id,
    value: gateway?.name,
    label: `${gateway?.['wellcube/location']?.full_path} > ${gateway?.name}`,
  });

  const defaultGw = useMemo(() => {
    return currentGateway ? mappedGw(currentGateway) : undefined;
  }, [currentGateway]);

  const saveNewGateway = async ([gwSelected]: { id: string }[]) => {
    if (!gwSelected) return;
    if (gwSelected?.id === device?.['wellcube/device']?.gateway_id) return;

    try {
      deviceDetails.startSave('gateway_id');
      await deviceAPI.updateGateway(device?.id, gwSelected?.id);
      deviceDetails.finishSave('gateway_id');
    } catch (err) {
      deviceDetails.saveError('gateway_id', err);
    }
  };

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
  const [assetIdError, setAssetIdError] = useState<boolean | string>(false);
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

  const [latestFirmware, setLatestFirmware] = useState({ HRN71: 'init', MCU: 'init' });
  const checkLatestFirmware = async () => {
    setLatestFirmware({ HRN71: 'checking', MCU: 'checking' });
    const latestPackages = await getFirmwareList();

    const HRN71 = latestPackages.find((pkg: any) => pkg?.['wellcube/firmware_package']?.type.toUpperCase() === 'HRN71');
    const MCU = latestPackages.find((pkg: any) => pkg?.['wellcube/firmware_package']?.type.toUpperCase() === 'MCU');

    setLatestFirmware({ HRN71, MCU });
  };

  const checkFirmwareUpdates = () => {
    checkFirmware(device?.id);
  };

  useEffect(() => {
    checkLatestFirmware();
    checkFirmwareUpdates();
  }, []);

  const mcuFirmware = useMemo(() => {
    const firmware = device?.['wellcube/firmware'];

    return {
      hasUpdate: firmware?.mcu_has_update,
      onUpdate: () => {
        return updateFirmware(device?.id, 'MCU');
      },
      status: firmware?.mcu_fw_status,
      lastUpdated: firmware?.mcu_fw_date,
      version: firmware?.mcu_firmware,
      onCheckLatest: checkLatestFirmware,
      latestPackage: latestFirmware?.MCU,
    };
  }, [device?.['wellcube/firmware'], latestFirmware]);

  const hrn71Firmware = useMemo(() => {
    const firmware = device?.['wellcube/firmware'];

    return {
      hasUpdate: firmware?.hrn71_has_update,
      onUpdate: () => {
        return updateFirmware(device?.id, 'HRN71');
      },
      status: firmware?.hrn71_fw_status,
      lastUpdated: firmware?.hrn71_fw_date,
      version: firmware?.hrn71_firmware,
      onCheckLatest: checkLatestFirmware,
      latestPackage: latestFirmware?.HRN71,
    };
  }, [device?.['wellcube/firmware'], latestFirmware]);

  return (
    <>
      <div className="flex h-full w-[300px] flex-1 flex-col gap-y-5">
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
          <DeviceDetail label="Gateway:">
            <div className="mt-2">
              {loadingGateways && <div>Loading gateways...</div>}
              {!loadingGateways && gateways && (
                <Dropdown
                  containerClassExtend="py-0 mb-4"
                  labelClassExtend="text-[1rem] text-grey-500 font-medium"
                  classNames={{
                    placeholder: () => 'text-[14px]',
                    container: () => 'w-full p-0',
                    singleValue: () => 'text-grey-500 font-medium',
                    menu: () => 'text-black-soft leading-[115%] tracking-[-0.0416em]',
                  }}
                  value={defaultGw}
                  options={gateways?.map((gw) => mappedGw(gw))}
                  placeholder="Select gateway"
                  handleSelection={saveNewGateway}
                  isMulti={false}
                  useSearchIcon={true}
                  highlightSearch={true}
                />
              )}
            </div>
          </DeviceDetail>
        </DeviceDetailsSection>
        <DeviceDetailsSection
          heading={
            <>
              <div className="flex w-full items-center justify-between px-6 py-3">
                <div className="text-h6">Firmware update</div>
                <div
                  className="icon icon-24 wcicon-information cursor-pointer p-[5px]"
                  data-tooltip-id="firmware-update"
                />
              </div>
              <Toggletip
                tooltipId="firmware-update"
                link={{
                  text: 'LEARN MORE',
                  href: 'https://support.delos.com/hc/en-us',
                }}
                closable={false}
                tooltipProps={{
                  place: 'top-start',
                }}
              >
                Sensors in WellCube devices periodically
                <br />
                perform an automatic recalibration for accuracy.
                <br />
                You can also recalibrate sensors on-demand
                <br />
                using the button below.
              </Toggletip>
            </>
          }
        >
          <div className="flex h-[133px] flex-col items-center justify-center">
            <SensorPurifierFirmware device={device} HRN71={hrn71Firmware} MCU={mcuFirmware} />
            {/*<SensorCalibration*/}
            {/*  canCalibrate={deviceModel?.connectivity === 'online'}*/}
            {/*  onCalibrate={handleCalibrateSensors}*/}
            {/*  calibrationStatus={device?.['wellcube/calibration']?.status || 'init'}*/}
            {/*  lastCalibratedDate={device?.['wellcube/calibration']?.last_calibrated_date}*/}
            {/*/>*/}
          </div>
        </DeviceDetailsSection>
      </div>
      <div className="flex h-full w-[492px] flex-1 flex-col gap-y-5 ">
        <DeviceDetailsSection heading="Settings">
          <div className="flex">
            <div className="flex w-[246px] flex-col gap-y-[26px] p-6">
              <DeviceSettingsToggle label="IAQ Light" toggled={iaqLight} onClick={handleToggleIaqLight} />
              {device?.['wellcube/purifier'] && (
                <DeviceSettingsToggle label="Turbo speed" toggled={allowTurbo} onClick={handleToggleTurbo} />
              )}
            </div>
            <div className="flex w-[246px] flex-col gap-y-[26px] p-6">
              {device?.['wellcube/purifier'] && (
                <DeviceSettingsToggle label="Filter light" toggled={filterLight} onClick={handleToggleFilterLight} />
              )}
              {device?.['sensor/noise'] && (
                <DeviceSettingsToggle label="Noise sensing" toggled={noiseSensing} onClick={handleToggleNoise} />
              )}
            </div>
          </div>
        </DeviceDetailsSection>
        {device?.['wellcube/purifier'] != null && (
          <DeviceDetailsSection heading="Mode">
            <div className="flex justify-between p-6">
              <ModeButton mode="standby" isActive={activeMode === 'standby'} onClick={handleSetMode} />
              <ModeButton mode="auto" isActive={activeMode === 'auto'} onClick={handleSetMode} />
              <ModeButton mode="manual" isActive={activeMode === 'manual'} onClick={handleSetMode} />
            </div>
            <div
              className={twMerge(
                'pointer-events-none h-0 max-h-[54px] overflow-hidden border-t border-card-stroke px-6',
                'transition-all',
                activeMode === 'manual' && 'pointer-events-auto h-auto py-4',
              )}
            >
              <div className="flex justify-between px-[26px]">
                <FanSpeedButton speed={FAN_SPEED.LOW} isActive={activeCfm === FAN_SPEED.LOW} onClick={handleSetCfm} />
                <FanSpeedButton
                  speed={FAN_SPEED.MEDIUM}
                  isActive={activeCfm === FAN_SPEED.MEDIUM}
                  onClick={handleSetCfm}
                />
                <FanSpeedButton speed={FAN_SPEED.HIGH} isActive={activeCfm === FAN_SPEED.HIGH} onClick={handleSetCfm} />
                <FanSpeedButton
                  speed={FAN_SPEED.TURBO}
                  isActive={activeCfm === FAN_SPEED.TURBO}
                  onClick={handleSetCfm}
                  disabled={!device?.['wellcube/purifier']?.allow_turbo}
                />
              </div>
            </div>
          </DeviceDetailsSection>
        )}
        <DeviceDetailsSection
          heading="Device properties"
          classExtend={twMerge('flex-1 max-h-[339px] min-h-[200px]', device?.['wellcube/sensor'] && 'max-h-[539px]')}
        >
          <div className="flex flex-1 p-6">
            <div
              className={twMerge(
                'flex flex-1 flex-col',
                device?.['wellcube/purifier'] && 'justify-between',
                device?.['wellcube/sensor'] && 'gap-y-4',
              )}
            >
              <DeviceDetail label="Device Model #" classExtend="px-0 pt-0 pb-0.5">
                {device?.['wellcube/device']?.model_number}
              </DeviceDetail>
              <DeviceDetail label="MCU Firmware version" classExtend="px-0 py-0.5">
                {device?.['wellcube/device']?.mcu_status === 'offline'
                  ? 'MCU Offline'
                  : device?.['wellcube/firmware']?.mcu_firmware}
              </DeviceDetail>
              <DeviceDetail label="Wireless Firmware version" classExtend="px-0 py-0.5">
                {device?.['wellcube/firmware']?.hrn71_firmware}
              </DeviceDetail>
            </div>
            <div
              className={twMerge(
                'flex flex-1 flex-col',
                device?.['wellcube/purifier'] && 'justify-between',
                device?.['wellcube/sensor'] && 'gap-y-4',
              )}
            >
              <DeviceDetail label="Device Serial #" classExtend="px-0 pt-0 py-0.5">
                {device?.['wellcube/device']?.serial_number}
              </DeviceDetail>
              <DeviceDetail label="Thread Network ID" classExtend="px-0 pb-0 py-0.5">
                {device?.['wellcube/device']?.thread_network_id.toUpperCase()}
              </DeviceDetail>
            </div>
          </div>
        </DeviceDetailsSection>
      </div>
    </>
  );
};

export default SensorPurifierAdv;
