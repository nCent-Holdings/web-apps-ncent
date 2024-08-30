import React, { useEffect, useState } from 'react';
import { DeviceModel, GatewayModel, SpaceModel } from '../../../../../../api-types/models';
import { Button, Checkbox } from '@ncent-holdings/ux-components';
import { getGatewaysDevices } from '../../../../../../actions/gateways';

type MoveSpaceContentProps = {
  selectedSpace: SpaceModel;
  gateways: GatewayModel[];
  devices: DeviceModel[];
  onCancel: () => void;
  onOk: (retain: boolean) => void;
};

const MoveSpaceContent = ({ selectedSpace, gateways, devices, onCancel, onOk }: MoveSpaceContentProps) => {
  const [retainExisting, setRetainExisting] = useState(false);
  const [affectedDevices, setAffectedDevices] = useState<DeviceModel[]>([]);

  useEffect(() => {
    fetchDevices();
  }, [selectedSpace, gateways]);

  const fetchDevices = async () => {
    if (gateways.length) {
      const assignedDevices = await getGatewaysDevices(gateways.map((item) => item.id));

      setAffectedDevices(assignedDevices.filter((item) => !devices.some((device) => device.id === item.id)));
    }
  };

  const handleOk = () => onOk(retainExisting);

  const renderTip = () => {
    if (gateways.length && devices.length)
      return 'TIP: Contact your Technical Sales Manager to better understand implications of moving space with gateways or devices.';
    else if (devices.length)
      return 'TIP: Contact your Technical Sales Manager to better understand implications of moving space with devices.';
    else if (gateways.length)
      return 'TIP: Contact your Technical Sales Manager to better understand implications of moving space with a gateway.';
    else return '';
  };

  const renderText = () => {
    if (gateways.length && devices.length)
      return 'This space contains a gateway with assigned devices. By default, if you move the space, these will lose their assignments, necessitating reassignment. This is to prevent faulty assignments resulting from relocation.';
    else if (devices.length)
      return 'This space contains sensors and purifiers. By default, if you move the space, these will lose their gateway assignments, necessitating reassignment. This is to prevent faulty assignments resulting from relocation.';
    else if (gateways.length)
      return 'This space contains a gateway. By default, if you move the space, it will lose its assignment to all devices, necessitating reassignment. This is to prevent faulty assignments resulting from relocation.';
    else return '';
  };

  return (
    <>
      <div className="mb-[45px] flex flex-col">
        <div className={'text-sm font-semibold text-grey-500'}>MOVE</div>
        <div className="mb-[42px] text-h4 font-semibold">{selectedSpace?.name}</div>
        <div className="mb-[42px] rounded-lg bg-blue-brilliant px-5 py-4 font-semibold text-white">{renderTip()}</div>
        <div className="flex h-[308px]">
          <div className="mr-8 w-[434px]">
            <div className="mb-8">{renderText()}</div>
            <div className="mb-4">
              If, however, you would like to override this default setting, check here to proceed.
            </div>
            <div className="flex items-start gap-2 leading-5">
              <div className="min-w-[20px]">
                <Checkbox
                  id="retainExisting"
                  isChecked={retainExisting}
                  handleCheck={() => setRetainExisting(!retainExisting)}
                />
              </div>
              <p className="mt-[-2px]">
                I would like to move this space while retaining the existing gateway and device assignments.
              </p>
            </div>
          </div>
          <div className="h-full w-px bg-blue-light-suede"></div>
          <div className="ml-8 flex h-full w-[400px] flex-col">
            <p className="mb-5 font-semibold">The following devices will be affected:</p>
            {!gateways.length && !affectedDevices.length && !devices.length ? (
              <p>No devices will be impacted.</p>
            ) : (
              <div className="grow overflow-auto rounded-lg border border-grey-400 bg-white px-4">
                {[...gateways, ...devices, ...affectedDevices].map((item) => {
                  const { full_path = '', top_space = '' } = item['wellcube/location'] || {};
                  const spaceString = full_path === top_space ? `${full_path} >` : `${top_space} > ...`;
                  return (
                    <div
                      key={item.id}
                      className="w-full overflow-hidden text-ellipsis border-b border-grey-400 py-4 last:border-b-0"
                    >
                      <span className="text-sm font-medium">{spaceString}</span>{' '}
                      <span className="font-bold">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center gap-3">
        <Button
          size="medium"
          variant="secondary"
          className="w-fit min-w-[140px] px-[22px]"
          label="Cancel"
          onClick={onCancel}
        />
        <Button
          size="medium"
          variant="primary"
          className="w-fit min-w-[140px] px-[22px]"
          label={'I understand'}
          onClick={handleOk}
        />
      </div>
    </>
  );
};

export default MoveSpaceContent;
