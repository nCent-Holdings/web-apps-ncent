import React, { useEffect, useState } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import useOutsideClickHandler from '@src/hooks/useOutsideClickHandler';
import NoNotifications from './noNotifications.svg?react';
import { ToggleSwitch, Tooltip } from '@ncent-holdings/ux-components';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

export type NotificationType = {
  notificationDate: string | number;
  dateRead: string | number | null;
  details: {
    type: 'SENSOR_OFFLINE' | 'SENSOR_ONLINE' | 'DEVICE_OFFLINE' | 'DEVICE_ONLINE' | 'REPLACE_FILTER' | 'METRIC_OOAR';
    site: string;
    message: string;
  };
};

const notificationTypeLabels: Record<NotificationType['details']['type'], string> = {
  SENSOR_OFFLINE: 'Sensor offline',
  SENSOR_ONLINE: 'Sensor online',
  DEVICE_OFFLINE: 'Device offline',
  DEVICE_ONLINE: 'Device online',
  REPLACE_FILTER: 'Replace filter',
  METRIC_OOAR: 'Metric out of acceptable range',
};

export default function NotificationsDropdown({
  onClickOutside,
  notifications = [],
}: {
  onClickOutside?: () => void;
  notifications: NotificationType[];
}) {
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(notifications.filter((item) => !item.dateRead));
  const wrapDropdownRef = React.useRef(null);

  useEffect(() => {
    setUnreadNotifications(notifications.filter((item) => !item.dateRead));
  }, [notifications]);

  const handleClickOutside = () => {
    if (onClickOutside) onClickOutside();
  };

  useOutsideClickHandler(wrapDropdownRef, () => {
    handleClickOutside();
  });

  const renderNoNotifications = () => {
    return (
      <div className="flex items-center px-6 py-5">
        <NoNotifications />
        <div className="ml-3">
          <p className="text-h6 font-semibold">
            You have no {onlyUnread && !unreadNotifications.length && 'unread'} notifications
          </p>
          <p className="text-[14px]">We will notify you when something new arrives.</p>
        </div>
      </div>
    );
  };

  const renderNotifications = () => {
    const renderedNotifications = onlyUnread ? unreadNotifications : notifications;
    const notificationsByDay = renderedNotifications.reduce((acc: Record<string, NotificationType[]>, item) => {
      const newAcc = { ...acc };
      const messageDate = dayjs(item.notificationDate).format('MM/DD/YYYY');
      newAcc[messageDate] = acc[messageDate] ? [...acc[messageDate], item] : [item];

      return newAcc;
    }, {});

    return (
      <div>
        <div className="max-h-[628px] overflow-y-auto">
          {Object.keys(notificationsByDay).map((date) => {
            const dateObj = dayjs(date, 'MM/DD/YYYY');
            const isToday = dayjs().isSame(dateObj, 'day');
            const isLastSevenDays = dateObj.isAfter(dayjs().subtract(7, 'day'));

            return (
              <div key={date}>
                <div className="border-b border-card-stroke bg-grey-light-50 px-6 py-4 font-semibold text-black-soft">
                  {isToday ? (
                    'Today'
                  ) : (
                    <div className="flex">
                      {isLastSevenDays && (
                        <p className="mr-2 after:ml-2 after:inline-block after:h-2 after:border-r after:border-grey-light-400">
                          {dateObj.format('dddd')}
                        </p>
                      )}
                      {date}
                    </div>
                  )}
                </div>
                {notificationsByDay[date].map((notification) => {
                  const { type, message, site } = notification.details;

                  return (
                    <div
                      key={notification.notificationDate}
                      className="flex gap-[10px] border-b border-card-stroke px-6 py-5"
                    >
                      <div>
                        <div className={twMerge('text-h6', !notification.dateRead && 'font-semibold')}>
                          {notificationTypeLabels[type]} | {site}
                        </div>
                        <div className="mt-[6px] font-medium text-blue-suede">
                          {dayjs(notification.notificationDate).format('h:mma')}
                        </div>
                        <div className="text-grey-light-600 mt-[6px] text-[14px] font-medium">
                          {message}{' '}
                          <span className="cursor-pointer text-blue-brilliant underline hover:no-underline">
                            View now
                          </span>
                        </div>
                      </div>
                      <div>
                        <div
                          className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-blue-brilliant text-white-soft"
                          data-tooltip-id={`${notification.notificationDate}`}
                        >
                          {notification.dateRead && (
                            <i className="icon wcicon-check icon-sm rounded-full bg-blue-brilliant" />
                          )}
                        </div>
                        <Tooltip
                          tooltipId={`${notification.notificationDate}`}
                          singleLine
                          tooltipProps={{ place: 'left' }}
                        >
                          {notification.dateRead ? 'Mark as unread' : 'Mark as read'}
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center border-t border-card-stroke bg-[#F9FCFF] py-5 text-[14px] font-medium text-grey-light-500">
          That&apos;s all your notifications from the last 30 days.
        </div>
      </div>
    );
  };

  const hasNotifications = onlyUnread ? unreadNotifications.length : notifications.length;

  return (
    <div ref={wrapDropdownRef} className="isolate">
      <Dropdown classExtend={'w-[559px] overflow-hidden'}>
        <div className="flex items-center justify-between border-b border-card-stroke bg-[#F9FCFF] px-6 py-5">
          <p className="text-h4 font-semibold text-black-soft">Notifications</p>
          {!!notifications.length && (
            <div className="flex">
              <ToggleSwitch
                checked={onlyUnread}
                onToggleChange={() => setOnlyUnread(!onlyUnread)}
                label="Only show unread"
                labelClassExtend="font-medium text-[14px] text-black-soft"
              />
              <div
                className={twMerge(
                  'ml-4 flex cursor-pointer items-center text-[14px] font-medium text-blue-brilliant',
                  !unreadNotifications.length && 'cursor-default text-grey-400',
                )}
              >
                <div
                  className={twMerge(
                    'mr-2 flex items-center rounded-full border border-blue-brilliant',
                    !unreadNotifications.length && 'border-grey-400',
                  )}
                >
                  <i className="icon wcicon-check" />
                </div>{' '}
                Mark all as read
              </div>
            </div>
          )}
        </div>

        {hasNotifications ? renderNotifications() : renderNoNotifications()}
      </Dropdown>
    </div>
  );
}
