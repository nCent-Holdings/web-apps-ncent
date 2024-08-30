import React, { useEffect, useState } from 'react';
import * as userCoreAPI from '@src/actions/user';
import DeviceSettingsToggle from '@src/components/DeviceDetailsModal/SensorPurifierDetails/DeviceSettingsToggle';
import BadgeStatus from '@src/components/BadgeStatus/BadgeStatus';
import { Status } from '@src/components/BadgeStatus/types';

import { NotificationsProps, TToggleState, NotificationType, Notifications as NotificationsType } from './types';

const Notifications = ({ userData, userId }: NotificationsProps) => {
  const [toggleState, setToggleState] = useState<TToggleState>({
    filter_changes: { label: 'Filter Changes', checked: false },
    device_online: { label: 'Device Online', checked: false },
    device_offline: { label: 'Device Offline', checked: false },
    sensor_offline: { label: 'Sensor Offline', checked: false },
    acceptable_range: { label: 'Out of acceptable range', checked: false },
  });

  const [updateStatus, setUpdateStatus] = useState('');

  const handleUpdateStatus = (status: Status | '') => {
    setUpdateStatus(status);
  };

  const loadToggleData = (notifications: NotificationsType) => {
    let toggleData = toggleState;
    for (const key in notifications) {
      if (Object.prototype.hasOwnProperty.call(notifications, key)) {
        const checked = notifications[key as NotificationType];
        toggleData = {
          ...toggleData,
          [key as NotificationType]: {
            ...toggleState[key as NotificationType],
            checked: checked,
          },
        };
      }
    }

    if (toggleData) {
      setToggleState(toggleData);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setUpdateStatus('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [updateStatus]);

  useEffect(() => {
    if (!userData) {
      return;
    }

    loadToggleData(userData.notifications);
  }, [userData]);

  const handleToggle = async (key: NotificationType, toggledValue: boolean) => {
    try {
      handleUpdateStatus('Saving');

      await userCoreAPI.toggleNotification(userId, key);

      handleUpdateStatus('Saved');

      setToggleState({
        ...toggleState,
        [key]: {
          ...toggleState[key],
          checked: !toggledValue,
        },
      });
    } catch (e) {
      handleUpdateStatus('Error');
      console.error('error on updating notification:', e);
    }
  };

  return (
    <div className="rounded-lg border border-white-background bg-white p-8">
      <div className="flex flex-col gap-3">
        <span className="flex items-center text-h3 font-bold text-[#344054]">
          Notifications preferences
          {updateStatus && (
            <div className="ml-auto">
              <BadgeStatus status={updateStatus as Status} />
            </div>
          )}
        </span>
        <p className="py-8">
          Opt to receive email notifications for the following events, in addition to notifications in the WellCube app.
        </p>
        <div className="flex max-w-xs flex-col gap-3 bg-grey-light-25 p-5">
          {userData &&
            toggleState &&
            Object.keys(toggleState).map((key: string) => (
              <DeviceSettingsToggle
                key={key}
                label={toggleState[key as NotificationType].label}
                toggled={toggleState[key as NotificationType].checked}
                onClick={() => handleToggle(key as NotificationType, toggleState[key as NotificationType].checked)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
