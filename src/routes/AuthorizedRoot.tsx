import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useSession, { AUTH_STATUSES } from '../api-hooks/session/useSession';
import LeftNav from '../components/LeftNav/LeftNav';
import { RoutesMap } from '@components/LeftNav/RoutesMapping';
import TitleOnScroll from '../components/TitleOnScroll/TitleOnScroll';
import TopNav from '../components/TopNav/TopNav';
import { getLastPathnameSegment } from '../utils/urlUtils';
import { useAppNav } from '../contexts/AppNavContext/AppNavContext';
import RightPanel from '../components/RightPanel/RightPanel';
import { useScrollContext } from '../contexts/ScrollContext';
import clsx from 'clsx';
import DevOnlyLayoutClassHelper from '../components/DevOnlyLayoutClassHelper';
import AdminRoot from './admin/AdminRoot';

export interface AuthorizedRootProps {
  useNewTemplate?: boolean;
}

export const AuthorizedRoot: React.FC<AuthorizedRootProps> = () => {
  const [authStatus, sessionAPI] = useSession();

  const appNav = useAppNav();
  const titleScroll = useScrollContext();
  const { leftNavState } = appNav;
  const { hasSomeAccess } = sessionAPI.getUserPermissions();
  const isLeftNavHidden = leftNavState === 'hidden';

  const { pathname } = useLocation();
  const path = getLastPathnameSegment(pathname) ?? '';

  const route = RoutesMap[path];

  useEffect(() => {
    // if (!hasSomeAccess) appNav.hideLeftNav();

    return () => appNav.expandLeftNav();
  }, []);

  if (authStatus !== AUTH_STATUSES.AUTHORIZED) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      data-page={route?.page}
      data-left-nav={appNav.leftNavState}
      data-top-nav={titleScroll.isVisibleElement ? 'visible' : 'hidden'}
      data-right-panel={appNav.isRightPanelVisible ? 'visible' : 'hidden'}
      data-rpanel-state={appNav.rightPanelState}
      className={clsx(
        'flex max-h-screen min-h-screen flex-col',
        'pt-[var(--topnav-height)]',
        appNav.leftNavState === 'expanded' && !isLeftNavHidden && 'l1',
        (appNav.leftNavState === 'collapsed' || isLeftNavHidden) && 'l0',
        appNav.leftNavState === 'overlay' && 'l0',
        // !appNav.isRightPanelVisible && 'r0',
        // appNav.isRightPanelVisible && 'r1',
        appNav.rightPanelState === 'hidden' && 'r0',
        appNav.rightPanelState === 'default' && 'r1',
        appNav.rightPanelState === 'full' && 'r2',
        appNav.rightPanelState === 'overlay' && 'r2',
      )}
    >
      <DevOnlyLayoutClassHelper
        leftNavState={appNav.leftNavState}
        isRightPanelVisible={appNav.isRightPanelVisible}
        rightPanelState={appNav.rightPanelState}
      />
      <TopNav />
      <div className="sticky flex max-h-[calc(100vh-var(--topnav-height))] min-w-0 flex-[1_1_auto] ">
        {!isLeftNavHidden && <LeftNav />}
        <div className="relative flex min-w-0 flex-1 flex-col ">
          <div
            className={clsx(
              'overflow relative isolate flex min-w-[3rem] flex-[1_1_auto] flex-col overflow-auto transition-all',
              // l0r0
              '[.l0.r0_&]:pl-[var(--left-l0r0-inset)]',
              '[.l0.r0_&]:pr-[var(--right-l0r0-inset)]',
              // l1r0
              '[.l1.r0_&]:pl-[var(--left-l1r0-inset)]',
              '[.l1.r0_&]:pr-[var(--right-l1r0-inset)]',
              // l0r1
              '[.l0.r1_&]:pl-[var(--left-l0r1-inset)]',
              '[.l0.r1_&]:pr-[var(--right-l0r1-inset)]',
              // l1r1
              '[.l1.r1_&]:pl-[var(--left-l1r1-inset)]',
              '[.l1.r1_&]:pr-[var(--right-l1r1-inset)]',
              // l0r2
              '[.l0.r2_&]:pl-[var(--left-l0r2-inset)]',
              '[.l0.r2_&]:pr-[var(--right-l0r2-inset)]',
              // l1r2
              '[.l1.r2_&]:pl-[var(--left-l1r2-inset)]',
              '[.l1.r2_&]:pr-[var(--right-l1r2-inset)]',
            )}
          >
            <TitleOnScroll />
            <div className="isolate mx-auto mb-[6rem] mt-[var(--content-top-space)] flex w-full max-w-[var(--content-max-lg)]  flex-1 flex-col ">
              {/* 553px is the minimum width of the center content area when the browser window is 1024px wide. */}
              <div className="relative flex min-w-[553px] flex-1 flex-col">
                {hasSomeAccess ? <AdminRoot /> : <Outlet />}
              </div>
            </div>
          </div>
        </div>
        <RightPanel />
      </div>
    </div>
  );
};

export default AuthorizedRoot;
