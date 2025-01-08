// HorizontalSlider.tsx
import React from 'react';
import Slider from 'react-slick';

interface HorizontalSliderProps {
  children: React.ReactNode;
}

const HorizontalSlider: React.FC<HorizontalSliderProps> = ({ children }) => {
  // Basic settings for react-slick
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4, // show 3 items per screen (adjust as needed)
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // for smaller screens
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <div className="w-full">
      <Slider {...settings}>{children}</Slider>
    </div>
  );
};

export default HorizontalSlider;
