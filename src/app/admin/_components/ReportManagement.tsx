'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/_components/common/Button';

// 임시 타입 정의 (나중에 실제 API 연결 시 수정)
interface Report {
  id: string;
  reason: string;
  description?: string;
  contentType: 'article' | 'diary' | 'gallery' | 'event' | 'plant';
  contentId: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
  reporter: {
    id: string;
    name: string;
    email: string;
  };
  reviewer?: {
    id: string;
    name: string;
    email: string;
  };
}

const REPORT_REASONS = [
  { value: 'spam', label: '스팸/홍보' },
  { value: 'inappropriate', label: '부적절한 내용' },
  { value: 'harassment', label: '괴롭힘' },
  { value: 'fake', label: '허위 정보' },
  { value: 'copyright', label: '저작권 침해' },
  { value: 'other', label: '기타' }
];

const STATUS_LABELS = {
  pending: '대기중',
  reviewed: '검토중',
  resolved: '해결됨',
  dismissed: '기각됨'
};

const CONTENT_TYPE_LABELS = {
  article: '게시물',
  diary: '다이어리',
  gallery: '갤러리',
  event: '이벤트',
  plant: '식물'
};

export const ReportManagement = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // 신고 목록 조회 (임시 데이터)
  useEffect(() => {
    // TODO: 실제 API 호출로 대체
    const mockReports: Report[] = [
      {
        id: '1',
        reason: 'inappropriate',
        description: '부적절한 이미지가 포함되어 있습니다.',
        contentType: 'diary',
        contentId: 'diary-123',
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z',
        reporter: {
          id: 'user-1',
          name: '신고자1',
          email: 'reporter1@example.com'
        }
      },
      {
        id: '2',
        reason: 'spam',
        contentType: 'article',
        contentId: '456',
        status: 'reviewed',
        createdAt: '2024-01-14T15:20:00Z',
        reporter: {
          id: 'user-2',
          name: '신고자2',
          email: 'reporter2@example.com'
        },
        reviewer: {
          id: 'admin-1',
          name: '관리자1',
          email: 'admin1@example.com'
        }
      }
    ];

    setReports(mockReports);
    setIsLoading(false);
  }, []);

  // 필터링된 신고 목록
  const filteredReports = selectedStatus 
    ? reports.filter(report => report.status === selectedStatus)
    : reports;

  // 신고 상태 업데이트
  const handleStatusUpdate = async (reportId: string, newStatus: 'reviewed' | 'resolved' | 'dismissed') => {
    try {
      // TODO: 실제 API 호출
      console.log('상태 업데이트:', { reportId, newStatus });
      
      setReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status: newStatus }
            : report
        )
      );
      alert('상태가 업데이트되었습니다.');
    } catch (error) {
      console.error('상태 업데이트 오류:', error);
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  // 콘텐츠 삭제/비활성화
  const handleContentAction = async (reportId: string, action: 'delete' | 'disable') => {
    if (!confirm(action === 'delete' ? '정말 삭제하시겠습니까?' : '정말 비활성화하시겠습니까?')) {
      return;
    }

    try {
      // TODO: 실제 API 호출
      console.log('콘텐츠 처리:', { reportId, action });
      
      await handleStatusUpdate(reportId, 'resolved');
      alert(action === 'delete' ? '콘텐츠가 삭제되었습니다.' : '콘텐츠가 비활성화되었습니다.');
    } catch (error) {
      console.error('콘텐츠 처리 오류:', error);
      alert('콘텐츠 처리에 실패했습니다.');
    }
  };

  const getReasonLabel = (reason: string) => {
    return REPORT_REASONS.find(r => r.value === reason)?.label || reason;
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      dismissed: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors] || colors.pending}`}>
        {STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">신고 관리</h2>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">신고 관리</h2>
        
        {/* 상태 필터 */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="">전체</option>
          <option value="pending">대기중</option>
          <option value="reviewed">검토중</option>
          <option value="resolved">해결됨</option>
          <option value="dismissed">기각됨</option>
        </select>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">대기중</p>
          <p className="text-2xl font-bold text-yellow-600">
            {reports.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">검토중</p>
          <p className="text-2xl font-bold text-blue-600">
            {reports.filter(r => r.status === 'reviewed').length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">해결됨</p>
          <p className="text-2xl font-bold text-green-600">
            {reports.filter(r => r.status === 'resolved').length}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">기각됨</p>
          <p className="text-2xl font-bold text-gray-600">
            {reports.filter(r => r.status === 'dismissed').length}
          </p>
        </div>
      </div>

      {/* 신고 목록 */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            신고 내역이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">신고 내용</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">콘텐츠</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">신고자</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">일시</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{getReasonLabel(report.reason)}</p>
                        {report.description && (
                          <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {CONTENT_TYPE_LABELS[report.contentType]}
                        </p>
                        <p className="text-sm text-gray-500">ID: {report.contentId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{report.reporter.name}</p>
                        <p className="text-sm text-gray-500">{report.reporter.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        {report.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleStatusUpdate(report.id, 'reviewed')}
                              className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700">
                              검토 시작
                            </Button>
                            <Button
                              onClick={() => handleStatusUpdate(report.id, 'dismissed')}
                              className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-700">
                              기각
                            </Button>
                          </>
                        )}
                        
                        {report.status === 'reviewed' && (
                          <>
                            <Button
                              onClick={() => handleContentAction(report.id, 'delete')}
                              className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700">
                              삭제
                            </Button>
                            <Button
                              onClick={() => handleContentAction(report.id, 'disable')}
                              className="text-xs px-2 py-1 bg-orange-600 hover:bg-orange-700">
                              비활성화
                            </Button>
                            <Button
                              onClick={() => handleStatusUpdate(report.id, 'dismissed')}
                              className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-700">
                              기각
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}; 