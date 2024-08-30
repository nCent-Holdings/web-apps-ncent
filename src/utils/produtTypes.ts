import { GatewayModel, PurifierModel, SensorModel } from '../api-types/models';

export const getProductType = (device: SensorModel | GatewayModel | PurifierModel | undefined) => {
  if ((<SensorModel>device)?.['wellcube/sensor'] != null) {
    return 'sensor';
  } else if ((<PurifierModel>device)?.['wellcube/purifier'] != null) {
    return 'purifier';
  } else if ((<GatewayModel>device)?.['wellcube/gateway'] != null) {
    return 'gateway';
  } else {
    return 'unknown';
  }
};
