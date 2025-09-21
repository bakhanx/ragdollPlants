import { getAdminUsers, UserListParams } from '@/app/actions/admin-users';
import UserTable from './UserTable';
import AdminPagination from '../common/AdminPagination';

interface UserListProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function UserList({ searchParams }: UserListProps) {
  const params: UserListParams = {
    page: searchParams.page ? parseInt(searchParams.page as string) : 1,
    limit: searchParams.limit ? parseInt(searchParams.limit as string) : 20,
    search: searchParams.search as string,
    status: searchParams.status as 'active' | 'inactive' | 'all',
    role: searchParams.role as 'USER' | 'ADMIN' | 'all',
    sort: searchParams.sort as 'createdAt' | 'name' | 'lastActivityDate',
    order: searchParams.order as 'asc' | 'desc'
  };

  try {
    const { users, pagination } = await getAdminUsers(params);

    return (
      <div className="space-y-4">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <UserTable users={users} />
        </div>
        
        {pagination.totalPages > 1 && (
          <AdminPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            baseUrl="/admin/users"
          />
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center">
          <p className="text-red-600 mb-2">사용자 목록을 불러오는 중 오류가 발생했습니다.</p>
          <p className="text-gray-500 text-sm">관리자에게 문의하세요.</p>
        </div>
      </div>
    );
  }
}
