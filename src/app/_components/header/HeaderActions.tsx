'use client';

import { useState } from 'react';
import { MenuIcon } from '@/app/_components/icons';
import { useContentActions } from '@/app/_hooks/useContentActions';
import { ContentType } from '@/app/_services/contentService';
import { ReportModal, ReportReason } from '../common/ReportModal';

// 메뉴에 표시할 항목 타입 정의
export type ActionsItem = {
  label: string;
  onClick: () => void;
  isDanger?: boolean;
};

type ActionsProps = {
  contentType: ContentType; // 컨텐츠 타입
  customItems?: ActionsItem[]; // 커스텀 메뉴 항목
  ariaLabel?: string; // 접근성 레이블
  id: string;
  isOwner: boolean;
};

export const HeaderActions = ({
  contentType: contentType,
  customItems,
  ariaLabel,
  id,
  isOwner
}: ActionsProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isReportSubmitting, setIsReportSubmitting] = useState(false);

  // 콘텐츠 액션 훅 사용 (커스텀 핸들러가 없을 때 사용)
  const { handleEdit, handleDelete } = useContentActions(contentType, id);

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  // 신고 모달 열기
  const handleReport = () => {
    setShowReportModal(true);
    setShowMenu(false);
  };

  // 신고 제출
  const handleReportSubmit = async (
    reason: ReportReason,
    description?: string
  ) => {
    setIsReportSubmitting(true);
    try {
      // TODO: 실제 신고 API 호출
      console.log('신고 데이터:', {
        contentType,
        contentId: id,
        reason,
        description
      });

      // 임시로 성공 처리
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('신고가 접수되었습니다.');
    } catch (error) {
      console.error('신고 제출 오류:', error);
      alert('신고 접수에 실패했습니다.');
    } finally {
      setIsReportSubmitting(false);
    }
  };

  // 작성자/관리자용 메뉴 항목 (수정, 삭제 권한)
  const ownerItems: ActionsItem[] = [
    {
      label: '수정하기',
      onClick: handleEdit
    },
    {
      label: '삭제하기',
      onClick: handleDelete,
      isDanger: true
    }
  ];

  // 일반 사용자용 메뉴 항목 (신고만 가능)
  const nonOwnerItems: ActionsItem[] = [
    {
      label: '신고하기',
      onClick: handleReport,
      isDanger: true
    }
  ];

  // 커스텀 메뉴 항목이 있으면 사용, 없으면 작성자 여부에 따라 항목 결정
  const menuItems = customItems || (isOwner ? ownerItems : nonOwnerItems);

  // 접근성 레이블 생성
  const getAriaLabel = () => {
    if (ariaLabel) return ariaLabel;

    const labels = {
      diary: '다이어리 메뉴 열기',
      event: '이벤트 메뉴 열기',
      article: '게시물 메뉴 열기',
      plant: '식물 메뉴 열기',
      gallery: '갤러리 메뉴 열기'
    };
    return labels[contentType];
  };

  return (
    <div className="relative">
      <button
        onClick={handleMenuClick}
        className="group relative flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all hover:bg-white/70 hover:shadow-md"
        aria-label={getAriaLabel()}>
        <MenuIcon
          size={18}
          className="[&_circle]:stroke-gray-700"
        />
      </button>

      {showMenu && (
        <div className="absolute top-10 right-0 z-20 w-36 overflow-hidden rounded-lg bg-white shadow-lg">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                    item.isDanger ? 'text-red-500' : ''
                  }`}
                  onClick={() => {
                    item.onClick();
                    setShowMenu(false);
                  }}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 신고 모달 */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
        contentType={contentType}
        isSubmitting={isReportSubmitting}
      />
    </div>
  );
};
