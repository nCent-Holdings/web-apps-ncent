import React, { useEffect } from 'react';
import useUserCloudData from '@src/api-hooks/session/useUserCloudData';
import useSession from '@src/api-hooks/session/useSession';
import { useNavigate } from 'react-router-dom';

export const NoAccessPage = () => {
  const userCloudData = useUserCloudData();
  const [, sessionAPI] = useSession();
  const navigate = useNavigate();

  const { hasSomeAccess } = sessionAPI.getUserPermissions();

  useEffect(() => {
    if (hasSomeAccess) navigate('/');
  }, []);

  return (
    <div className="mt-24 flex flex-col items-center justify-center" id="error-page">
      <img src="icons/login/failure.svg?react" />
      <h2 className="mt-12 text-h1 font-semibold text-[#344054]">Something isn&apos;t right</h2>
      <div className="mt-4 max-w-[536px] text-center">
        <p className="mb-5">
          The WellCube profile for <span className="font-semibold">{userCloudData?.email}</span> is not associated with
          any active organization.{' '}
        </p>
        <p>Contact your organization&apos;s admin to determine how to obtain access.</p>
      </div>
    </div>
  );
};

export default NoAccessPage;
