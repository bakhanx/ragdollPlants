import { auth } from "@/auth"
import { redirect } from "next/navigation"

// 사용자 역할 정의
export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const

export type UserRole = keyof typeof USER_ROLES

/**
 * 현재 사용자가 관리자인지 확인
 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth()
  return session?.user?.role === USER_ROLES.ADMIN
}

/**
 * 관리자 전용 페이지 보호
 */
export async function requireAdmin() {
  const session = await auth()
  
  if (!session || session.user.role !== USER_ROLES.ADMIN) {
    redirect("/login")
  }
  
  return session
}

/**
 * 사용자가 일반 사용자인지 확인 (관리자가 아닌)
 */
export async function isRegularUser(): Promise<boolean> {
  const session = await auth()
  return session?.user?.role === USER_ROLES.USER
}

/**
 * 관리자에게 필요없는 필드들을 필터링
 */
export function filterUserFields(user: { 
  role: string, 
  following?: number,
  followers?: number,
  posts?: number,
  level?: number,
  levelProgress?: number,
  waterCount?: number,
  nutrientCount?: number,
  interests?: string[],
  [key: string]: unknown 
}) {
  if (user.role !== USER_ROLES.USER) {
    // 관리자는 식물 관련 필드 제거
    const { following, followers, posts, level, levelProgress, waterCount, nutrientCount, interests, ...adminUser } = user
    return adminUser
  }
  return user
} 