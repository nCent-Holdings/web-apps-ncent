import { NotificationType } from './NotificationsDropdown';

export const NOTIFICATIONS: NotificationType[] = [
  {
    notificationDate: Date.now(), // UTC / unix epoch
    dateRead: null, // UTC / unix epoch or NULL
    details: {
      type: 'SENSOR_OFFLINE', // SENSOR_OFFLINE | SENSOR_ONLINE | DEVICE_OFFLINE | DEVICE_ONLINE | REPLACE_FILTER | METRIC_OOAR
      site: '860 Washington',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elittiam ac varius libero. Coxdilos, tusliwo laseoi.',
    },
  },
  {
    notificationDate: 1703460731352,
    dateRead: null,
    details: {
      type: 'SENSOR_ONLINE',
      site: '860 Washington',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elittiam ac varius libero. Coxdilos, tusliwo laseoi.',
    },
  },
  {
    notificationDate: 1703460701352,
    dateRead: 1701460701380,
    details: {
      type: 'DEVICE_ONLINE',
      site: '860 Washington',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elittiam ac varius libero. Coxdilos, tusliwo laseoi.',
    },
  },
  {
    notificationDate: 1700460731352,
    dateRead: null,
    details: {
      type: 'DEVICE_OFFLINE',
      site: '860 Washington',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elittiam ac varius libero. Coxdilos, tusliwo laseoi.',
    },
  },
];
