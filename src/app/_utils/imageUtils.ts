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
  // 로컬 이미지 (public/images)인 경우 그대로 반환
  if (imageUrl.startsWith('/images/')) {
    return imageUrl;
  }
  
  // Blob URL (미리보기)인 경우 그대로 반환
  if (imageUrl.startsWith('blob:')) {
    return imageUrl;
  }
  
  // Data URL (base64)인 경우 그대로 반환
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // Cloudflare Images인 경우 크기 변형 추가
  return `${imageUrl}/${size}`;
};
