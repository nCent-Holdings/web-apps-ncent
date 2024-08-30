import { ReactNode } from 'react';
import { GatewayModel, PurifierModel, SensorModel } from '../../../api-types/models';

export type DeviceDetailsProps = {
  deviceId?: string;
  onClose: () => void;
};

export type SensorPurifierDetailProps = {
  device: PurifierModel | SensorModel;
};

export type GatewayDetailProps = {
  device: GatewayModel;
};

export type DeviceDetailsSectionProps = {
  heading: ReactNode | null;
  classExtend?: string;
  headingClassExtend?: string;
  children: ReactNode | ReactNode[] | null;
};
