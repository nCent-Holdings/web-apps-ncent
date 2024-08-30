import { Button, Modal } from '@ncent-holdings/ux-components';
import React from 'react';

type UncommissionedDeviceModalProps = {
  onClose: () => void;
  isOpen: boolean;
};

const UncommissionedDeviceModal: React.FC<UncommissionedDeviceModalProps> = ({ onClose, isOpen }) => {
  const handleLearnMore = () => {
    window.open('https://support.delos.com/hc/en-us', '_blank');
  };

  return (
    <Modal onClose={onClose} open={isOpen}>
      <h1 className="mb-6 text-[1.5rem] font-semibold leading-[1.25] tracking-[-.0625rem]">
        This device has not yet been commissioned
      </h1>
      <div>Once the device is commissioned, you&apos;ll find more information when you return to Devices.</div>
      <div className="mt-12 flex items-center justify-center gap-3">
        <Button label="Cancel" variant="secondary" className="w-[140px]" onClick={onClose} />
        <Button label="Learn more" variant="primary" className="w-[140px]" onClick={handleLearnMore} />
      </div>
    </Modal>
  );
};

export default UncommissionedDeviceModal;
