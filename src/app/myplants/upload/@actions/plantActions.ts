'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

// 플랜트 업로드 액션
export async function uploadPlant(formData: FormData) {
  try {
    // 현재 인증된 사용자 정보 가져오기
    // const session = await auth();
    // if (!session?.user?.id) {
    //   return {
    //     success: false,
    //     message: '로그인이 필요합니다'
    //   };
    // }

    // 폼 데이터에서 필드 추출
    const plantName = formData.get('plantName') as string;
    const plantType = formData.get('plantType') as string;
    const location = (formData.get('location') as string) || null;
    const acquiredDate = (formData.get('acquiredDate') as string) || null;
    const notes = (formData.get('notes') as string) || null;

    // 이미지 처리
    let imageUrl: string;
    const image = formData.get('image') as File | null;
    
    if (image && image.size > 0) {
      // 실제 이미지가 있는 경우 Cloudflare에 업로드
      // 여기에 Cloudflare 이미지 업로드 로직 구현
      // 예시: imageUrl = await uploadToCloudflare(image);

      // 임시로 더미 URL 설정 (실제 구현 필요)
      imageUrl = 'https://example.com/uploaded-image.jpg';
    } else {
      // 기본 이미지 사용
      imageUrl = '/images/plant-default.png';
    }

    // 데이터베이스에 식물 정보 저장
    const plant = await prisma.plant.create({
      data: {
        name: plantName,
        image: imageUrl,
        category: plantType,
        description: notes,
        location: location,
        purchaseDate: acquiredDate ? new Date(acquiredDate) : null,
        // 사용자 ID 연결
        // authorId: session.user.id,
        authorId: '1'
      }
    });

    // 경로 재검증 (캐시 갱신)
    revalidatePath('/myplants');

    return {
      success: true,
      message: '식물이 성공적으로 등록되었습니다',
      plant
    };
  } catch (error) {
    console.error('식물 등록 오류:', error);
    return {
      success: false,
      message: '식물 등록에 실패했습니다'
    };
  }
}

// 추가로 필요한 함수들 (예: Cloudflare 이미지 업로드)
async function uploadToCloudflare(file: File) {
  // Cloudflare 업로드 로직 구현
  // 실제 구현은 Cloudflare API에 맞게 조정 필요

  // 임시 리턴 (실제 구현 필요)
  return {
    url: 'https://example.com/uploaded-image.jpg'
  };
}
