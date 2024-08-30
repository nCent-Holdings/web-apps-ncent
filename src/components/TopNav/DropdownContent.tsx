import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '../Dropdown/Dropdown';
import { twMerge } from 'tailwind-merge';
import useOutsideClickHandler from '@src/hooks/useOutsideClickHandler';

interface DropdownContentProps {
  menuItems: MenuItem[];
  widthContainer?: string;
  classExtendContainer?: string;
  classExtendDropdownContent?: string;
  positionArrow?: 'left' | 'right' | 'center';
  positionMenu?: 'left' | 'right' | 'center';
  onClickOutside?: () => void;
}

export type MenuItem = {
  name: string;
  [key: string]: any; // allow any additional props
};

type MenuItemsRenderMap = {
  [key: string]: (item: MenuItem, isLastItem: boolean) => JSX.Element | null;
};

export const DropdownContent = ({
  menuItems,
  widthContainer = 'w-auto',
  classExtendContainer,
  classExtendDropdownContent,
  positionMenu = 'right',
  positionArrow = 'center',
  onClickOutside,
}: DropdownContentProps) => {
  const wrapDropdownRef = React.useRef(null);
  const menuItemsRenderMap: MenuItemsRenderMap = {
    link: (item: MenuItem, isLastItem) => (
      <Link
        key={item.name}
        to={item.link}
        className={twMerge(
          `block cursor-pointer ${
            !isLastItem ? 'border-b border-[#D4DFE9]' : ''
          } flex cursor-pointer items-center px-5 py-3 text-[.875rem] font-semibold normal-case leading-[1.25] text-black-soft`,
          item?.classExtend,
        )}
      >
        {item.name}
      </Link>
    ),
    handleClick: (item: MenuItem, isLastItem) => (
      <button
        key={item.name}
        onClick={item.handleClick}
        className={twMerge(
          `flex w-full cursor-pointer items-center px-5 py-3 text-[.875rem] font-semibold normal-case leading-[1.25] text-black-soft ${
            !isLastItem ? `border-b ${item?.classDividerExtend ? item?.classDividerExtend : 'border-[#D4DFE9]'}` : ''
          }`,
          item?.classExtend,
        )}
      >
        {item.name}
      </button>
    ),
    externalLink: (item: MenuItem, isLastItem) => (
      <a
        key={item.name}
        target="_blank"
        rel="noreferrer"
        href={item.externalLink}
        className={`block cursor-pointer ${
          !isLastItem ? 'border-b border-[#D4DFE9]' : ''
        } flex cursor-pointer items-center px-5 py-3 text-[.875rem] font-semibold normal-case leading-[1.25] text-black-soft`}
      >
        {item.name}
      </a>
    ),
    component: (item: MenuItem) => {
      return <>{item.component}</>;
    },
  };

  const handleClickOutside = () => {
    if (onClickOutside) onClickOutside();
  };

  useOutsideClickHandler(wrapDropdownRef, () => {
    handleClickOutside();
  });

  return (
    <div ref={wrapDropdownRef} className={twMerge('isolate', classExtendDropdownContent)}>
      <Dropdown
        width={widthContainer}
        classExtend={classExtendContainer}
        positionMenu={positionMenu}
        positionArrow={positionArrow}
      >
        <ul>
          {menuItems.map((item, index) => {
            const renderFunction = Object.keys(item).find((key) => key !== 'name');
            if (!renderFunction) {
              return null;
            }

            const isLastItem = menuItems.length - 1 === index;

            const renderMenuItem = menuItemsRenderMap[renderFunction as keyof MenuItemsRenderMap];
            return renderMenuItem ? renderMenuItem(item, isLastItem) : null;
          })}
        </ul>
      </Dropdown>
    </div>
  );
};

export default DropdownContent;
