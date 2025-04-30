'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const Footer = () => {
  const pathname = usePathname();
  
  // 푸터를 표시하지 않을 경로 목록
  const hideFooterPaths = ['/auth', '/welcome'];
  
  // 현재 경로가 푸터를 숨길 경로에 포함되는지 확인
  const shouldHideFooter = hideFooterPaths.some(path => pathname.startsWith(path));
  
  if (shouldHideFooter) {
    return null;
  }

  return (
    <footer className="w-full pt-4 mt-4 text-xs text-gray-50 px-2">
      <div className="border-t border-gray-50 pt-4">
        {/* 간소화된 링크 섹션 */}
        <div className="mb-3 grid grid-cols-3 gap-2">
          <div>
            <h3 className="mb-1 font-medium">서비스</h3>
            <div className="flex flex-col space-y-1">
              <Link href="/mygarden" className="hover:text-green-600">내 정원</Link>
              <Link href="/care" className="hover:text-green-600">식물 케어</Link>
              <Link href="/gallery" className="hover:text-green-600">식물 갤러리</Link>
            </div>
          </div>
          <div>
            <h3 className="mb-1 font-medium">계정</h3>
            <div className="flex flex-col space-y-1">
              <Link href="/profile" className="hover:text-green-600">프로필</Link>
              <Link href="/settings" className="hover:text-green-600">설정</Link>
            </div>
          </div>
          <div>
            <h3 className="mb-1 font-medium">정보</h3>
            <div className="flex flex-col space-y-1">
              <Link href="/about" className="hover:text-green-600">서비스 소개</Link>
              <Link href="/privacy" className="hover:text-green-600">개인정보</Link>
              <Link href="/terms" className="hover:text-green-600">이용약관</Link>
            </div>
          </div>
        </div>
        
        {/* 저작권 */}
        <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3 text-[10px] text-gray-50">
          <div>© 2024 RagdollPlants</div>
          <div className="flex space-x-3">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-600">
              인스타그램
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-600">
              트위터
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 