export type NotificationType =
  | 'filter_changes'
  | 'device_online'
  | 'device_offline'
  | 'sensor_offline'
  | 'acceptable_range';

export type Notifications = {
  [key in NotificationType]: boolean;
};

export type UserData = {
  first_name: string;
  second_name: string;
  phone_number: string;
  notifications: Notifications;
};

export interface NotificationsProps {
  userData?: UserData;
  userId: string;
}

export type TToggleState = {
  [key in NotificationType]: {
    label: string;
    checked: boolean;
  };
};
