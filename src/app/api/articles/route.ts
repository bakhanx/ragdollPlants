import { NextRequest, NextResponse } from 'next/server';
import { articleItems } from '@/app/_temp/articleData';

export async function GET() {
  try {
    // 실제 구현에서는 데이터베이스에서 조회
    return NextResponse.json({ articles: articleItems }, { status: 200 });
  } catch (error) {
    console.error('글 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '글 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // 필수 필드 검증
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string || '익명';
    
    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 내용은 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }

    // 썸네일 이미지 처리
    const thumbnailFile = formData.get('thumbnail') as File | null;
    let thumbnailUrl = '';
    
    if (thumbnailFile) {
      // 실제 구현에서는 파일 스토리지에 업로드
      // 임시 로직: 파일 이름으로 URL 생성
      thumbnailUrl = `/images/articles/${Date.now()}_${thumbnailFile.name}`;
    }

    // 태그(키워드) 처리
    let tags: string[] = [];
    const tagsJson = formData.get('tags');
    if (tagsJson && typeof tagsJson === 'string') {
      try {
        tags = JSON.parse(tagsJson);
      } catch (e) {
        console.error('태그 파싱 오류:', e);
      }
    }

    // HTML 컨텐츠 내 이미지 처리 (base64 데이터 URL을 서버에 업로드하는 로직)
    // 실제 구현에서는 base64 이미지를 추출하여 파일 스토리지에 업로드하고 URL로 대체해야 함
    // (여기서는 간단히 구현)
    
    // 새 글 데이터 생성
    const newArticle = {
      id: Date.now(), // 임시 ID 생성 방식
      title,
      content, // 리치 텍스트 HTML 컨텐츠
      author,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD 형식
      image: thumbnailUrl || '/images/default-article.jpg', // 썸네일 이미지
      tags
    };

    // 실제 구현에서는 데이터베이스에 저장
    console.log('새 기사 생성:', newArticle);

    return NextResponse.json({ article: newArticle }, { status: 201 });
  } catch (error) {
    console.error('글 작성 오류:', error);
    return NextResponse.json(
      { error: '글 작성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 