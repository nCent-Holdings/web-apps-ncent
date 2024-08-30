import React, { useLayoutEffect, useState } from 'react';
import clsx from 'clsx';
import { DrawerProps } from './types';
import Icon from '../Icon/Icon';

const Drawer = ({ bgColor = 'bg-blue-lightShade', widthNav, isNavCollapsed, handleCloseDrawer }: DrawerProps) => {
  const [elementWidth, setElementWidth] = useState<string>('');
  const offset = 16;

  useLayoutEffect(() => {
    let adjustedWidth = Number(widthNav);
    if (isNavCollapsed) {
      adjustedWidth -= offset;
    }
    setElementWidth(`${adjustedWidth}px`);
  }, [widthNav, isNavCollapsed]);

  const handleClose = () => {
    handleCloseDrawer && handleCloseDrawer();
  };

  return (
    <div
      className="shadow-com-navbar-outline linea absolute z-50 flex h-screen w-[227px] flex-col rounded-card transition-all duration-200 ease-linear"
      style={{ left: elementWidth }}
    >
      <div className="flex-1">
        <div className={clsx('flex h-screen flex-col justify-start gap-12 p-4 pb-20 pt-[10px]', bgColor)}>
          <div className="flex justify-end" onClick={handleClose}>
            <div className="flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-full bg-white">
              <Icon inactiveIconSrc="/icons/closeIcon.svg?react" className="w-[10px]" />
            </div>
          </div>
          <>
            <div className="text-black">item1</div>
            <div className="text-black">item2</div>
            <div className="text-black">item3</div>
            <div className="text-black">item4</div>
          </>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
