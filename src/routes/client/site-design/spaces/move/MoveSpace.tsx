import React, { useEffect, useState } from 'react';
import { Modal, OvalLoader } from '@ncent-holdings/ux-components';

import MoveSpaceContent from './ModalContent/MoveSpaceContent';
import SelectLocation from './ModalContent/SelectLocation';
import * as spaceCoreAPI from '../../../../../actions/spaces';
import { DeviceModel, GatewayModel, SpaceModel } from '../../../../../api-types/models';
import siteDesignSelectors from '@src/features/site-design/siteDesign.selectors';
import { useSelector } from 'react-redux';
import SpaceSensorMapping from '../SpaceSensorMapping';

interface MoveSpaceProps {
  selectedSpace: SpaceModel;
  onClose: () => void;
  isOpen?: boolean;
}

const MoveSpace = ({ isOpen, onClose, selectedSpace }: MoveSpaceProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSubspaces, setCurrentSubspaces] = useState<string[]>([]);
  const [isCustomSensorConfirmed, setIsCustomSensorConfirmed] = useState(false);
  const [gateways, setGateways] = useState<GatewayModel[]>([]);
  const [devices, setDevices] = useState<DeviceModel[]>([]);
  const [selectLocation, setSelectLocation] = useState(false);
  const [retainExisting, setRetainExisting] = useState(false);

  const hasExternalSensorsMapped = useSelector(siteDesignSelectors.selectHasExternalSensorsMapped(selectedSpace.id));

  useEffect(() => {
    fetchData();
    return () => setIsCustomSensorConfirmed(false);
  }, [selectedSpace]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const subspaces = await spaceCoreAPI.getSubspaces(selectedSpace.id);
      const spaceIds = [selectedSpace.id, ...subspaces.map((subspace) => subspace.id)];

      setCurrentSubspaces(subspaces.map((subspace) => subspace.id));

      const [gatewaysList, purifiersList, sensorsList] = await Promise.all([
        spaceCoreAPI.getSpacesGateways(spaceIds),
        spaceCoreAPI.getSpacesPurifiers(spaceIds),
        spaceCoreAPI.getSpacesSensors(spaceIds),
      ]);

      const devicesList = [...purifiersList, ...sensorsList];

      setGateways(gatewaysList);
      setDevices(devicesList);
      if (!gatewaysList.length && !devicesList.length) setSelectLocation(true);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      onClose();
    }
  };

  const handleConfirm = (checkboxValue: boolean) => {
    setRetainExisting(checkboxValue);
    setSelectLocation(true);
  };

  const handleSubmit = async (selectedLocation: string) => {
    try {
      await spaceCoreAPI.moveSpace(selectedSpace.id, selectedLocation, retainExisting);

      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  const renderContent = () => {
    if (hasExternalSensorsMapped && !isCustomSensorConfirmed) {
      return <SpaceSensorMapping handleOnCancel={onClose} handleOnConfirm={() => setIsCustomSensorConfirmed(true)} />;
    } else if (isLoading)
      return (
        <div className="mb-[45px] flex h-[400px] w-[400px] flex-col items-center justify-center">
          <OvalLoader />
        </div>
      );
    if (!selectLocation) {
      return (
        <MoveSpaceContent
          selectedSpace={selectedSpace}
          gateways={gateways}
          devices={devices}
          onCancel={onClose}
          onOk={handleConfirm}
        />
      );
    } else if (selectLocation) {
      return (
        <SelectLocation
          currentSubspacesIds={currentSubspaces}
          selectedSpace={selectedSpace}
          hasDevices={Boolean(gateways.length || devices.length)}
          retain={retainExisting}
          onCancel={onClose}
          onOk={handleSubmit}
        />
      );
    } else return <div>...</div>;
  };

  return (
    <Modal
      maxWidth={hasExternalSensorsMapped && !isCustomSensorConfirmed ? 'sm' : 'lg'}
      onClose={onClose}
      open={isOpen}
      showCloseButton={true}
    >
      {renderContent()}
    </Modal>
  );
};

export default MoveSpace;
