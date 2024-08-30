import { Dropdown, Field, Input } from '@ncent-holdings/ux-components';
import React, { useEffect, useRef, useState } from 'react';
import * as deviceCoreAPI from '../../../../../actions/devices';

import { useDebounce } from '@src/hooks/useDebounce';
import { DeviceModel, GatewayModel } from '@src/api-types/models';
import { useGateway, useGateways } from '@src/api-hooks/gateways/gatewaysApi';

import CollapseSection from '../../../../../components/CollapseSection/CollapseSection';
import SpaceLocation from '../../../../../components/SpaceLocation/SpaceLocation';
import BadgeStatus from '../../../../../components/BadgeStatus/BadgeStatus';
import { Status, UpdateStatus } from '@components/BadgeStatus/types';
import { getLongName, advTitleCase } from '@src/utils';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';

interface DeviceProfileProps {
  device?: DeviceModel;
  updateStatus: string;
  handleUpdateStatus: (status: Status | '') => void;
}

type Option = {
  id: string;
  value: string;
  label?: string;
};

export const DeviceProfile = ({ device, updateStatus, handleUpdateStatus }: DeviceProfileProps) => {
  const [isInitData, setIsInitData] = useState(true);

  const deviceInfo = device?.['wellcube/device'];
  const deviceLocation = device?.['wellcube/location'];
  const spaceId = deviceInfo?.space_id;

  const { gateway: currentGw } = useGateway(deviceInfo?.gateway_id || '', {
    skip: !deviceInfo?.gateway_id,
  });
  const [defaultGw, setDefaultGw] = useState<Option | undefined>(undefined);
  const [deviceName, setDeviceName] = useState('');
  const [assetId, setAssetId] = useState('');
  const debouncedDeviceName = useDebounce(deviceName, 1000);
  const debouncedAssetId = useDebounce(assetId, 1000);
  const [invalidDeviceName, setInvalidDeviceName] = useState('');
  const [invalidAssetId, setInvalidAssetId] = useState('');
  const { siteId: selectedSiteId } = useSiteFromHandleOrLastStored();
  const { gateways } = useGateways({ siteId: selectedSiteId }, { skip: !selectedSiteId });
  const inputRef = useRef<{ [key: string]: HTMLInputElement }>({});

  useEffect(() => {
    if (device) {
      setInvalidDeviceName('');
      setInvalidAssetId('');
      setDeviceName(device?.name);
      setAssetId(deviceInfo?.asset_id || '');

      if (isInitData) {
        setIsInitData(false);
      }
    }
  }, [device]);

  useEffect(() => {
    if (currentGw) {
      setDefaultGw(mappedGw(currentGw));
    } else {
      setDefaultGw(undefined);
    }
  }, [currentGw]);

  useEffect(() => {
    const timeId = setTimeout(() => {
      handleUpdateStatus('');
    }, 3000);

    const validateAndProcessDeviceName = async () => {
      if (debouncedDeviceName === device?.name) {
        setInvalidDeviceName('');
        return;
      }

      if (!spaceId) return;

      if (debouncedDeviceName != null && device && !isInitData) {
        const validationResult = await checkDeviceName(debouncedDeviceName, spaceId);

        if (!validationResult || !validationResult.isValid) return;

        updateDeviceAPI(device?.id, debouncedDeviceName);
      }
    };

    validateAndProcessDeviceName();

    return () => {
      clearTimeout(timeId);
    };
  }, [debouncedDeviceName]);

  useEffect(() => {
    const timeId = setTimeout(() => {
      handleUpdateStatus('');
    }, 3000);

    const validateAndProcessAssetId = async () => {
      if (debouncedAssetId === deviceInfo?.asset_id) {
        setInvalidAssetId('');
        return;
      }

      if (!selectedSiteId) return;

      if (debouncedDeviceName != null && device && !isInitData) {
        const validationResult = await checkAssetId(debouncedAssetId, selectedSiteId);

        if (!validationResult || !validationResult.isValid) return;

        updateAssetIdAPI(device?.id, debouncedAssetId);
      }
    };

    validateAndProcessAssetId();

    return () => {
      clearTimeout(timeId);
    };
  }, [debouncedAssetId]);

  const checkDeviceName = async (newDeviceName: string, spaceId: string) => {
    const validationResult = await deviceCoreAPI.validateDeviceName(spaceId, newDeviceName);

    if (!validationResult.isValid) {
      let valMessage = validationResult.message || 'You have specified an invalid device name.';

      if (valMessage.startsWith('a device named ')) {
        valMessage = `${advTitleCase(deviceInfo?.model || '')} names must be unique within a space.`;
      }

      setInvalidDeviceName(valMessage);
      handleUpdateStatus(UpdateStatus.ERROR);
    } else if (validationResult.isValid) {
      setInvalidDeviceName('');
    }

    return validationResult;
  };

  const checkAssetId = async (newAssetId: string, siteId: string) => {
    if (!newAssetId) return;
    const validationResult = await deviceCoreAPI.validateAssetId(siteId, newAssetId);

    if (!validationResult.isValid) {
      // assetId is invalid
      const valMessage = validationResult.message || 'You have specified an invalid assetId .';

      setInvalidAssetId(valMessage);
      handleUpdateStatus(UpdateStatus.ERROR);
    } else if (validationResult.isValid) {
      setInvalidAssetId('');
    }

    return validationResult;
  };

  const updateDeviceAPI = async (deviceId: string, debouncedDeviceName: string) => {
    handleUpdateStatus('Saving');
    try {
      const deviceUpdated = await deviceCoreAPI.updateDeviceName(deviceId, debouncedDeviceName);

      setDeviceName(deviceUpdated.name);
      handleUpdateStatus('Saved');
    } catch (e) {
      handleUpdateStatus('Error');
    }
  };

  const updateAssetIdAPI = async (deviceId: string, debouncedAssetId: string) => {
    handleUpdateStatus('Saving');
    try {
      const deviceUpdated = await deviceCoreAPI.updateAssetId(deviceId, debouncedAssetId);

      const deviceInfo = deviceUpdated['wellcube/device'];
      setAssetId(deviceInfo?.asset_id || '');
      handleUpdateStatus('Saved');
    } catch (e) {
      handleUpdateStatus('Error');
    }
  };

  const onGatewaySelect = async ([gwSelected]: Option[]) => {
    if (!device || !gwSelected) return;

    handleUpdateStatus('Saving');

    try {
      await deviceCoreAPI.updateGateway(device.id, gwSelected.id);

      handleUpdateStatus('Saved');
    } catch (e) {
      handleUpdateStatus('Error');
    }
  };

  const updateDeviceName = (evt: React.SyntheticEvent) => {
    if (!device) return;

    const { value: newDeviceName } = evt.target as HTMLInputElement;
    setDeviceName(newDeviceName);
  };

  const handleKeyDown = async (
    evt: React.KeyboardEvent<HTMLInputElement>,
    name: string,
    setFn: (val: string) => void,
  ) => {
    if (evt.key === 'Enter') {
      const { value: updVal } = evt.target as HTMLInputElement;
      setFn(updVal);

      if (name === 'name' && device?.id) {
        updateDeviceAPI(device?.id, updVal);
      } else if (name === 'assetID' && device?.id) {
        updateAssetIdAPI(device?.id, updVal);
      }

      inputRef.current[name].blur();
    }
  };

  const updateAssetId = (evt: React.SyntheticEvent) => {
    if (!device) return;

    const { value: newAssetId } = evt.target as HTMLInputElement;
    setAssetId(newAssetId);
  };

  const mappedGw = (gateway: GatewayModel): Option => {
    return {
      id: gateway?.id,
      value: gateway?.name,
      label: `${gateway?.['wellcube/location']?.full_path} > ${gateway?.name}`,
    };
  };

  return (
    <div>
      <div className="sticky top-0 z-[1] min-h-[var(--titleonscroll-height)] bg-white px-5 py-3 shadow-[0_1px_0_#D4DFE9]">
        <div className="flex min-h-[1.5rem] items-center text-sm font-medium text-blue-suede">
          {getLongName(deviceInfo?.model || '')}
          {updateStatus && <BadgeStatus status={updateStatus as Status} />}
        </div>
        <div className="text-h4 font-semibold">{device?.name}</div>
      </div>
      <CollapseSection sectionName="Profile">
        <div className="flex flex-col justify-between bg-[#F8FCFF] px-5 py-2">
          <div className="text-[12px] font-medium text-blue-suede">LOCATION</div>
          <div className="h-1" />
          {deviceLocation && <SpaceLocation location={deviceLocation} classExtend="text-[.875rem] text-grey-500" />}
        </div>
        <div className="flex flex-col gap-y-6 px-5 py-6">
          <Field htmlFor="name" label="Device name" errorMsg={invalidDeviceName}>
            <Input
              type="text"
              id="name"
              name="Device name"
              value={deviceName}
              inputRef={(elem: HTMLInputElement) => (inputRef.current['name'] = elem)}
              onChange={updateDeviceName}
              onKeyDown={(evt) => handleKeyDown(evt, 'name', setDeviceName)}
              hasError={invalidDeviceName !== ''}
            />
          </Field>
          <Field
            htmlFor="assetID"
            label="Asset ID"
            labelExtension="(Optional)"
            labelExtensionClass="ml-1"
            errorMsg={invalidAssetId}
          >
            <Input
              id="assetID"
              type="text"
              placeholder="Asset ID name"
              inputRef={(elem: HTMLInputElement) => (inputRef.current['assetID'] = elem)}
              value={assetId}
              name="assetID"
              onChange={updateAssetId}
              onKeyDown={(evt) => handleKeyDown(evt, 'assetID', setAssetId)}
              hasError={invalidAssetId !== ''}
            />
          </Field>
          {gateways && deviceInfo?.model !== 'gateway' && (
            <Dropdown
              label="Assigned gateway"
              classNames={{
                placeholder: () => 'text-[14px]',
                container: () => 'w-full p-0',
                singleValue: () => 'text-grey-500 font-medium',
                menu: () => 'text-black-soft leading-[115%] tracking-[-0.0416em]',
              }}
              value={defaultGw}
              options={gateways?.map((gw) => mappedGw(gw))}
              placeholder="Select gateway"
              handleSelection={onGatewaySelect}
              isMulti={false}
              useSearchIcon={true}
              highlightSearch={true}
            />
          )}
        </div>
      </CollapseSection>
    </div>
  );
};

export default DeviceProfile;
