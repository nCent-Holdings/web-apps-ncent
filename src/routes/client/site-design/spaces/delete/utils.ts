import { GatewayModel, SpaceModel } from '../../../../../api-types/models';

export function getSpaceStats(
  space: SpaceModel,
  subspaces: SpaceModel[],
  gateways: GatewayModel[],
): {
  hasCommSpaceDevices: boolean;
  hasGatewaysDevices: boolean;
  hasCommGatewaysDevices: boolean;
  gatewaysWithCommDevicesIds: string[];
  hasGateways: boolean;
  hasCommissionedGateways: boolean;
  hasUncommissionedGateways: boolean;
  hasUncommissionedSpaceDevices: boolean;
} {
  let commSpaceDevicesCount = space['wellcube/devices']?.meta.commissioned || 0;
  let uncommissionedSpaceDevicesCount = space['wellcube/devices']?.meta.uncommissioned || 0;
  let gatewaysDevicesCount = 0;

  let gatewayCount = 0;
  let commissionedGatewayCount = 0;
  let uncommissionedGatewayCount = 0;

  const gatewaysWithCommDevicesIds: string[] = [];

  for (const subspace of subspaces) {
    commSpaceDevicesCount += subspace['wellcube/devices']?.meta.commissioned || 0;
    uncommissionedSpaceDevicesCount += subspace['wellcube/devices']?.meta.uncommissioned || 0;
  }

  for (const gateway of gateways) {
    gatewayCount++;

    if ((gateway['wellcube/devices']?.meta.commissioned || 0) > 0) {
      gatewaysWithCommDevicesIds.push(gateway.id);
    }

    gatewaysDevicesCount += gateway['wellcube/devices']?.meta.total || 0;

    if (gateway['wellcube/device']?.status === 'uncommissioned') {
      uncommissionedGatewayCount++;
    } else {
      commissionedGatewayCount++;
    }
  }

  return {
    hasCommSpaceDevices: commSpaceDevicesCount > 0,
    hasGatewaysDevices: gatewaysDevicesCount > 0,
    hasCommGatewaysDevices: gatewaysWithCommDevicesIds.length > 0,
    gatewaysWithCommDevicesIds,
    hasGateways: gatewayCount > 0,
    hasCommissionedGateways: commissionedGatewayCount > 0,
    hasUncommissionedGateways: uncommissionedGatewayCount > 0,
    hasUncommissionedSpaceDevices: uncommissionedSpaceDevicesCount > 0,
  };
}
