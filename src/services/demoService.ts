import { 
  DEMO_PLANTS, 
  DEMO_CARE_RESPONSE, 
  DEMO_PLANTS_RESPONSE,
  DEMO_DIARIES_RESPONSE,
  DEMO_GALLERIES_RESPONSE,
  DEMO_USER_PROFILE 
} from '@/app/_constants/demoData';
import type { CachedPlant, PlantsResponse } from '@/types/cache/plant';
import type { CareResponse } from '@/types/cache/care';

/**
 * 데모 데이터 전용 서비스
 * 모든 데모 관련 로직을 중앙화하여 관리
 */
export class DemoService {
  /**
   * 데모 데이터 ID인지 확인
   */
  static isDemoId(id: string): boolean {
    return id.startsWith('demo-');
  }

  /**
   * 데모 식물 상세 정보 반환
   */
  static getDemoPlantDetail(id: string): CachedPlant | null {
    const demoPlant = DEMO_PLANTS.find(plant => plant.id === id);
    if (!demoPlant) return null;

    // DemoPlant를 CachedPlant 형태로 변환
    return {
      ...demoPlant,
      purchaseDate: demoPlant.purchaseDate || null,
      lastWateredDate: demoPlant.lastWateredDate || null,
      nextWateringDate: demoPlant.nextWateringDate || null,
      lastNutrientDate: demoPlant.lastNutrientDate || null,
      nextNutrientDate: demoPlant.nextNutrientDate || null,
      createdAt: demoPlant.createdAt,
      updatedAt: demoPlant.updatedAt
    };
  }

  /**
   * 데모 식물 목록 반환
   */
  static getDemoPlantsList(): PlantsResponse {
    return DEMO_PLANTS_RESPONSE;
  }

  /**
   * 데모 케어 데이터 반환
   */
  static getDemoCareData(): CareResponse {
    return DEMO_CARE_RESPONSE;
  }

  /**
   * 데모 다이어리 목록 반환
   */
  static getDemoDiariesList() {
    return DEMO_DIARIES_RESPONSE;
  }

  /**
   * 특정 데모 식물의 다이어리 목록 반환
   */
  static getDemoDiariesByPlant(plantId: string) {
    return DEMO_DIARIES_RESPONSE.diaries.filter(
      diary => diary.plantId === plantId
    );
  }

  /**
   * 데모 갤러리 목록 반환
   */
  static getDemoGalleriesList() {
    return DEMO_GALLERIES_RESPONSE;
  }

  /**
   * 데모 사용자 프로필 반환
   */
  static getDemoUserProfile() {
    return DEMO_USER_PROFILE;
  }

  /**
   * 데모 다이어리 상세 정보 반환
   */
  static getDemoDiaryDetail(id: string) {
    const demoDiary = DEMO_DIARIES_RESPONSE.diaries.find(diary => diary.id === id);
    return demoDiary || null;
  }

}
