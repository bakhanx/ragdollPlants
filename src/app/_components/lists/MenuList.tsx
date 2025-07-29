import Link from 'next/link';
import React from 'react';

type MenuItemType = {
  id: string;
  icon: string;
  label: string;
  href: string;
  ownerOnly: boolean;
  profileLink?: boolean;
  getHref?: (userLoginId: string, currentUserId?: string) => string;
};

const menuItems: MenuItemType[] = [
  {
    id: 'garden',
    icon: '🏡',
    label: '정원',
    href: '/garden',
    ownerOnly: false,
    profileLink: false,
    getHref: (userLoginId, currentUserId) => {
      return `/garden/${userLoginId}`;
    }
  },
  {
    id: 'myplants',
    icon: '🌱',
    label: '식물',
    href: '/myplants',
    ownerOnly: false,
    profileLink: true,
    getHref: (userLoginId, currentUserId) => {
      return userLoginId === currentUserId
        ? '/myplants'
        : `/garden/${userLoginId}/plants`;
    }
  },
  {
    id: 'diaries',
    icon: '📗',
    label: '다이어리',
    href: '/diaries',
    ownerOnly: false,
    profileLink: true,
    getHref: (userLoginId, currentUserId) => {
      return userLoginId === currentUserId
        ? '/diaries'
        : `/garden/${userLoginId}/diaries`;
    }
  },
  {
    id: 'galleries',
    icon: '🌷',
    label: '갤러리',
    href: '/galleries',
    ownerOnly: false,
    profileLink: true,
    getHref: (userLoginId, currentUserId) => {
      return userLoginId === currentUserId
        ? '/galleries'
        : `/garden/${userLoginId}/galleries`;
    }
  },
  {
    id: 'care',
    icon: '💊',
    label: '식물 케어',
    href: '/care',
    ownerOnly: true,
    getHref: (userLoginId, currentUserId) => {
      // 본인 페이지에서만 표시
      return '/care';
    }
  },
  {
    id: 'news',
    icon: '📝',
    label: '식물 뉴스',
    href: '/articles',
    ownerOnly: false,
    getHref: () => '/articles' // 공통 페이지
  },
  {
    id: 'events',
    icon: '🎉',
    label: '이벤트',
    href: '/events',
    ownerOnly: false,
    getHref: () => '/events' // 공통 페이지
  }
];

interface MenuListProps {
  userLoginId?: string; // 현재 보고 있는 사용자 loginId
  currentUserId?: string; // 로그인한 사용자 ID
  variant?: 'inline' | 'sidebar';
  onItemClick?: () => void;
}

export const MenuList = ({
  userLoginId,
  currentUserId,
  variant = 'inline',
  onItemClick
}: MenuListProps) => {
  const isOwner = userLoginId === currentUserId;

  const variants = {
    inline: {
      nav: 'grid grid-cols-2 gap-4 w-full py-4',
      link: `
        group relative flex gap-x-2 items-center 
        p-3 rounded-2xl
        bg-white/60 hover:bg-white/80
        border border-green-100/50
        transition-all duration-200
        hover:shadow-lg hover:-translate-y-0.5
      `,
      iconWrapper: `
        flex items-center justify-center
        text-xl size-8
        transition-transform duration-200
        group-hover:scale-110
      `,
      label: 'text-sm font-medium text-gray-700'
    },
    sidebar: {
      nav: 'space-y-1',
      link: `
        group relative flex items-center gap-3
        px-4 py-3 rounded-xl
        hover:bg-green-50/50
        transition-all duration-200
      `,
      iconWrapper: `
        flex items-center justify-center
        text-2xl size-8
        transition-transform duration-200
        group-hover:scale-105
      `,
      label: 'text-sm font-medium text-gray-700'
    }
  };

  const styles = variants[variant];

  // 표시할 메뉴 아이템 필터링
  const visibleItems = menuItems.filter(item => {
    if (item.ownerOnly && !isOwner) {
      return false;
    }
    return true;
  });

  return (
    <nav className={styles.nav}>
      {visibleItems.map(item => {
        // 동적 href 생성
        const href =
          item.getHref && userLoginId
            ? item.getHref(userLoginId, currentUserId)
            : item.href;

        return (
          <Link
            key={item.id}
            href={href}
            onClick={onItemClick}
            className={styles.link}>
            <div className={styles.iconWrapper}>{item.icon}</div>
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
