import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

export interface LeftNavLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: JSX.Element;
  to?: string;
  href?: string;
  label?: string | ReactNode;
  target?: string;
  children?: ReactNode;
  classExtend?: string;
  hideNavLink?: boolean;
}

export const LeftNavLink = ({ to, href, target, children, classExtend, hideNavLink }: LeftNavLinkProps) => {
  if (!href && !to) {
    return <div>{`INVALID - YOU MUST SPECIFY EITHER 'href' or 'to'`}</div>;
  }

  if (hideNavLink) return <></>;

  return (
    <div className={clsx('leftnav-item peer', classExtend)}>
      {href && !to && (
        <a
          className="relative isolate flex h-full w-full flex-1 leftnav-expanded:md:justify-start "
          href={href}
          target={target}
        >
          {children}
        </a>
      )}
      {!href && to && (
        <Link to={to} target={target}>
          {children}
        </Link>
      )}
    </div>
  );
};

export default LeftNavLink;
