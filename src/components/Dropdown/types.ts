import React from 'react';

export interface DropdownProps {
  width?: string;
  children: React.ReactNode;
  classExtend?: string;
  positionMenu?: 'left' | 'right' | 'center';
  positionArrow?: 'left' | 'right' | 'center';
}
