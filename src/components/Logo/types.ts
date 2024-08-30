import { ReactNode } from 'react';

export interface LogoProps {
  path?: string;
  logoName?: string;
  format?: string;
  handleClick?: () => void;
  children?: ReactNode;
}
