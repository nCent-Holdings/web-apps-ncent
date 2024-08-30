import React from 'react';
import HeroSection from './hero-section/HeroSection';
import GuidingNavigation from './guiding-navigation/GuidingNavigation';
import BlogSection from './blog-section/BlogSection';
import Notification from './notification/Notification';

export const ClientHome = () => {
  return (
    <>
      <div className="mx-auto h-screen w-full max-w-[64.5rem]">
        <Notification />
        <HeroSection />
        <GuidingNavigation />
        <BlogSection />
      </div>
    </>
  );
};

export default ClientHome;
