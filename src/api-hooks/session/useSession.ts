import { useContext, useMemo } from 'react';

import * as sessionActions from '../../actions/session';
import { CloudUser } from '@src/api/CloudAPI/models';

import { AUTH_STATUSES, SessionContext } from './Context';
import { type UserRoles } from '@src/api-hooks/session/types';
import { useOrganizationFromHandle } from '@src/features/useOrganizationFromHandle';

export interface SessionAPI {
  restore(): Promise<void>;
  loginToCognito(
    email: string,
    password: string,
    onCodeRequested: {
      (error?: any): Promise<{ action: 'confirm' | 'resend'; value: any }>;
    },
  ): Promise<string>;
  loginToCloud(email: string, password: string): Promise<string>;
  loginWithCloudJwt(cloudJwt: string): Promise<void>;
  logout(): Promise<void>;
  getAuthorizedUserData(): CloudUser;
  checkIfCurrentAuthorizedUser(userId?: string): boolean;
  getUserRoles(): string[];
  getUserPermissions(siteId?: string): UserRoles;
}

type UseSession = [AUTH_STATUSES, SessionAPI];

export { AUTH_STATUSES };

export const USER_ROLES = {
  TSM: 'technical-sales-manager',
  DELOS_ADMIN: 'delos-admin',
  ORG_ADMIN: 'org-admin',
  SITE_ADMIN: 'site-admin',
  SITE_EXTERNAL: 'external-admin',
};

export default function useSession(): UseSession {
  const { authStatus, setAuthStatus } = useContext(SessionContext);

  const api = useMemo(
    () => ({
      restore: async () => {
        if (authStatus !== AUTH_STATUSES.NOT_AUTHORIZED) {
          return;
        }

        try {
          await sessionActions.restore();
          setAuthStatus(AUTH_STATUSES.AUTHORIZED);
        } catch (error) {
          setAuthStatus(AUTH_STATUSES.NOT_AUTHORIZED);

          throw error;
        }
      },
      loginToCloud: async (email: string, password: string) => {
        return sessionActions.loginToCloud(email, password);
      },
      loginToCognito: async (
        email: string,
        password: string,
        onCodeRequested: {
          (error?: any): Promise<{ action: 'confirm' | 'resend'; value: any }>;
        },
      ) => {
        return sessionActions.loginToCognito(email, password, onCodeRequested);
      },
      loginWithCloudJwt: async (cloudJwt: string) => {
        if (authStatus !== AUTH_STATUSES.NOT_AUTHORIZED) {
          return;
        }

        try {
          sessionActions.setCloudJwt(cloudJwt);
          await sessionActions.restore();
          setAuthStatus(AUTH_STATUSES.AUTHORIZED);
        } catch (error) {
          setAuthStatus(AUTH_STATUSES.NOT_AUTHORIZED);
          await sessionActions.logout();
          throw error;
        }
      },
      logout: async () => {
        if (authStatus !== AUTH_STATUSES.AUTHORIZED) {
          return;
        }

        try {
          await sessionActions.logout();
          setAuthStatus(AUTH_STATUSES.NOT_AUTHORIZED);
        } catch (error) {
          setAuthStatus(AUTH_STATUSES.AUTHORIZED);
          throw error;
        }
      },
      getAuthorizedUserData() {
        return sessionActions.getAuthorizedUserData();
      },
      checkIfCurrentAuthorizedUser(userId: string) {
        const { id: authorizedId } = this.getAuthorizedUserData();

        return authorizedId === userId;
      },
      getUserRoles() {
        return sessionActions.getUserRoles();
      },
      getUserPermissions(siteId = '') {
        const { orgId: selectedOrgId } = useOrganizationFromHandle();
        const checkSomeRole = (userRole: string) => this.getUserRoles().some((role) => role.includes(userRole));
        const getUserRoleScopeIds = (userRole: string) => {
          return this.getUserRoles()
            .filter((role) => role.includes(userRole))
            .map((role) => role.replace(`${userRole}_`, ''));
        };

        const isDelosAdmin = this.getUserRoles().includes(USER_ROLES.TSM || USER_ROLES.DELOS_ADMIN);
        const isSomeOrgAdmin = checkSomeRole(USER_ROLES.ORG_ADMIN);
        const isSomeSiteAdmin = checkSomeRole(USER_ROLES.SITE_ADMIN);
        const isSomeSiteExternalAdmin = checkSomeRole(USER_ROLES.SITE_EXTERNAL);

        return {
          isDelosAdmin,
          isSomeOrgAdmin,
          isSomeSiteAdmin,
          isSomeSiteExternalAdmin,
          isCurrentOrgAdmin: getUserRoleScopeIds(USER_ROLES.ORG_ADMIN).includes(selectedOrgId),
          isCurrentSiteAdmin: getUserRoleScopeIds(USER_ROLES.SITE_ADMIN).includes(siteId),
          isCurrentSiteExternalAdmin: getUserRoleScopeIds(USER_ROLES.SITE_EXTERNAL).includes(siteId),
          hasSomeAccess: isDelosAdmin || isSomeOrgAdmin || isSomeSiteAdmin || isSomeSiteExternalAdmin,
        };
      },
    }),
    [authStatus],
  );

  return [authStatus, api];
}
