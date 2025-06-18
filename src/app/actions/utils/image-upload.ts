'use server';

/**
 * FormData에서 이미지 파일을 처리하고 URL을 반환
 * TODO: 실제 프로덕션에서는 Cloudflare Images 등의 서비스 사용 권장
 */
export async function processImageFile(imageFile: File | null, defaultImage?: string): Promise<string> {
  if (!imageFile || imageFile.size === 0) {
    return defaultImage || '';
  }

  try {
    // 파일 크기 체크 (5MB 제한)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (imageFile.size > MAX_FILE_SIZE) {
      throw new Error('이미지 파일 크기는 5MB 이하여야 합니다.');
    }

    // 파일 타입 체크
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      throw new Error('지원하지 않는 이미지 형식입니다. (JPEG, PNG, WebP만 지원)');
    }

    // 임시로 base64 인코딩 (실제 운영에서는 클라우드 스토리지 사용)
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    
    return `data:${imageFile.type};base64,${base64}`;
  } catch (error) {
    console.error('이미지 처리 오류:', error);
    throw error;
  }
}

/**
 * 썸네일 이미지 처리 (아티클, 이벤트 등에서 사용)
 */
export async function processThumbnailImage(formData: FormData, fieldName: string = 'thumbnail'): Promise<string> {
  const thumbnailFile = formData.get(fieldName) as File | null;
  return await processImageFile(thumbnailFile);
}

/**
 * 갤러리/다이어리 이미지 처리
 */
export async function processContentImage(formData: FormData, fieldName: string = 'image'): Promise<string> {
  const imageFile = formData.get(fieldName) as File | null;
  return await processImageFile(imageFile);
}

/**
 * 식물 이미지 처리 (기본 이미지 포함)
 */
export async function processPlantImage(formData: FormData, fieldName: string = 'image'): Promise<string> {
  const imageFile = formData.get(fieldName) as File | null;
  const defaultPlantImage = '/images/plant-default.png';
  return await processImageFile(imageFile, defaultPlantImage);
}


export async function uploadImageToCloudflare(file: File): Promise<string> {

  
  console.log('TODO: Cloudflare Images 업로드 구현 필요');
  return await processImageFile(file);
}

export async function deleteImageFromCloudflare(imageUrl: string): Promise<void> {

  
  console.log('TODO: Cloudflare Images 삭제 구현 필요', imageUrl);
} 