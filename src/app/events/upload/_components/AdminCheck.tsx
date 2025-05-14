'use client';

import React, { useState, useEffect } from 'react';

interface AdminCheckProps {
  children: React.ReactNode;
  loadingComponent: React.ReactNode;
  unauthorizedComponent: React.ReactNode;
}

export const AdminCheck = ({
  children,
  loadingComponent,
  unauthorizedComponent
}: AdminCheckProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 임시 관리자 체크 로직 
  useEffect(() => {
    
    const checkAdmin = () => {
      setTimeout(() => {
        // 임시로 true로 설정
        setIsAdmin(true);
        setIsLoading(false);
      }, 1000);
    };

    checkAdmin();
  }, []);

  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  if (!isAdmin) {
    return <>{unauthorizedComponent}</>;
  }

  return <>{children}</>;
}; 