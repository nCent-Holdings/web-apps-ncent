export interface DetailsProps {
  key: string;
  title: string;
  value: string;
}

export type Status = 'Pending Installation' | 'Scheduled' | 'Active Installation' | 'Installation Complete';

export const StatusMessages: Record<Status, string> = {
  'Pending Installation': 'Pending Installation',
  Scheduled: 'Scheduled',
  'Active Installation': 'Active Installation',
  'Installation Complete': 'Installation Complete',
};
export interface Site {
  id: string;
  site: string;
  address?: string;
  creationDate?: string;
  siteHandle?: string;
  status: Status;
  totalDevices?: number;
}
