import React from 'react';
import HeroImg from './images/Hero.svg?react';

const HeroSection = () => {
  return (
    <div className="flex items-center gap-[38px] py-10">
      <div className="flex h-full flex-col justify-center">
        <span className="text-h0 font-bold text-[#101828]">Welcome to WellCube</span>
        <p className="text-body mt-6 leading-6 text-grey-600">
          {
            'Better work begins here. WellCube introduces hyper-localized air purification and environmental quality data to your office.'
          }
        </p>
        <p className="text-body mt-4 leading-6 text-grey-600">
          {
            "To help you keep up with the new demands of employees and office spaces, we're a network of tabletop solutions that can help you understand and improve the health of your space."
          }
        </p>
      </div>
      <div>
        <HeroImg />
      </div>
    </div>
  );
};

export default HeroSection;
