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
      className={`fixed top-0 left-0 -z-10 w-full bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${src})`, height: '100dvh' }}
    />
  );
};

export default BackgroundImage;
