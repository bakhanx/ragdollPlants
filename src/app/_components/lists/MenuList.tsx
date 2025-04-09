import Link from 'next/link';
import React from 'react';

interface MenuListProps {
  variant?: 'inline' | 'sidebar';
  onItemClick?: () => void;
}

export const MenuList = ({
  variant = 'inline',
  onItemClick
}: MenuListProps) => {
  const menuItems = [
    { icon: '🏡', label: '내 정원', href: '/mygarden' },
    { icon: '📗', label: '다이어리', href: '/diary' },
    { icon: '🌷', label: '식물 갤러리', href: '/gallery' },
    { icon: '🌱', label: '식물 케어', href: '/care' },
    { icon: '📝', label: '식물 뉴스', href: '/article' }
  ];

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
          key={item.href}
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
