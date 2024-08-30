import React from 'react';
import useSession, { AUTH_STATUSES } from '../api-hooks/session/useSession';
import { Navigate, Outlet } from 'react-router-dom';
import LoginLayout from './login/LoginLayout';

export const UnauthorizedRoot: React.FC = () => {
  const [authStatus] = useSession();
  if (authStatus === AUTH_STATUSES.AUTHORIZED) {
    return <Navigate to="/" />;
  }

  return (
    <LoginLayout>
      <Outlet />
    </LoginLayout>
  );
};

export default UnauthorizedRoot;
