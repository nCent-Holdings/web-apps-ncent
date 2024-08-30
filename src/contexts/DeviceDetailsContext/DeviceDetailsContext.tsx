import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DeviceDetailsContextType, DeviceDetailsProviderProps } from '@src/contexts/DeviceDetailsContext/types';
import { Status } from '@components/BadgeStatus/types';

const DeviceDetailsContext = createContext<DeviceDetailsContextType>({} as DeviceDetailsContextType);

const DeviceDetailsContextProvider = ({ children }: DeviceDetailsProviderProps) => {
  const [saveStatusTracker, setSaveStatusTracker] = useState({});

  const [isAdvanced, setAdvanced] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [history, setHistory] = useState<{ deviceId: string; isAdvanced: boolean }[]>([]);

  const pushHistory = (deviceId: string, isAdvanced: boolean) => {
    const newHist = [...history];
    newHist.push({ deviceId, isAdvanced });

    setHistory(newHist);
  };

  const popHistory = () => {
    const newHist = [...history];
    const popped = newHist.pop();

    setHistory(newHist);

    return popped;
  };

  const canGoBack = useMemo(() => {
    return history.length > 0;
  }, [history]);

  const goBack = () => {
    if (history.length > 0) {
      const popped = popHistory();

      setDeviceId(popped?.deviceId ?? '');
      setAdvanced(popped?.isAdvanced ?? false);
    } else {
      console.warn('Cannot go back');
    }
  };

  const isVisible = useMemo(() => {
    return deviceId != null;
  }, [deviceId]);

  const selectDevice = (newDeviceId: string, isAdvanced?: boolean) => {
    if (deviceId) {
      pushHistory(deviceId, isAdvanced ?? false);
      setDeviceId(newDeviceId);
    } else {
      setDeviceId(newDeviceId);
    }
  };

  const openDetails = (deviceId: string) => {
    selectDevice(deviceId);
  };

  const closeDetails = () => {
    setHistory([]);
    setDeviceId('');
    setAdvanced(false);
  };

  const showAdvanced = () => {
    if (isAdvanced) return;

    setAdvanced(true);
    pushHistory(deviceId, false);
  };

  const saveStatus = useMemo(() => {
    const statuses = Object.values(saveStatusTracker);

    if (statuses.some((s) => s === 'Error')) {
      return 'Error' as Status;
    } else if (statuses.some((s) => s === 'Saving')) {
      return 'Saving' as Status;
    } else if (statuses.length > 0 && !statuses.some((s) => s !== 'Saved')) {
      return 'Saved' as Status;
    } else {
      return undefined as unknown as Status;
    }
  }, [saveStatusTracker]);

  useEffect(() => {
    if (saveStatus === 'Saved') {
      setTimeout(() => {
        setSaveStatusTracker({});
      }, 3000);
    }
  }, [saveStatus]);

  const startSave = (key: string) => {
    setSaveStatusTracker({
      ...saveStatusTracker,
      [key]: 'Saving',
    });
  };

  const finishSave = (key: string) => {
    setSaveStatusTracker({
      ...saveStatusTracker,
      [key]: 'Saved',
    });
  };

  const saveError = (key: string) => {
    setSaveStatusTracker({
      ...saveStatusTracker,
      [key]: 'Error',
    });
  };

  return (
    <DeviceDetailsContext.Provider
      value={React.useMemo(
        () => ({
          canGoBack,
          isAdvanced,
          selectDevice,
          openDetails,
          closeDetails,
          showAdvanced,
          goBack,
          deviceId,
          history,
          isVisible,
          saveStatus,
          startSave,
          finishSave,
          saveError,
        }),
        [canGoBack, isVisible, deviceId, history, isAdvanced, saveStatus],
      )}
    >
      {children}
    </DeviceDetailsContext.Provider>
  );
};

export { DeviceDetailsContext, DeviceDetailsContextProvider };

export const useDeviceDetailsContext = () => {
  return useContext(DeviceDetailsContext);
};
