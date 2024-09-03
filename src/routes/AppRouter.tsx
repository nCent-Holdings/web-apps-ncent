import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AuthorizedRoot from './AuthorizedRoot';
import { OrgList, OrgProfile, OrgRouter, ManageSite, OrgSetup } from './admin/organizations';

import { DelosUsersRouter } from './admin/delos-users/DelosUsersRouter';
import { DelosUsersRoot } from './admin/delos-users/DelosUsersRoot';
import UnauthorizedRoot from './UnauthorizedRoot';
import { ForgotPassword, Login, SetNewPassword } from './login';
import CreateSalesManager from './create-account/CreateSalesManager';
import CreateOrgAdmin from './create-account/CreateOrgAdmin';
import { ClientRoot } from './client/ClientRoot';
import SiteDesign from './client/site-design';
import DeviceManagement from './client/device-management';
import ErrorPage from './ErrorPage';
import AdminRoot from './admin/AdminRoot';
import Partners from './admin/partners/Partners';
import ClientHome from './client/home/ClientHome';
import ClientReporting from './client/reporting/ClientReporting';
import ClientOrganization from './client/organization/ClientOrganization';
import ClientApiSettings from './client/api/ClientApiSettings';
import TermsAndConditions from './common/terms-and-conditions/TermsAndConditions';
import { DeviceDetailsContextProvider } from '@src/contexts/DeviceDetailsContext/DeviceDetailsContext';
import ClientUsers from './client/users/ClientUsers';
import MyAccount from './common/my-account';
import NoAccessPage from './NoAccessPage';
import BuyerRoot from './BuyerRoot';
import BuyerMain from './buyer/BuyerMain';

const appRouter = createBrowserRouter([
  {
    path: '/buyer',
    element: <BuyerRoot />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/buyer',
        element: <BuyerMain />,
      },
    ],
  },
  {
    path: '/',
    element: <AuthorizedRoot />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '*',
        element: <ErrorPage />,
      },
      {
        path: 'error',
        element: <ErrorPage />,
      },
      {
        path: 'no-access',
        element: <NoAccessPage />,
      },
      {
        path: 'my-account',
        element: <MyAccount />,
      },
      {
        path: '',
        element: <AdminRoot />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: 'terms-and-conditions',
            element: <TermsAndConditions />,
          },
          {
            path: 'organizations',
            element: <OrgRouter />,
            children: [
              {
                index: true,
                element: <OrgList />,
              },
              {
                path: 'new',
                element: <OrgSetup />,
              },
              {
                path: ':orgHandle',
                element: <OrgProfile />,
                errorElement: <ErrorPage />,
              },
              {
                path: ':orgHandle/sites/new',
                element: <ManageSite />,
              },
              {
                path: ':orgHandle/sites/:siteHandle',
                element: <ManageSite />,
              },
            ],
          },
          {
            path: 'notifications',
            element: <div>EMPTY NOTIFICATIONS</div>,
          },
          {
            path: 'delos-users',
            element: <DelosUsersRouter />,
            children: [
              {
                index: true,
                element: <DelosUsersRoot />,
              },
            ],
          },
          {
            path: 'partners',
            element: <Partners />,
          },
          {
            path: 'logout',
            element: <div>LOGOUT</div>,
          },
        ],
      },
      // This needs to go last b/c it acts as a fallback. If the user is authorized and are at a
      // subdirectory that doesn't map to anything specific, then assume it's a client
      {
        path: ':orgHandle',
        element: <ClientRoot />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: 'my-account',
            element: <MyAccount />,
          },
          {
            path: 'organization',
            element: <ClientOrganization />,
          },
          {
            path: 'terms-and-conditions',
            element: <TermsAndConditions />,
          },
          {
            path: 'users',
            element: <ClientUsers />,
          },
          {
            path: ':siteHandle',
            children: [
              {
                path: 'home',
                element: <ClientHome />,
              },
              {
                path: 'reporting',
                element: <ClientReporting />,
              },
              {
                path: 'devices',
                element: (
                  <DeviceDetailsContextProvider>
                    <DeviceManagement />
                  </DeviceDetailsContextProvider>
                ),
              },
              {
                path: 'system-design',
                element: <SiteDesign />,
              },
              {
                path: 'api',
                element: <ClientApiSettings />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <UnauthorizedRoot />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/buyer',
        element: <BuyerMain />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/set-new-password',
        element: <SetNewPassword />,
      },
      {
        path: '/register',
        children: [
          {
            path: 'sales-manager',
            element: <CreateSalesManager />,
          },
          {
            path: 'new-user',
            element: <CreateOrgAdmin />,
          },
        ],
      },
      // Catch-all route for rendering ErrorPage for unmatched routes
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

export default appRouter;
