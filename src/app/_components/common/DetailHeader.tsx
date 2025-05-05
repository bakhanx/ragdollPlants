import React from 'react';
import { Header } from '../header/Header';

interface DetailHeaderProps {
  title: string;
  id?: string;
  showBack?: boolean;
  showNotification?: boolean;
  showMenuButton?: boolean;
  variant?: 'default' | 'glass';
  contentType?: 'article' | 'diary' | 'event';
}

export function DetailHeader({
  title,
  id,
  showBack = true,
  showNotification,
  showMenuButton,
  variant,
  contentType
}: DetailHeaderProps) {
  return (
    <Header
      title={title}
      id={id}
      showBack={showBack}
      showNotification={showNotification}
      showMenuButton={showMenuButton}
      variant={variant}
      contentType={contentType}
    />
  );
} 