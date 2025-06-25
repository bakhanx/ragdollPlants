/**
 * Cloudflare Images 업로드/삭제 유틸리티
 * 여러 업로드 페이지에서 재사용 가능
 */

export interface CloudflareImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Cloudflare Images에 이미지 업로드
 * @param file 업로드할 파일
 * @param fallbackUrl 업로드 실패 시 사용할 기본 이미지 URL
 * @returns 업로드된 이미지 URL 또는 기본 이미지 URL
 */
export async function uploadImageToCloudflare(
  file: File,
  fallbackUrl: string = '/images/plant-default.png'
): Promise<string> {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const deliveryUrl = process.env.CLOUDFLARE_IMAGES_DELIVERY_URL;

    if (!accountId || !apiToken) {
      console.warn('Cloudflare 환경변수가 설정되지 않음. 기본 이미지 사용.');
      return fallbackUrl;
    }

    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('파일 크기가 너무 큽니다:', file.size);
      throw new Error('파일 크기는 10MB 이하여야 합니다.');
    }

    // 지원되는 파일 형식 확인
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!supportedTypes.includes(file.type)) {
      console.error('지원되지 않는 파일 형식:', file.type);
      throw new Error('지원되는 이미지 형식: JPG, PNG, WebP, GIF');
    }

    // FormData 생성
    const formData = new FormData();
    formData.append('file', file);

    // 메타데이터 추가 (선택사항)
    const metadata = {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      size: file.size.toString()
    };
    formData.append('metadata', JSON.stringify(metadata));

    // Cloudflare Images API 호출
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`
        },
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cloudflare 업로드 실패:', errorData);
      throw new Error(`이미지 업로드에 실패했습니다. (${response.status})`);
    }

    const result = await response.json();
    
    if (result.success && result.result) {
      // Cloudflare Images 변형 URL 반환
      const imageUrl = deliveryUrl 
        ? `${deliveryUrl}/${result.result.id}/public`
        : result.result.variants[0]; // 첫 번째 변형 사용

      console.log('이미지 업로드 성공:', imageUrl);
      return imageUrl;
    } else {
      throw new Error('이미지 업로드 응답이 올바르지 않습니다.');
    }
  } catch (error) {
    console.error('Cloudflare Images 업로드 오류:', error);
    // 업로드 실패 시 기본 이미지 반환
    return fallbackUrl;
  }
}

/**
 * Cloudflare Images에서 이미지 삭제
 * @param imageUrl 삭제할 이미지 URL
 * @returns 삭제 성공 여부
 */
export async function deleteImageFromCloudflare(imageUrl: string): Promise<boolean> {
  try {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      console.warn('Cloudflare 환경변수가 설정되지 않음. 이미지 삭제 건너뜀.');
      return false;
    }

    // 기본 이미지는 삭제하지 않음
    if (imageUrl.includes('/images/') || imageUrl.includes('plant-default')) {
      console.log('기본 이미지는 삭제하지 않음:', imageUrl);
      return true;
    }

    // URL에서 이미지 ID 추출
    const imageId = extractImageIdFromUrl(imageUrl);
    if (!imageId) {
      console.warn('이미지 URL에서 ID를 추출할 수 없음:', imageUrl);
      return false;
    }

    // Cloudflare Images API 호출
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cloudflare 이미지 삭제 실패:', errorData);
      return false;
    }

    console.log('이미지 삭제 성공:', imageId);
    return true;
  } catch (error) {
    console.error('Cloudflare Images 삭제 오류:', error);
    return false;
  }
}

/**
 * 여러 이미지를 동시에 업로드
 * @param files 업로드할 파일 배열
 * @param fallbackUrl 기본 이미지 URL
 * @returns 업로드된 이미지 URL 배열
 */
export async function uploadMultipleImages(
  files: File[],
  fallbackUrl: string = '/images/plant-default.png'
): Promise<string[]> {
  const uploadPromises = files.map(file => 
    uploadImageToCloudflare(file, fallbackUrl)
  );
  
  return Promise.all(uploadPromises);
}

/**
 * 이미지 배치 삭제
 * @param imageUrls 삭제할 이미지 URL 배열
 * @returns 삭제 결과 배열
 */
export async function deleteMultipleImages(imageUrls: string[]): Promise<boolean[]> {
  const deletePromises = imageUrls.map(url => 
    deleteImageFromCloudflare(url)
  );
  
  return Promise.all(deletePromises);
}

/**
 * URL에서 Cloudflare Images ID 추출 헬퍼 함수
 * @param imageUrl Cloudflare Images URL
 * @returns 이미지 ID 또는 null
 */
function extractImageIdFromUrl(imageUrl: string): string | null {
  try {
    // Cloudflare Images URL 패턴들
    const patterns = [
      // https://imagedelivery.net/{account-hash}/{image-id}/{variant}
      /\/([a-f0-9-]{36})\/[^\/]+$/,
      // https://imagedelivery.net/{account-hash}/{image-id}
      /\/([a-f0-9-]{36})$/,
      // Direct API response patterns
      /images\/v1\/([a-f0-9-]{36})/
    ];

    for (const pattern of patterns) {
      const match = imageUrl.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    console.error('이미지 ID 추출 오류:', error);
    return null;
  }
}

/**
 * 이미지 URL이 Cloudflare Images URL인지 확인
 * @param imageUrl 확인할 URL
 * @returns Cloudflare Images URL 여부
 */
export function isCloudflareImageUrl(imageUrl: string): boolean {
  return imageUrl.includes('imagedelivery.net') || 
         imageUrl.includes('cloudflare.com/images');
}

/**
 * 이미지 변형(variant) URL 생성
 * @param baseUrl 기본 이미지 URL
 * @param variant 변형 이름 (예: 'public', 'thumbnail', 'avatar')
 * @returns 변형된 이미지 URL
 */
export function createImageVariantUrl(baseUrl: string, variant: string): string {
  if (!isCloudflareImageUrl(baseUrl)) {
    return baseUrl;
  }

  // 기존 variant를 새로운 variant로 교체
  return baseUrl.replace(/\/[^\/]+$/, `/${variant}`);
} 