/**
 * 이미지 소스 URL 처리 유틸리티
 * @param imageUrl - 원본 이미지 URL
 * @param size - Cloudflare Images 크기 ('small', 'medium', 'large')
 * @returns 처리된 이미지 URL
 */
export const getImageSrc = (
  imageUrl: string,
  size: 'small' | 'medium' | 'large' = 'medium'
): string => {
  // Local URL
  if (imageUrl.startsWith('/images/')) {
    return imageUrl;
  }

  // Blob URL
  if (imageUrl.startsWith('blob:')) {
    return imageUrl;
  }

  // Base64 URL
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }

  // Google URL
  if (imageUrl.includes('googleusercontent.com')) {
    return imageUrl;
  }

  // Naver URL
  if (imageUrl.includes('pstatic.net')) {
    return imageUrl;
  }

  // Cloudflare Images인 경우 크기 변형 추가
  return `${imageUrl}/${size}`;
};
