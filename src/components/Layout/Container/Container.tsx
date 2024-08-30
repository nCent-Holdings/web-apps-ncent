import React from 'react';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

const Container: React.FC<Props> = ({ children, className, ...props }) => {
  return (
    <div className={` ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Container;
