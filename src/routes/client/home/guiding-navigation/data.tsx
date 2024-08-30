import React from 'react';
import SiteDesignIcon from './images/SideDesingIcon.svg?react';
import DeviceManagmentIcon from './images/ManagmentDeviceIcon.svg?react';
import ReportingIcon from './images/ReportingIcon.svg?react';
import { DataNavigation } from './types';

export const dataNavigation: DataNavigation[] = [
  {
    title: 'System design',
    image: <SiteDesignIcon />,
    content: 'Set up your site and devices with your Technical Sales Manager.',
    link: '../system-design',
  },
  {
    title: 'Devices',
    image: <DeviceManagmentIcon />,
    content: 'View device details, device status, set modes, and stay up to date with maintenance.',
    link: '../devices',
  },
  {
    title: 'Reporting',
    image: <ReportingIcon />,
    content: 'View data, download reports, and measure the impact of  WellCube in your space.',
    link: '../reporting',
  },
];
