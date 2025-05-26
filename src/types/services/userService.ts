/**
 * User 관련 서비스 레이어 타입 정의
 */

import { User, UserPreview, UserCreateInput, UserUpdateInput, PlantInterest } from '../models/user';

/**
 * 사용자 필터링 옵션
 */
export interface UserFilterOptions {
  searchQuery?: string;
  level?: number;
  interests?: PlantInterest[];
  minFollowers?: number;
  minLevel?: number;
  limit?: number;
  offset?: number;
}

/**
 * 사용자 정렬 옵션
 */
export type UserSortOption = 'name' | 'level' | 'followers' | 'posts' | 'createdAt';

/**
 * 정렬 방향
 */
export type SortDirection = 'asc' | 'desc';

/**
 * 페이지네이션 결과
 */
export interface PaginatedUsers {
  users: UserPreview[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

/**
 * 팔로우 관계
 */
export interface FollowRelation {
  followerId: string;
  followingId: string;
  createdAt: string;
}

/**
 * 사용자 서비스 인터페이스
 */
export interface UserService {
  getAllUsers(options?: UserFilterOptions): Promise<PaginatedUsers>;
  getUserById(id: string): Promise<User | null>;
  getCurrentUser(): Promise<User | null>;
  createUser(data: UserCreateInput): Promise<User>;
  updateUser(id: string, data: UserUpdateInput): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
  followUser(followerId: string, followingId: string): Promise<boolean>;
  unfollowUser(followerId: string, followingId: string): Promise<boolean>;
  getFollowers(userId: string): Promise<UserPreview[]>;
  getFollowing(userId: string): Promise<UserPreview[]>;
  updateLevel(userId: string, experience: number): Promise<User>;
} 