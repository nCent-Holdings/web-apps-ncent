import React, { useEffect } from 'react';
import FilterSpace from './FilterSpace';
import { useAppNav } from '../../../../contexts/AppNavContext/AppNavContext';

interface DeviceManagmentRightPanelProps {
  handleFilter: (isOpen: boolean) => void;
}

export const DeviceManagementRightPanel = ({ handleFilter }: DeviceManagmentRightPanelProps) => {
  const appNav = useAppNav();

  useEffect(() => {
    appNav.setRightPanelContent(<FilterSpace handleFilter={handleFilter} />);

    return () => {
      // Do nothing
    };
  }, []);

  return <></>;
};

export default DeviceManagementRightPanel;
