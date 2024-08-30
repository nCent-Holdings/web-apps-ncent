import React from 'react';
import clsx from 'clsx';
import { useAppNav } from '../../contexts/AppNavContext/AppNavContext';
import { isEmpty } from 'lodash';

export const TitleOnScroll = () => {
  const appNav = useAppNav();

  //Check if content is empty
  if (React.isValidElement(appNav.stickyHeaderContent) && isEmpty(appNav.stickyHeaderContent.props)) {
    return null;
  }

  return (
    <div
      className={clsx(
        'titleonscroll pointer-events-none fixed left-0 right-0 isolate z-[999] mb-[-1.5rem] flex h-[var(--titleonscroll-height)] items-center bg-white-background opacity-0 before:absolute before:-bottom-2 before:left-0 before:right-0 before:h-2 before:bg-gradient-com-title-on-scroll topnav-hidden:pointer-events-auto topnav-hidden:opacity-100 topnav-hidden:transition-all',
        'top-[var(--topnav-height)]',

        // l0r0
        '[.l0.r0_&]:pl-[calc(var(--left-l0r0)-var(--left-nav-width-collapsed))]',
        '[.l0.r0_&]:left-[var(--left-nav-width-collapsed)]',

        '[.l0.r0_&]:pr-[var(--right-l0r0)]',
        '[.l0.r0_&]:right-0',

        // l1r0
        '[.l1.r0_&]:pl-[var(--layout-inset)]',
        '[.l1.r0_&]:left-[var(--left-l1r0)]',

        '[.l1.r0_&]:pr-[var(--layout-inset)]',
        '[.l1.r0_&]:right-0',

        // l0r1
        '[.l0.r1_&]:pl-0',
        '[.l0.r1_&]:left-[var(--left-nav-width-collapsed)]',

        '[.l0.r1_&]:pr-0',
        '[.l0.r1_&]:right-[var(--right-panel-width)]',

        // l1r1
        '[.l1.r1_&]:pl-[var(--layout-inset)]',
        '[.l1.r1_&]:left-[var(--left-l1r1)]',

        '[.l1.r1_&]:pr-[var(--layout-inset)]',
        '[.l1.r1_&]:right-[var(--right-panel-width)]',

        // l0r2
        '[.l0.r2_&]:pl-0',
        '[.l0.r2_&]:left-[var(--left-nav-width-collapsed)]',

        '[.l0.r2_&]:pr-0',
        '[.l0.r2_&]:right-[var(--right-panel-width-full)]',

        // l1r2
        '[.l1.r2_&]:pl-[var(--layout-inset)]',
        '[.l1.r2_&]:left-[var(--left-l1r2)]',

        '[.l1.r2_&]:pr-[var(--layout-inset)]',
        '[.l1.r2_&]:right-[var(--right-panel-width-full)]',
      )}
    >
      <div
        className={clsx(
          'mx-auto flex w-full transition ',
          // l0r1
          '[.l0.r1_&]:pl-[var(--logo-area-width)]',
          '[.l0.r1_&]:pr-[var(--logo-area-width)]',
          // l0r2
          '[.l0.r2_&]:pl-[var(--logo-area-width)]',
          '[.l0.r2_&]:pr-[var(--logo-area-width)]',
        )}
      >
        <div className="mx-auto w-full  max-w-[var(--content-max-lg)] transition">{appNav.stickyHeaderContent}</div>
      </div>
    </div>
  );
};

export default React.memo(TitleOnScroll);
