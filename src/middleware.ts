import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 사용자 역할 정의
const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN'
} as const;

// 관리자 전용 경로 정의
const ADMIN_PATHS = [
  '/admin',
  '/articles/upload',
  '/articles/[id]/edit',
  '/events/upload',
  '/events/[id]/edit'
];

// 로그인이 필요한 사용자 경로 정의
const PROTECTED_PATHS = [
  '/garden/profile',
  '/diaries/upload',
  '/galleries/upload'
];

export default async function middleware(request: NextRequest) {
  // JWT 토큰 검증
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // NextAuth 세션 형태로 변환
  const session = token
    ? {
        user: {
          id: token.id as string,
          loginId: token.loginId as string,
          role: token.role as 'USER' | 'ADMIN',
          name: token.name as string,
          email: token.email as string
        }
      }
    : null;

  const { pathname } = request.nextUrl;

  // 이미 로그인한 사용자가 /login에 접근하면 메인으로 리다이렉트
  if (pathname === '/login' && session?.user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 관리자 전용 페이지 체크 (동적 경로 포함)
  if (
    ADMIN_PATHS.some(path => {
      if (path.includes('[id]')) {
        // 동적 경로 패턴 매칭
        const pattern = path.replace(/\[id\]/g, '[^/]+');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(pathname);
      }
      return pathname.startsWith(path);
    })
  ) {
    // 로그인 안된 상태
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // 관리자가 아닐 경우
    if (session.user.role !== USER_ROLES.ADMIN) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 로그인이 필요한 페이지 체크
  if (PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 지정
export const config = {
  matcher: [
    '/login',
    // 관리자 페이지
    '/admin/:path*',
    '/articles/upload/:path*',
    '/articles/:id/edit',
    '/events/upload/:path*',
    '/events/:id/edit',
    // 로그인이 필요한 사용자 페이지
    '/garden/profile/:path*',
    '/diaries/upload/:path*',
    '/galleries/upload/:path*'
  ]
};
