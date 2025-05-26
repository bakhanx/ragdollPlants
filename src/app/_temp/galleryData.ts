import { LegacyGalleryItem, MAX_GALLERY_PHOTOS } from '@/types/models/gallery';

// 갤러리 아이템 타입
export type GalleryItem = LegacyGalleryItem;

// 임시 갤러리 데이터
export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: '봄에 피어난 몬스테라',
    imageUrl: '/images/welcome-bg-01.webp',
    createdAt: '2023-04-15',
    likes: 24
  },
  {
    id: 2,
    title: '화분을 새로 바꾼 후',
    imageUrl: '/images/welcome-bg-02.webp',
    createdAt: '2023-03-28',
    likes: 18
  },
  {
    id: 3,
    title: '창가에서',
    imageUrl: '/images/welcome-bg-03.webp',
    createdAt: '2023-03-10',
    likes: 32
  },
  {
    id: 4,
    title: '새순 돋아나는 순간',
    imageUrl: '/images/welcome-bg-04.webp',
    createdAt: '2023-02-15',
    likes: 42
  }
];

// 최대 갤러리 사진 개수 내보내기
export { MAX_GALLERY_PHOTOS }; 