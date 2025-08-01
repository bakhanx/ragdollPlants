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
      className={`fixed top-0 left-0 -z-10 h-full w-full bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${src})` }}
    />
  );

  // Next/Image
  // return (
  //   <div className={`fixed left-0 top-0 -z-10 h-full w-full overflow-hidden ${className}`}>
  //     <Image
  //       src={src}
  //       alt="배경 이미지"
  //       fill
  //       className="object-cover object-center"
  //       priority
  //       sizes="100vw"
  //     />
  //   </div>
  // );
};

export default BackgroundImage;
