import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-utils';

export default async function MyGardenPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/signin');
  }
  
  redirect(`/mygarden/${user.id}`);
}