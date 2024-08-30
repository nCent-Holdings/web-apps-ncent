import useSession from '../../api-hooks/session/useSession';
import React, { useEffect, useLayoutEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppNav } from '@src/contexts/AppNavContext/AppNavContext';
import LeftNavAdmin from '../../components/LeftNav/LeftNavAdmin';
import { ClientRoot } from '../client/ClientRoot';
import { getLastPathnameSegment } from '@src/utils/urlUtils';

export const AdminRoot = () => {
  const appNav = useAppNav();
  const [, sessionAPI] = useSession();

  const { isDelosAdmin, isSomeOrgAdmin, isSomeSiteAdmin, isSomeSiteExternalAdmin } = sessionAPI.getUserPermissions();

  const { pathname } = useLocation();
  const path = getLastPathnameSegment(pathname) ?? '';
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!isDelosAdmin) {
      appNav.setLeftNavContent(<></>);
      appNav.setTopNavContent(<></>);
    } else {
      appNav.setLeftNavContent(<LeftNavAdmin />);
      appNav.setTopNavContent(<></>);
    }
  }, []);

  useEffect(() => {
    if (path === '' && isDelosAdmin) {
      // TODO: Swap this out for a user-defined 'default' landing page
      navigate('/organizations');
    }
  }, [path]);

  if (isDelosAdmin) {
    return <Outlet />;
  } else if (isSomeOrgAdmin || isSomeSiteAdmin || isSomeSiteExternalAdmin) {
    return <ClientRoot />;
  } else {
    return <Navigate to="/no-access" />;
  }
};

export default AdminRoot;
