'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MenuIcon } from '@/app/_components/icons';

// 메뉴에 표시할 항목 타입 정의
export type MenuItem = {
  label: string;
  onClick: () => void;
  isDanger?: boolean;
};

type ContentMenuProps = {
  id: string;              // 콘텐츠 ID
  contentType: 'diary' | 'event' | 'article'; // 콘텐츠 타입
  customItems?: MenuItem[]; // 커스텀 메뉴 항목
  ariaLabel?: string;      // 접근성 레이블
};

export const ContentMenu = ({ id, contentType, customItems, ariaLabel }: ContentMenuProps) => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  // 콘텐츠 타입별 기본 메뉴 항목 매핑
  const getEditPath = () => {
    const paths = {
      diary: `/diary/edit/${id}`,
      event: `/events/edit/${id}`,
      article: `/articles/edit/${id}`
    };
    return paths[contentType];
  };

  // 기본 메뉴 항목
  const defaultItems: MenuItem[] = [
    {
      label: '수정하기',
      onClick: () => router.push(getEditPath())
    },
    {
      label: '삭제하기',
      onClick: () => confirm('정말 삭제하시겠습니까?') && console.log(`${contentType} ${id} 삭제`),
      isDanger: true
    }
  ];

  // 커스텀 메뉴 항목이 있으면 사용, 없으면 기본 항목 사용
  const menuItems = customItems || defaultItems;

  // 접근성 레이블 생성
  const getAriaLabel = () => {
    if (ariaLabel) return ariaLabel;
    
    const labels = {
      diary: '다이어리 메뉴 열기',
      event: '이벤트 메뉴 열기',
      article: '게시물 메뉴 열기'
    };
    return labels[contentType];
  };

  return (
    <div className="relative">
      <button
        onClick={handleMenuClick}
        className="group relative flex size-9 items-center justify-center rounded-xl bg-white/50 transition-all hover:bg-white/70 hover:shadow-md"
        aria-label={getAriaLabel()}>
        <MenuIcon size={18} className="[&_circle]:stroke-gray-700" />
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
    </div>
  );
};