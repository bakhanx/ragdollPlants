'use client';

import { UploadButton } from '@/app/_components/common/UploadButton';

export const AdminUploadButton = ({ isAdmin }: { isAdmin: boolean }) => {
  if (!isAdmin) {
    return null;
  }

  return (
    <UploadButton
      link="/articles/upload"
      title="기사 등록"
    />
  );
};
