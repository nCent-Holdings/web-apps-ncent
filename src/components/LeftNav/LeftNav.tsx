import clsx from 'clsx';
import React from 'react';
import IconAngleSmLeft from './icons/icon-angle-sm-left.svg?react';
import IconAngleSmRight from './icons/icon-angle-sm-right.svg?react';
import { useAppNav } from '../../contexts/AppNavContext/AppNavContext';
import LeftNavLink from './LeftNavLink';
import { useParams } from 'react-router-dom';
import pack from '../../../package.json';

export interface LeftnavContainer {
  classExtend?: string;
  page?: string;
}

export const LeftNav = ({ classExtend }: LeftnavContainer) => {
  const appNav = useAppNav();
  const { leftNavState } = appNav;

  const isCollapsed = leftNavState != 'expanded';

  let termsRoute = '/terms-and-conditions';

  const { orgHandle } = useParams();

  if (orgHandle !== undefined) {
    termsRoute = `${orgHandle}/terms-and-conditions`;
  }

  const isDev = pack.version.toLowerCase().includes('dev');
  const renderVersion = () => {
    return (
      <div className=" absolute  w-full py-1 text-center font-[monospace] text-[10px] text-[#999] opacity-0 transition-opacity duration-1000  [.l1_&]:opacity-100 [[data-left-nav='overlay']:hover_&]:opacity-100">
        {pack.version}
      </div>
    );
  };

  return (
    <div
      className={clsx(
        'leftnav fixed bottom-0 top-[var(--topnav-height)] z-[1000] flex  flex-[0_0_auto]  pl-0 shadow-[0_0_0_1px_#C1DBEA] ',
        `${classExtend}`,
      )}
    >
      <div
        className={clsx(
          'leftnav__inner absolute inset-0 isolate z-[11] w-[var(--left-nav-width-collapsed)] bg-[#D4DFEA] transition-width duration-300',
          '[[data-left-nav="overlay"]:hover_&]:w-[var(--left-nav-width)]',

          // l1r0
          '[.l1.r0_&]:w-[var(--left-nav-width)]',
          // l1r1
          '[.l1.r1_&]:w-[var(--left-nav-width)]',
          // l1r2
          '[.l1.r2_&]:w-[var(--left-nav-width)]',
        )}
        onMouseEnter={appNav.overlayLeftNav}
        onMouseLeave={appNav.collapseLeftNavOverlay}
      >
        <div className=" flex h-[var(--leftnav-toggle-height)] items-center border-b border-r border-b-[#D4DFEA] border-r-[#C1DBEA] bg-[#F2F6FA] pl-[.8rem]">
          <button
            className={clsx(
              ' top-3 z-[1] flex h-7 w-7 transform items-center justify-center rounded-[.36844rem] border border-blue-brilliant ',
              !isCollapsed && 'bg-white text-blue-brilliant',
              isCollapsed && 'bg-blue-brilliant text-white',
            )}
            onClick={appNav.toggleLeftNav}
          >
            {isCollapsed && <IconAngleSmRight className="pointer-events-none h-[0.5rem] w-[0.5rem] fill-current" />}
            {!isCollapsed && <IconAngleSmLeft className="pointer-events-none h-[0.5rem] w-[0.5rem] fill-current" />}
          </button>
        </div>

        <div className="flex h-[calc(100vh-var(--topnav-height)-var(--leftnav-toggle-height))]  flex-1 flex-col ">
          <div className=" flex-1 overflow-y-auto overflow-x-hidden border-r border-r-[#C1DBEA] bg-white">
            <div
              className={clsx(
                'sticky  top-0 flex w-[var(--left-nav-width)] flex-1 flex-col opacity-0 transition-opacity duration-1000 [.l1_&]:opacity-100 [[data-left-nav="overlay"]:hover_&]:opacity-100',
              )}
            >
              {appNav.leftNavContent}
            </div>
          </div>
          <div
            className={clsx(
              'sticky bottom-0 flex-[0_0_auto] overflow-x-hidden border-r border-t border-r-[#C1DBEA] border-t-[#CEDAE7] bg-[#F8FCFF] text-[0.875rem] font-medium leading-[1.25] text-blue-brilliant',
              isCollapsed && 'hidden',
              !isCollapsed && 'block',
            )}
          >
            {isDev && renderVersion()}
            <LeftNavLink
              to={termsRoute}
              classExtend="w-[var(--left-nav-width)] px-4 opacity-0 transition-opacity duration-1000 [.l1_&]:opacity-100 [[data-left-nav='overlay']:hover_&]:opacity-100"
            >
              <div className="py-5">
                Terms & conditions /
                <br /> Privacy
              </div>
            </LeftNavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftNav;
