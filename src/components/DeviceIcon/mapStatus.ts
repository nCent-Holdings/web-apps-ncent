import { match } from 'ts-pattern';
import { DeviceIconStatus } from './types';

type InputProps = {
  connectivity?: string;
  isGateway?: boolean;
  isAttentionRequired?: boolean;
};

export const mapStatus = (input: InputProps): DeviceIconStatus =>
  match<InputProps, DeviceIconStatus>(input)
    .with({ isAttentionRequired: true, connectivity: 'uncommissioned' }, () => 'common')
    .with({ isAttentionRequired: true, connectivity: 'offline' }, () => 'error')
    .with({ isAttentionRequired: true }, () => 'warn')

    .with({ connectivity: 'offline' }, () => 'error')
    .with({ connectivity: 'online' }, () => 'ok')
    .otherwise(() => 'common');
