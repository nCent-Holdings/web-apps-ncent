import React from 'react';
import LogoWellcube from './icons/logo-wellcube-sm.svg?react';
import useSession from '../../api-hooks/session/useSession';
import Logo from '../Logo/Logo';
import { CLOUD_ROLES } from '../../api/CloudAPI/models';
import { useNavigate } from 'react-router-dom';
import TopRightNav from './TopRightNav';
import { useAppNav } from '../../contexts/AppNavContext/AppNavContext';
import clsx from 'clsx';

export const TopNav = () => {
  const appNav = useAppNav();
  const navigate = useNavigate();
  const [, sessionAPI] = useSession();
  const { role } = sessionAPI.getAuthorizedUserData();
  const roleRedirects: Record<CLOUD_ROLES, () => void> = {
    ADMIN: () => navigate('/sales'),
    USER: () => navigate('/organization'),
  };

  const handleLogoClicked = () => {
    roleRedirects[role];
  };

  return (
    <div
      className={clsx(
        'fixed left-0 right-0 top-0 z-[9] flex h-[var(--topnav-height)] flex-[0_0_auto] border-b border-b-[#D4DFE9] bg-white ',
      )}
    >
      <div className="flex flex-1 items-center">
        <div className="pl-[.88rem] pr-[1.19rem]">
          <Logo path={'/'} handleClick={handleLogoClicked}>
            <LogoWellcube />
          </Logo>
        </div>

        <div>{appNav.topNavContent}</div>
      </div>

      <TopRightNav />
    </div>
  );
};

export default TopNav;
