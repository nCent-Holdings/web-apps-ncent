import React from 'react';
import { useFullScreenColor } from '../../../../hooks/useFullScreenColor';
import { DataBlog } from './types';
import { dataNavigation } from './data';
import ArrowIcon from './images/ArrowIcon.svg?react';
import { Link } from 'react-router-dom';

export const BlogSection = () => {
  const fullScreenStyle = useFullScreenColor('#FFFF');

  const BlogCard = ({ image, title, content, link }: DataBlog) => (
    <Link className="flex basis-[265px]" target="_blank" to={link || 'https://www.delos.com'} rel="noopener noreferrer">
      <div className="flex transform flex-col items-center transition duration-500 hover:scale-110">
        <div className="mb-10 w-full">
          <img src={image as string}></img>
        </div>
        <div className="flex">
          <p className="my-4 mt-0 basis-48 text-h4 font-bold text-[#101828]">{title}</p>
          <span className="ml-auto">
            <ArrowIcon />
          </span>
        </div>
        <p className="text-left">{content}</p>
      </div>
    </Link>
  );

  return (
    <div className="py-[3.75rem]" style={fullScreenStyle}>
      <div className="flex flex-col gap-[60px]">
        <h2 className="text-h2">Learn more about</h2>
        <div className="flex justify-between">
          {dataNavigation.map((data) => (
            <BlogCard key={data.title} image={data.image} title={data.title} content={data.content} link={data.link} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
