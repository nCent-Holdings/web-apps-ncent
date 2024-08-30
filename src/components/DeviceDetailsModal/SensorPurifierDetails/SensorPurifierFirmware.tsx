import React, { useEffect, useState, useMemo } from 'react';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { LONG_DATE_FORMAT } from '@components/DeviceDetailsModal/common/constants';
import { useSiteFromHandleOrLastStored } from '@src/features/useSiteFromHandleOrLastStored';
import { twMerge } from 'tailwind-merge';
import { OvalLoader } from '@ncent-holdings/ux-components';
import { PurifierModel, SensorModel } from '@src/api-types/models';

dayjs.extend(utc);
dayjs.extend(timezone);

export type FirmwarePackage = {
  'wellcube/firmware_package': {
    version: string;
  };
};

export type FirmwareProps = {
  version: string | undefined;
  hasUpdate: boolean | undefined;
  onUpdate: () => Promise<void>;
  status: string | undefined;
  lastUpdated: string | number | undefined;
  latestPackage: string | FirmwarePackage;
};

export type SensorPurifierFirmwareProps = {
  device: PurifierModel | SensorModel;
  HRN71: FirmwareProps;
  MCU: FirmwareProps;
};

const UPDATE_TIMEOUT = 45;

export const SensorPurifierFirmware = (firmwareProps: SensorPurifierFirmwareProps) => {
  const { device, HRN71, MCU } = firmwareProps;
  const { siteTz } = useSiteFromHandleOrLastStored();

  const [updating, setUpdating] = useState<'HRN71' | 'MCU' | ''>('');
  const [updateTimeout, setUpdateTimeout] = useState(false);

  const [updateError, setUpdateError] = useState<any>('');

  const handleUpdateError = (type: 'MCU' | 'HRN71', err: string) => {
    setUpdateError({ type, error: err });
  };

  useEffect(() => {
    if (updateError) {
      console.error('An error occurred while updating the firmware: ', { updateError });
    }
  }, [updateError]);

  const handleUpdateMCU = async () => {
    setUpdateError(false);

    try {
      if (!MCU.hasUpdate) return;

      setUpdating('MCU');

      setTimeout(() => setUpdateTimeout(true), UPDATE_TIMEOUT * 1000);

      await MCU.onUpdate();
    } catch (err) {
      handleUpdateError('MCU', err?.toString() || 'Unknown error');

      setUpdating('');
    }
  };

  const handleUpdateHRN71 = async () => {
    setUpdateError(false);

    try {
      if (!HRN71.hasUpdate) return;

      setUpdating('HRN71');

      setTimeout(() => setUpdateTimeout(true), UPDATE_TIMEOUT * 1000);

      await HRN71.onUpdate();
    } catch (err) {
      handleUpdateError('HRN71', err?.toString() || 'Unknown error');

      setUpdating('');
    }
  };

  useEffect(() => {
    if (updating && updateTimeout) {
      handleUpdateError(updating, 'Update failed to start');
      setUpdateTimeout(false);
      setUpdating('');
    } else if (!updating && updateTimeout) {
      setUpdateTimeout(false);
    }
  }, [updateTimeout, updating]);

  useEffect(() => {
    if (MCU.status !== 'idle' || HRN71.status !== 'idle') {
      setUpdating('');
    }
  }, [MCU.status, HRN71.status]);

  const mcuUpdateDay = useMemo(() => {
    const dateVal = parseInt(MCU.lastUpdated?.toString() || '');
    if (dateVal < 0 || isNaN(dateVal)) {
      return '';
    } else {
      return dayjs
        .unix(dateVal || 0)
        .tz(siteTz)
        .format(LONG_DATE_FORMAT);
    }
  }, [MCU.lastUpdated]);

  const hrn71UpdateDay = useMemo(() => {
    const dateVal = parseInt(HRN71.lastUpdated?.toString() || '');
    if (dateVal < 0 || isNaN(dateVal)) {
      return '';
    } else {
      return dayjs
        .unix(dateVal || 0)
        .tz(siteTz)
        .format(LONG_DATE_FORMAT);
    }
  }, [HRN71.lastUpdated]);

  const renderVersion = (type: 'HRN71' | 'MCU') => {
    const firmwareObj = firmwareProps[type];

    if (type === 'MCU' && device?.['wellcube/device']?.mcu_status === 'offline') {
      return <div>MCU OFFLINE</div>;
    }

    if (firmwareObj.latestPackage === 'checking') {
      return <div>Checking for update...</div>;
    }

    if (updateError?.type === type) {
      return <div className="text-alert-error">{updateError?.error}</div>;
    }

    if (firmwareObj.status === 'downloading') {
      return <div className="text-alert-error">Downloading...</div>;
    } else if (firmwareObj.status === 'downloaded') {
      return <div className="text-alert-error">Downloaded!</div>;
    } else if (firmwareObj.status === 'updating') {
      return <div className="text-alert-error">Updating...</div>;
    }

    if (firmwareObj?.hasUpdate) {
      return (
        <div>AVAILABLE: {(firmwareObj.latestPackage as FirmwarePackage)?.['wellcube/firmware_package']?.version}</div>
      );
    } else {
      return <div>Up to date</div>;
    }
  };

  const canUpdate = useMemo(() => {
    const disableStatuses = ['downloading', 'downloaded', 'updating'];

    return !disableStatuses.includes(MCU.status as string) && !disableStatuses.includes(HRN71.status as string);
  }, [MCU]);

  const renderUpdateButton = (type: string) => {
    if (type === 'MCU') {
      if (updating === type) {
        return (
          <div className="flex w-[84px] items-center">
            <OvalLoader className="h-[25px] max-h-[25px]" />
          </div>
        );
      } else {
        const mcuOffline = device?.['wellcube/device']?.mcu_status === 'offline';

        return (
          <div
            className={twMerge(
              'w-[84px] text-[0.75rem] font-semibold text-grey-light-500',
              !mcuOffline && canUpdate && MCU.hasUpdate && 'cursor-pointer text-blue-brilliant underline',
              (mcuOffline || !canUpdate || !MCU.hasUpdate) && 'pointer-events-none',
            )}
            onClick={handleUpdateMCU}
          >
            MCU UPDATES
          </div>
        );
      }
    } else if (type === 'HRN71') {
      if (updating === type) {
        return (
          <div className="flex w-[84px] items-center">
            <OvalLoader className="h-[25px] max-h-[25px]" />
          </div>
        );
      } else {
        return (
          <div
            className={twMerge(
              'w-[84px] text-[0.75rem] font-semibold text-grey-light-500',
              canUpdate && HRN71.hasUpdate && 'cursor-pointer text-blue-brilliant underline',
              (!canUpdate || !HRN71.hasUpdate) && 'pointer-events-none',
            )}
            onClick={handleUpdateHRN71}
          >
            WIRELESS UPDATES
          </div>
        );
      }
    }
  };

  return (
    <>
      <div className="flex h-full w-full flex-col items-start justify-center gap-y-5 pl-2.5 text-xs font-medium">
        <div className="flex justify-between">
          {renderUpdateButton('MCU')}
          <div className="w-[155px]">
            {renderVersion('MCU')}
            <div>{mcuUpdateDay}</div>
          </div>
        </div>
        <div className="flex justify-between">
          {renderUpdateButton('HRN71')}
          <div className="w-[155px]">
            {renderVersion('HRN71')}
            <div>{hrn71UpdateDay}</div>
          </div>
        </div>
      </div>
    </>
  );
};
