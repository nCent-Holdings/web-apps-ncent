import React from 'react';
import { Status } from '@components/BadgeStatus/types';

export type DeviceDetailsContextType = {
  saveStatus?: Status;
  startSave: (key: string) => void;
  finishSave: (key: string) => void;
  saveError: (key: string, err: any) => void;
  deviceId?: string;
  isVisible: boolean;
  isAdvanced: boolean;
  history: { deviceId: string; isAdvanced: boolean }[];
  canGoBack: boolean;
  showAdvanced: () => void;
  selectDevice: (newDeviceId: string) => void;
  openDetails: (deviceId: string) => void;
  closeDetails: () => void;
  goBack: () => void;
};

export interface DeviceDetailsProviderProps {
  children: React.ReactNode;
}
