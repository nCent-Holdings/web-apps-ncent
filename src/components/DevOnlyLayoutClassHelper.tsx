import React from 'react';
import clsx from 'clsx';

export interface DevOnlyLayoutClassHelperProps {
  leftNavState: string; // "expanded" | "collapsed" | "overlay"
  isRightPanelVisible?: boolean;
  rightPanelState: string; // "hidden" | "default" | "full"
  visible?: boolean;
}

// NOTE about this component:

// It's meant only to be used in development, of course.
// And it was created to be used in AuthorizedRoot.tsx

export const DevOnlyLayoutClassHelper = ({ leftNavState, rightPanelState, visible }: DevOnlyLayoutClassHelperProps) => {
  return (
    <>
      <div
        className={clsx(
          'fixed left-1/2 top-0 z-[1000] -translate-x-1/2 text-center font-[menlo]',
          !visible && 'hidden',
          visible && 'block',
        )}
      >
        <div
          className={clsx(
            'inline-block text-[18px] font-bold ',

            // l0r0
            '[.l0.r0_&]:bg-[pink]',
            // l1r0
            '[.l1.r0_&]:bg-[yellow]',
            // l0r1
            '[.l0.r1_&]:bg-[blue]/20',
            // l1r1
            '[.l1.r1_&]:bg-[orange]/40',
            // l0r2
            '[.l0.r2_&]:bg-[purple]/20',
            // l1r2
            '[.l1.r2_&]:bg-[turquoise]/40',
          )}
        >
          {'[.'}
          {leftNavState === 'expanded' && <span>l1</span>}
          {leftNavState === 'collapsed' && <span>l0</span>}
          {leftNavState === 'overlay' && <span>l0</span>}
          {'.'}
          {rightPanelState === 'hidden' && <span>r0</span>}
          {rightPanelState === 'default' && <span>r1</span>}
          {rightPanelState === 'full' && <span>r2</span>}

          {'_&]:'}
        </div>
        <div className="text-[12px]">
          {'('}
          {leftNavState === 'expanded' && (
            <span>
              leftnav <b>expanded</b>
            </span>
          )}
          {leftNavState === 'collapsed' && <span>leftnav collapsed</span>}
          {leftNavState === 'overlay' && <span>leftnav collapsed</span>}
          {' + '}
          {rightPanelState === 'hidden' && <span>rightpanel hidden</span>}
          {rightPanelState === 'default' && (
            <span>
              {' '}
              rightpanel <b>default</b>{' '}
            </span>
          )}
          {rightPanelState === 'full' && (
            <span>
              {' '}
              rightpanel <b>full</b>{' '}
            </span>
          )}
          {')'}
        </div>
      </div>
      <div
        className={clsx(
          ' pointer-events-none fixed inset-0 z-[1000] flex ',

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

          !visible && 'hidden',
          visible && 'block',
        )}
      >
        <div className=" mx-auto flex max-w-[var(--content-max-lg)] flex-1 flex-col items-center justify-center bg-blue-navy/20">
          <div
            className={clsx(
              'fixed bottom-0 left-0 top-0 bg-chart-coral-dark/20',

              // l0r0
              '[.l0.r0_&]:w-[var(--left-nav-width-collapsed)]',
              // l1r0
              '[.l1.r0_&]:w-[var(--left-nav-width)]',
              // l0r1
              '[.l0.r1_&]:w-[var(--left-nav-width-collapsed)]',
              // l1r1
              '[.l1.r1_&]:w-[var(--left-nav-width)]',
              // l0r2
              '[.l0.r2_&]:w-[var(--left-nav-width-collapsed)]',
              // l1r2
              '[.l1.r2_&]:w-[var(--left-nav-width)]',
            )}
          ></div>
          <div className="flex items-center justify-center text-[38px] font-semibold tracking-tight opacity-20 ">
            var(--content-max-lg)
          </div>
          <div className="fixed bottom-0 right-0 top-0 bg-gold-dark/20 [.l0.r0_&]:w-[var(--right-panel-width-hidden)] [.l0.r1_&]:w-[var(--right-panel-width)] [.l0.r2_&]:w-[var(--right-panel-width-full)] [.l1.r0_&]:w-[var(--right-panel-width-hidden)] [.l1.r1_&]:w-[var(--right-panel-width)] [.l1.r2_&]:w-[var(--right-panel-width-full)]"></div>
        </div>
      </div>
    </>
  );
};

export default DevOnlyLayoutClassHelper;
