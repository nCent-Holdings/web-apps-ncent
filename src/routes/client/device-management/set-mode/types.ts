import { Status } from '../../../../components/BadgeStatus/types';
import { FanMode, Purifier } from '../types';

export interface SetModeProps {
  openSetMode: boolean;
  handleCloseModal: () => void;
  purifierData?: Purifier;
  updatePurifierData: (purifier: Purifier) => void;
}

export const StatusMessages: Record<Status, string> = {
  Saving: 'Saving',
  Saved: 'Saved',
  Error: 'Error - try again',
};

export interface FanSpeedProps {
  speed: SpeedValues;
  handleUpdateSpeed: (newSpeed: SpeedValues) => void;
}

export type SpeedValues = '0' | '25' | '50' | '75' | '100';

export interface PurifierIcon {
  mode: FanMode;
  icon: JSX.Element;
  iconActive?: JSX.Element;
  label: string;
  tooltip?: string;
}

export interface FanSpeedIcon {
  speed: SpeedValues;
  icon: JSX.Element;
  label: string;
}
