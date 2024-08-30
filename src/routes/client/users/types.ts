import { Permission } from '@src/routes/client/users/InviteModal';

export type User = {
  id: string;
  name?: string;
  firstName?: string;
  secondName?: string;
  email?: string;
  siteId: string;
  orgId: string;
  siteName?: string;
  siteIds: (string | undefined)[];
  permissionScope?: string;
  permissionType: string;
  status?: string;
  statusDate?: string;
  invitationId?: string;
};

export type Option = {
  id: string;
  value: string;
  label?: string;
};

export type DefaultEditData = {
  email: string;
  permission: Permission;
  siteIds: (string | undefined)[];
};
