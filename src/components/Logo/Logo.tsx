import React from 'react';
import { Link } from 'react-router-dom';
import { LogoProps } from './types';

const Logo = ({ path = '/', logoName, format, handleClick, children, ...props }: LogoProps) => {
  return (
    <Link to={path} onClick={handleClick} {...props}>
      {logoName ? <img src={`/${logoName + format}`} /> : children}
    </Link>
  );
};

export default Logo;
