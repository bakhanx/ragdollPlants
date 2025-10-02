"use client"

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function NavigationScrollManager() {
  const pathname = usePathname();
  
  // 이전 경로 저장
  const prevPathRef = useRef(pathname);
  
  useEffect(() => {
    // 실제 내비게이션 변경인지 확인 (뒤로가기/앞으로가기가 아닌 경우)
    if (prevPathRef.current !== pathname) {
      window.scrollTo(0, 0);
      
      // 현재 경로를 이전 경로로 업데이트
      prevPathRef.current = pathname;
    }
  }, [pathname]); 
  
  return null;
}
