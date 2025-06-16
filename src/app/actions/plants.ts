'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { PlantCreateInput, PlantUpdateInput, MAX_PLANTS } from '@/types/models/plant';

// 식물 생성 유효성 검사 스키마
const createPlantSchema = z.object({
  name: z.string().min(1, '식물 이름은 필수입니다').max(50, '식물 이름은 50자 이하여야 합니다'),
  category: z.string().min(1, '식물 종류를 선택해주세요'),
  description: z.string().optional(),
  location: z.string().optional(),
  purchaseDate: z.string().optional(),
  wateringInterval: z.number().min(1).max(365).optional(),
  nutrientInterval: z.number().min(1).max(365).optional(),
});

// 내 식물 목록 조회
export async function getMyPlants() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('로그인이 필요합니다.');
    }

    const plants = await prisma.plant.findMany({
      where: {
        authorId: session.user.id
      },
      select: {
        id: true,
        name: true,
        image: true,
        category: true,
        description: true,
        location: true,
        purchaseDate: true,
        needsWater: true,
        needsNutrient: true,
        lastWateredDate: true,
        nextWateringDate: true,
        lastNutrientDate: true,
        nextNutrientDate: true,
        wateringInterval: true,
        nutrientInterval: true,
        createdAt: true,
        updatedAt: true,
        tags: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return plants;
  } catch (error) {
    console.error('내 식물 목록 조회 오류:', error);
    throw new Error('식물 목록을 불러오는 중 오류가 발생했습니다.');
  }
}

// 특정 식물 상세 조회
export async function getPlantById(id: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('로그인이 필요합니다.');
    }

    const plant = await prisma.plant.findUnique({
      where: { 
        id,
        authorId: session.user.id // 본인 식물만 조회 가능
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    if (!plant) {
      throw new Error('식물을 찾을 수 없습니다.');
    }

    return plant;
  } catch (error) {
    console.error('식물 조회 오류:', error);
    throw error;
  }
}

// 식물 등록 (업로드)
export async function createPlant(formData: FormData) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('로그인이 필요합니다.');
    }

    // 사용자의 현재 식물 개수 확인
    const currentCount = await prisma.plant.count({
      where: {
        authorId: session.user.id
      }
    });

    if (currentCount >= MAX_PLANTS) {
      throw new Error(`식물은 최대 ${MAX_PLANTS}개까지만 등록할 수 있습니다.`);
    }

    // 폼 데이터 추출
    const plantName = formData.get('plantName') as string;
    const plantType = formData.get('plantType') as string;
    const location = (formData.get('location') as string) || '';
    const acquiredDate = (formData.get('acquiredDate') as string) || null;
    const notes = (formData.get('notes') as string) || '';
    const wateringInterval = formData.get('wateringInterval') ? parseInt(formData.get('wateringInterval') as string) : 7;
    const nutrientInterval = formData.get('nutrientInterval') ? parseInt(formData.get('nutrientInterval') as string) : 30;

    // 유효성 검사
    const validatedData = createPlantSchema.parse({
      name: plantName,
      category: plantType,
      description: notes,
      location: location || undefined,
      purchaseDate: acquiredDate || undefined,
      wateringInterval,
      nutrientInterval,
    });

    // 이미지 처리
    let imageUrl = '/images/plant-default.png';
    const image = formData.get('image') as File | null;
    
    if (image && image.size > 0) {
      // TODO: Cloudflare Images 또는 다른 이미지 서비스에 업로드
      // imageUrl = await uploadImageToCloudflare(image);
      
      // 임시로 기본 이미지 사용 (실제 구현 필요)
      imageUrl = '/images/plant-default.png';
    }

    // 데이터베이스에 식물 정보 저장
    const now = new Date();
    const nextWateringDate = new Date(now.getTime() + (validatedData.wateringInterval || 7) * 24 * 60 * 60 * 1000);
    const nextNutrientDate = new Date(now.getTime() + (validatedData.nutrientInterval || 30) * 24 * 60 * 60 * 1000);

    const plant = await prisma.plant.create({
      data: {
        name: validatedData.name,
        image: imageUrl,
        category: validatedData.category,
        description: validatedData.description,
        location: validatedData.location,
        purchaseDate: validatedData.purchaseDate ? new Date(validatedData.purchaseDate) : null,
        wateringInterval: validatedData.wateringInterval,
        nutrientInterval: validatedData.nutrientInterval,
        needsWater: false,
        needsNutrient: false,
        lastWateredDate: now,
        nextWateringDate: nextWateringDate,
        lastNutrientDate: now,
        nextNutrientDate: nextNutrientDate,
        authorId: session.user.id,
        tags: []
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    // 캐시 재검증
    revalidatePath('/myplants');
    revalidatePath(`/myplants/${plant.id}`);

    return {
      success: true,
      message: '식물이 성공적으로 등록되었습니다.',
      plant
    };

  } catch (error) {
    console.error('식물 등록 오류:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : '식물 등록에 실패했습니다.'
    };
  }
}

// 식물 정보 수정
export async function updatePlant(id: string, formData: FormData) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('로그인이 필요합니다.');
    }

    // 기존 식물 확인
    const existingPlant = await prisma.plant.findUnique({
      where: { 
        id,
        authorId: session.user.id
      }
    });

    if (!existingPlant) {
      throw new Error('수정할 식물을 찾을 수 없습니다.');
    }

    // 폼 데이터 추출
    const plantName = formData.get('plantName') as string;
    const plantType = formData.get('plantType') as string;
    const location = (formData.get('location') as string) || '';
    const acquiredDate = (formData.get('acquiredDate') as string) || null;
    const notes = (formData.get('notes') as string) || '';
    const wateringInterval = formData.get('wateringInterval') ? parseInt(formData.get('wateringInterval') as string) : existingPlant.wateringInterval;
    const nutrientInterval = formData.get('nutrientInterval') ? parseInt(formData.get('nutrientInterval') as string) : existingPlant.nutrientInterval;

    // 유효성 검사
    const validatedData = createPlantSchema.parse({
      name: plantName,
      category: plantType,
      description: notes,
      location: location || undefined,
      purchaseDate: acquiredDate || undefined,
      wateringInterval,
      nutrientInterval,
    });

    // 이미지 처리
    const imageUrl = existingPlant.image; // TODO: 이미지 업로드 기능 구현 후 let으로 변경
    const image = formData.get('image') as File | null;
    
    if (image && image.size > 0) {
      // TODO: 새 이미지 업로드 및 기존 이미지 삭제
      // imageUrl = await uploadImageToCloudflare(image);
    }

    // 데이터베이스 업데이트
    const updatedPlant = await prisma.plant.update({
      where: { id },
      data: {
        name: validatedData.name,
        image: imageUrl,
        category: validatedData.category,
        description: validatedData.description,
        location: validatedData.location,
        purchaseDate: validatedData.purchaseDate ? new Date(validatedData.purchaseDate) : null,
        wateringInterval: validatedData.wateringInterval,
        nutrientInterval: validatedData.nutrientInterval,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    // 캐시 재검증
    revalidatePath('/myplants');
    revalidatePath(`/myplants/${id}`);

    return {
      success: true,
      message: '식물 정보가 성공적으로 수정되었습니다.',
      plant: updatedPlant
    };

  } catch (error) {
    console.error('식물 수정 오류:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : '식물 수정에 실패했습니다.'
    };
  }
}

// 식물 삭제
export async function deletePlant(id: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('로그인이 필요합니다.');
    }

    // 기존 식물 확인
    const existingPlant = await prisma.plant.findUnique({
      where: { 
        id,
        authorId: session.user.id
      }
    });

    if (!existingPlant) {
      throw new Error('삭제할 식물을 찾을 수 없습니다.');
    }

    // 관련 데이터 삭제 (케어 기록, 다이어리 등)
    await prisma.$transaction([
      // 케어 기록 삭제
      prisma.careRecord.deleteMany({
        where: { plantId: id }
      }),
      // 케어 알림 삭제
      prisma.careReminder.deleteMany({
        where: { plantId: id }
      }),
      // 다이어리 삭제
      prisma.diary.deleteMany({
        where: { plantId: id }
      }),
      // 갤러리 삭제
      prisma.gallery.deleteMany({
        where: { plantId: id }
      }),
      // 식물 삭제
      prisma.plant.delete({
        where: { id }
      })
    ]);

    // TODO: 이미지 파일도 삭제 (Cloudflare Images에서)
    // await deleteImageFromCloudflare(existingPlant.image);

    // 캐시 재검증
    revalidatePath('/myplants');

    return {
      success: true,
      message: '식물이 성공적으로 삭제되었습니다.'
    };

  } catch (error) {
    console.error('식물 삭제 오류:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '식물 삭제에 실패했습니다.'
    };
  }
}

// 물주기 기록
export async function updateWatering(id: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('로그인이 필요합니다.');
    }

    const plant = await prisma.plant.findUnique({
      where: { 
        id,
        authorId: session.user.id
      }
    });

    if (!plant) {
      throw new Error('식물을 찾을 수 없습니다.');
    }

    // 물주기 기록 업데이트
    const now = new Date();
    const nextWateringDate = new Date(now.getTime() + (plant.wateringInterval || 7) * 24 * 60 * 60 * 1000);

    const updatedPlant = await prisma.plant.update({
      where: { id },
      data: {
        lastWateredDate: now,
        nextWateringDate: nextWateringDate,
        needsWater: false,
        updatedAt: new Date()
      }
    });

    // 케어 기록 추가
    await prisma.careRecord.create({
      data: {
        type: 'water',
        date: now,
        plantId: id,
        authorId: session.user.id,
        notes: '물주기 완료',
        isToday: true
      }
    });

    // 캐시 재검증
    revalidatePath('/myplants');
    revalidatePath(`/myplants/${id}`);

    return {
      success: true,
      message: '물주기가 기록되었습니다.',
      plant: updatedPlant
    };

  } catch (error) {
    console.error('물주기 기록 오류:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '물주기 기록에 실패했습니다.'
    };
  }
}

// 영양제 기록
export async function updateNutrient(id: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('로그인이 필요합니다.');
    }

    const plant = await prisma.plant.findUnique({
      where: { 
        id,
        authorId: session.user.id
      }
    });

    if (!plant) {
      throw new Error('식물을 찾을 수 없습니다.');
    }

    // 영양제 기록 업데이트
    const now = new Date();
    const nextNutrientDate = new Date(now.getTime() + (plant.nutrientInterval || 30) * 24 * 60 * 60 * 1000);

    const updatedPlant = await prisma.plant.update({
      where: { id },
      data: {
        lastNutrientDate: now,
        nextNutrientDate: nextNutrientDate,
        needsNutrient: false,
        updatedAt: new Date()
      }
    });

    // 케어 기록 추가
    await prisma.careRecord.create({
      data: {
        type: 'nutrient',
        date: now,
        plantId: id,
        authorId: session.user.id,
        notes: '영양제 공급 완료',
        isToday: true
      }
    });

    // 캐시 재검증
    revalidatePath('/myplants');
    revalidatePath(`/myplants/${id}`);

    return {
      success: true,
      message: '영양제 공급이 기록되었습니다.',
      plant: updatedPlant
    };

  } catch (error) {
    console.error('영양제 기록 오류:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '영양제 기록에 실패했습니다.'
    };
  }
}

// TODO: 이미지 업로드 함수 (실제 구현 필요)
async function uploadImageToCloudflare(file: File): Promise<string> {
  // Cloudflare Images API를 사용한 업로드 로직
  // 실제 구현 시 환경변수에서 API 키와 계정 정보를 가져와야 함
  
  // 임시 반환값
  return '/images/plant-default.png';
}

// TODO: 이미지 삭제 함수 (실제 구현 필요)
async function deleteImageFromCloudflare(imageUrl: string): Promise<void> {
  // Cloudflare Images에서 이미지 삭제 로직
  // 실제 구현 필요
} 