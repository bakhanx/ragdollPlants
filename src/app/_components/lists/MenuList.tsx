import Link from 'next/link';
import React from 'react';

type MenuItemType = {
  id: string;
  icon: string;
  label: string;
  href: string;
  ownerOnly: boolean;
  profileLink?: boolean;
};

const menuItems: MenuItemType[] = [
  {
    id: 'mygarden',
    icon: '🏡',
    label: '내 정원',
    href: `/mygarden/my`,
    ownerOnly: false,
    profileLink: false
  },
  {
    id: 'myplants',
    icon: '🌱',
    label: '식물',
    href: '/myplant',
    ownerOnly: false,
    profileLink: true
  },
  {
    id: 'diaries',
    icon: '📗',
    label: '다이어리',
    href: '/diaries',
    ownerOnly: false,
    profileLink: true
  },
  {
    id: 'galleries',
    icon: '🌷',
    label: '갤러리',
    href: '/galleries',
    ownerOnly: false,
    profileLink: true
  },
  {
    id: 'care',
    icon: '💊',
    label: '식물 케어',
    href: '/care',
    ownerOnly: true
  },
  {
    id: 'news',
    icon: '📝',
    label: '식물 뉴스',
    href: '/articles',
    ownerOnly: false
  },
  {
    id: 'events',
    icon: '🎉',
    label: '이벤트',
    href: '/events',
    ownerOnly: false
  }
];

interface MenuListProps {
  userId?: string;
  currentUserId?: string;

  variant?: 'inline' | 'sidebar';
  onItemClick?: () => void;
}

export const MenuList = ({
  variant = 'inline',
  onItemClick
}: MenuListProps) => {
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

  return (
    <nav className={styles.nav}>
      {menuItems.map(item => (
        <Link
          key={item.id}
          href={item.href}
          onClick={onItemClick}
          className={styles.link}>
          <div className={styles.iconWrapper}>{item.icon}</div>
          <span className={styles.label}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};
