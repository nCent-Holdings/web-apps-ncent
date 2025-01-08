import useSession from '../../api-hooks/session/useSession';
import React, { useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppNav } from '@src/contexts/AppNavContext/AppNavContext';
import LeftNavAdmin from '../../components/LeftNav/LeftNavAdmin';
import { getLastPathnameSegment } from '@src/utils/urlUtils';

export const AdminRoot = () => {
  const appNav = useAppNav();
  const [, sessionAPI] = useSession();

  const { isNcentAdmin } = sessionAPI.getUserPermissions();

  const { pathname } = useLocation();
  const path = getLastPathnameSegment(pathname) ?? '';
  const navigate = useNavigate();

  useLayoutEffect(() => {
    //    if (!isNcentAdmin) {
    //      appNav.setLeftNavContent(<></>);
    //      appNav.setTopNavContent(<></>);
    //    } else {
    appNav.setLeftNavContent(<LeftNavAdmin />);
    appNav.setTopNavContent(<></>);
    //    }
  }, []);

  useEffect(() => {
    if (path === '' && isNcentAdmin) {
      // TODO: Swap this out for a user-defined 'default' landing page
      navigate('/brandlist');
    } else if (path === '') {
      navigate('/dashboard');
    }
  }, [path]);

  return <Outlet />;
};

export default AdminRoot;
