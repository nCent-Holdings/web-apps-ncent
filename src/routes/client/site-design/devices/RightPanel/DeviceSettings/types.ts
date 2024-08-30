const deviceBaseModels = ['purifier', 'sensor', 'gateway'] as const;

const devicesModels = ['basic purifier', 'advanced purifier', 'sensor', 'gateway'] as const;
const toggleLabels = ['IAQ light', 'Noise sensing', 'Turbo speed', 'Filter light'] as const;

export type Models = (typeof devicesModels)[number];
export type BaseModels = (typeof deviceBaseModels)[number];
export type ToggleLabel = (typeof toggleLabels)[number];

export type ToggleState = Record<ToggleLabel, boolean>;
export type Setting = {
  name: string;
  value: boolean;
};

export type ToggleOnChange = (label: ToggleLabel) => void;

export interface ToggleOption {
  label: ToggleLabel;
  checked?: boolean;
  tooltip?: string;
  classExtend?: string;
  onToggleChange: (handleToggle: ToggleOnChange) => void;
}
