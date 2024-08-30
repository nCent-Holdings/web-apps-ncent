import React from 'react';
import { IconProps } from './types';

const Icon = ({
  active,
  activeIconSrc,
  altActive = 'active',
  inactiveIconSrc,
  altInactive = 'inactive',
  ...props
}: IconProps) => {
  return <img src={active ? activeIconSrc : inactiveIconSrc} alt={active ? altActive : altInactive} {...props} />;
};

export default Icon;
