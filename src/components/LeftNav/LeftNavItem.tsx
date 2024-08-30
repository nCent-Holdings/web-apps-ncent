import React from 'react';
import { type ButtonHTMLAttributes, type ReactNode } from 'react';

export interface LeftNavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: JSX.Element;
  iconSel?: JSX.Element;
  label?: string | ReactNode;
  labelClassNames?: string;
  onClick?: () => void;
}

export const LeftNavItem = ({ icon, iconSel, label, labelClassNames, ...props }: LeftNavItemProps) => {
  return (
    <button type="button" {...props} className="block w-full text-black-soft " data-navitem={label}>
      <div className="flex h-[2.625rem] items-center px-2 text-left text-[0.875rem] leading-[1.15] hover:bg-[#E7ECF3] leftnav-item-selected:bg-blue-brilliant leftnav-item-selected:font-medium leftnav-item-selected:text-white">
        {icon && iconSel && (
          <div className="relative mr-1 h-[1.875rem] w-[1.875rem]">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-0 leftnav-item-selected:opacity-100 [&_svg]:fill-current ">
              {iconSel}
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform leftnav-item-selected:opacity-0">
              {icon}
            </div>
          </div>
        )}
        <div className={labelClassNames}> {label} </div>
      </div>
    </button>
  );
};

export default LeftNavItem;
