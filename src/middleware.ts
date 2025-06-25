import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { USER_ROLES } from "@/lib/auth-utils"

// 관리자 전용 경로 정의
const ADMIN_PATHS = [
  '/admin',
  '/admin/articles',
  '/admin/users',
  '/admin/reports',
]

// 로그인이 필요한 사용자 경로 정의
const PROTECTED_PATHS = [
  '/myplants',
  '/mygarden', 
  '/diaries/upload',
  '/galleries/upload',
  '/articles/upload',
  '/events/upload'
]

export default async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl
  
  // 로그인이 필요한 페이지 체크
  if (PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  // 관리자 전용 페이지 체크
  if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
    // 로그인 안된 상태
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // 관리자가 아닐 경우
    if (session.user.role !== USER_ROLES.ADMIN) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// 미들웨어가 실행될 경로 지정
export const config = {
  matcher: [
    // 관리자 페이지
    '/admin/:path*',
    // 로그인이 필요한 사용자 페이지
    '/myplants/:path*',
    '/mygarden/:path*',
    '/diaries/upload/:path*',
    '/galleries/upload/:path*', 
    '/articles/upload/:path*',
    '/events/upload/:path*',
  ],
} 