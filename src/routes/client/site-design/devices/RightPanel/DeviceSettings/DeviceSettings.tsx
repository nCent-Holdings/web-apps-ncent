import React, { useEffect, useState } from 'react';
import CollapseSection from '../../../../../../components/CollapseSection/CollapseSection';
import { ToggleSwitch, Tooltip } from '@ncent-holdings/ux-components';
import { Models, ToggleLabel, ToggleOnChange, ToggleState } from './types';
import { apiPropsMap, baseModelsMap, generateSettingsConfig } from './settingsConfig';
import { DeviceModel } from '../../../../../../api-types/models';
import { twMerge } from 'tailwind-merge';
import * as deviceCoreAPI from '../../../../../../actions/devices';
import { getKeyByValue } from '../../../../../../utils/objectUtils';

import { Status } from '../../../../../../components/BadgeStatus/types';

interface DeviceSettingsProps {
  device?: DeviceModel;
  handleUpdateStatus: (status: Status | '') => void;
}

const DeviceSettings = ({ device, handleUpdateStatus }: DeviceSettingsProps) => {
  const [toggleStates, setToggleStates] = useState<ToggleState>({
    'IAQ light': false,
    'Noise sensing': false,
    'Turbo speed': false,
    'Filter light': false,
  });

  const deviceInfo = device?.['wellcube/device'];

  const handleToggle: ToggleOnChange = async (label) => {
    try {
      handleUpdateStatus('Saving');

      await updateAPIDeviceSetting(label);

      handleUpdateStatus('Saved');
    } catch (e) {
      handleUpdateStatus('Error');
      console.error('error update device setting:', e);
    }
  };

  useEffect(() => {
    if (!deviceInfo) return;
    if (!deviceInfo?.model) return;

    const model = deviceInfo?.model as Models;
    const baseModel = baseModelsMap[model];
    const index = `wellcube/${baseModel}`;
    const deviceSettings = (device as any)[index] as any;

    if (!deviceSettings) {
      console.warn(`No device settings data found for: ${index} in deviceId: ${device.id}`);
      return;
    }

    const updateState: ToggleState = { ...toggleStates };

    Object.keys(deviceSettings).forEach((key) => {
      if (apiPropsMap[key]) {
        const keySetting = apiPropsMap[key];
        updateState[keySetting] = deviceSettings[key];
      }
    });

    //Check extra settings for sensor data
    //If new extra setting need to be updated, add in extraSettings array
    const extraSettings = ['noise'];
    extraSettings.forEach((setting) => {
      const sensorKey = `sensor/${setting}`;
      const sensorValue = device[sensorKey as keyof DeviceModel];
      const keySetting = apiPropsMap[setting];

      updateState[keySetting] = (sensorValue as { enabled?: boolean })?.enabled || false;
    });

    setToggleStates({
      ...updateState,
    });
  }, [device]);

  const updateAPIDeviceSetting = async (label: ToggleLabel) => {
    if (!device) return;
    const settingName = getKeyByValue(label, apiPropsMap);

    if (!settingName) {
      console.warn(`No mapping found for this setting:`, label);
      return;
    }

    const model = deviceInfo?.model as Models;
    const baseModel = baseModelsMap[model];

    const toggleState = toggleStates as Record<string, boolean>;

    return await deviceCoreAPI.updateDeviceSetting(device?.id, baseModel, {
      name: settingName,
      value: !toggleState[label],
    });
  };

  const model = deviceInfo && (deviceInfo.model as Models);
  const modelSettings = model && generateSettingsConfig()[model];

  return (
    <>
      {model && (modelSettings || []).length > 0 && (
        <>
          <CollapseSection sectionName="Settings">
            <div className="mt-4 px-5">
              {modelSettings?.map((option) => (
                <div key={option.label} className={twMerge('my-5 flex items-center', option.classExtend)}>
                  <ToggleSwitch
                    label={option.label}
                    checked={toggleStates[option.label]}
                    onToggleChange={() => handleToggle(option.label)}
                    labelClassExtend="text-[0.875rem]"
                  />
                  <div className="relative ml-auto">
                    <i
                      className="icon wcicon-information text-22 cursor-pointer"
                      data-tooltip-id={`${option.label}-tooltip`}
                      style={{ color: '#427596', fontSize: '22px' }}
                    />
                    <Tooltip
                      tooltipId={`${option.label}-tooltip`}
                      tooltipProps={{
                        place: 'top',
                      }}
                    >
                      <div className="max-w-[200px]">{option.tooltip}</div>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </CollapseSection>
        </>
      )}
    </>
  );
};

export default DeviceSettings;
