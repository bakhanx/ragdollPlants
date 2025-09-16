import { NextResponse } from 'next/server';
import { checkIsAdmin } from '@/lib/auth-utils';

export async function GET() {
  try {
    const isAdmin = await checkIsAdmin();
    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error('관리자 권한 확인 오류:', error);
    return NextResponse.json({ isAdmin: false });
  }
}