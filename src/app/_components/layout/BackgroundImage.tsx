// import Image from 'next/image';
import React from 'react';

type BackgroundImageProps = {
  src: string;
  className?: string;
};

export const BackgroundImage = ({
  src,
  className = ''
}: BackgroundImageProps) => {
  // CSS
  return (
    <div
      className={`fixed top-0 left-0 -z-10 md:w-full md:h-full w-[768px] h-[1200px] bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${src})` }}
    />
  );
};

export default BackgroundImage;
