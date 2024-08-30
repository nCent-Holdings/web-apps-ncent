type RouteDescription = {
  page: string;
  title: string;
};

export const RoutesMap: Record<string, RouteDescription> = {
  api: { page: 'API key', title: 'API key' },
  organizations: { page: 'Organizations', title: 'Organizations' },
  organization: { page: 'Organization', title: 'Organization' },
  devices: { page: 'Devices', title: 'Devices' },
  partners: { page: 'Partners', title: 'Partners' },
  'system-design': { page: 'System design', title: 'System Design' },
  home: { page: 'Home', title: 'Home' },
  reporting: { page: 'Reporting', title: 'Reporting' },
  'delos-users': { page: 'Delos users', title: 'Delos users' },
  users: { page: 'Users', title: 'Users' },
};
