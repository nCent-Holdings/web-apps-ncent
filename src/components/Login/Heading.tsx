import React from 'react';

const icons = {
  email: 'icons/login/email.svg?react',
  success: 'icons/login/success.svg?react',
  failure: 'icons/login/failure.svg?react',
  expired: 'icons/login/expired.svg?react',
};

export interface HeadingProps {
  icon: 'email' | 'success' | 'failure' | 'expired';
  heading: string;
  subheading: string;
}

export const Heading: React.FC<HeadingProps> = ({ icon, heading, subheading }) => {
  return (
    <>
      <img className="max-sm:h-40" src={icons[icon]} />
      <p className="mt-8 text-center font-spezia text-h2 text-grey-900">{heading}</p>
      <p className="mt-3 w-[360px] text-center font-spezia text-bdy text-grey-600">{subheading}</p>
    </>
  );
};

export default Heading;
