import { Models, ToggleOnChange, ToggleOption, ToggleLabel, BaseModels } from './types';

export const baseModelsMap: Record<Models, BaseModels> = {
  'basic purifier': 'purifier',
  'advanced purifier': 'purifier',
  sensor: 'sensor',
  gateway: 'gateway',
};

export const apiPropsMap: Record<string, ToggleLabel> = {
  allow_turbo: 'Turbo speed',
  light_iaq: 'IAQ light',
  light_filter: 'Filter light',
  noise: 'Noise sensing',
};

// Removed Occupancy and People Counting settings in WFM-1057
export const generateSettingsConfig = (): Record<Models, ToggleOption[]> => {
  return {
    'basic purifier': [
      {
        label: 'IAQ light',
        tooltip: 'The IAQ indicator light tells you if the air quality near the device is good, fair, or poor.',
        onToggleChange: (handleToggle: ToggleOnChange) => handleToggle('IAQ light'),
      },
      {
        label: 'Turbo speed',
        tooltip: 'Turbo speed allows the device to remediate air quality issues more quickly.',
        onToggleChange: (handleToggle: ToggleOnChange) => handleToggle('Turbo speed'),
      },
      {
        label: 'Filter light',
        tooltip: 'The filter light on the device will show you when the filter needs to be changed.',
        onToggleChange: (handleToggle: ToggleOnChange) => handleToggle('Filter light'),
      },
    ],
    'advanced purifier': [
      {
        label: 'IAQ light',
        tooltip: 'The IAQ indicator light tells you if the air quality near the device is good, fair, or poor.',
        onToggleChange: (handleToggle: ToggleOnChange) => handleToggle('IAQ light'),
      },
      {
        label: 'Noise sensing',
        tooltip: 'Noise sensors measure the levels of ambient noise near the device.',
        onToggleChange: (handleToggle: ToggleOnChange) => handleToggle('Noise sensing'),
      },
      {
        label: 'Turbo speed',
        tooltip: 'Turbo speed allows the device to remediate air quality issues more quickly.',
        onToggleChange: (handleToggle: ToggleOnChange) => handleToggle('Turbo speed'),
      },
      {
        label: 'Filter light',
        tooltip: 'The filter light on the device will show you when the filter needs to be changed.',
        onToggleChange: (handleToggle: ToggleOnChange) => handleToggle('Filter light'),
      },
    ],
    sensor: [
      {
        label: 'IAQ light',
        tooltip: 'The IAQ indicator light tells you if the air quality near the device is good, fair, or poor.',
        onToggleChange: (handleToggle: ToggleOnChange) => handleToggle('IAQ light'),
      },
      {
        label: 'Noise sensing',
        tooltip: 'Noise sensors measure the levels of ambient noise near the device.',
        onToggleChange: (handleToggle: ToggleOnChange) => handleToggle('Noise sensing'),
      },
    ],
    gateway: [],
  };
};
