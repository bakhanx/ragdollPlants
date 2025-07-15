import React from 'react';
import { getCurrentUser } from '@/lib/auth-utils';
import EditProfile from './EditProfile';

export async function EditProfileWrapper() {
  const session = await getCurrentUser();

  return (
    <EditProfile
      userInfo={{
        id: session.id,
        email: session.email || '',
        name: session.name || null,
      }}
    />
  );
}