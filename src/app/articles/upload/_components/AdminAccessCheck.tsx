'use client';

import React, { useState, useEffect } from 'react';

export default function AdminAccessCheck() {
  // 실제로는 useAuth() 등을 사용하여 권한 체크
  const [isAdmin, setIsAdmin] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  // 관리자 권한 체크 로직
  useEffect(() => {
    // 임시
    const checkAdmin = () => {
      setTimeout(() => {
        setIsChecking(false);

        setIsAdmin(true);
      }, 1000);
    };

    checkAdmin();
  }, []);

  // 로딩 중이거나 관리자인 경우 아무것도 표시하지 않음
  if (isChecking || isAdmin) {
    return null;
  }

  // 관리자가 아닌 경우 접근 불가 메시지 표시
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <p className="text-center text-lg">
        관리자만 접근할 수 있는 페이지입니다.
      </p>
    </div>
  );
}
