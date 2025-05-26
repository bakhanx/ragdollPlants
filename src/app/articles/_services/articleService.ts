/**
 * Article 서비스 구현
 * Prisma와 Supabase를 사용한 데이터 관리
 */
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import {
  Article,
  ArticleCreateInput,
  ArticleUpdateInput,
  ArticleListParams,
  ArticleListResponse,
  ArticleService,
  SupabaseArticleData
} from '@/types';

// Supabase 클라이언트 초기화 (실제 환경변수 사용 필요)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Prisma 클라이언트 초기화
const prisma = new PrismaClient();

// Supabase 데이터를 앱 형식으로 변환하는 함수
const mapSupabaseArticle = (data: SupabaseArticleData): Article => {
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    summary: data.summary || undefined,
    image: data.image_url || undefined,
    date: data.created_at,
    category: data.category,
    tags: data.tags || undefined,
    isPublished: data.is_published,
    viewCount: data.view_count,
    likes: data.likes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

// 아티클 서비스 구현 (Supabase 기반)
export const articleServiceSupabase: ArticleService = {
  // 아티클 목록 조회
  async getArticles(params: ArticleListParams = {}): Promise<ArticleListResponse> {
    const { page = 1, limit = 10, category, tag, search } = params;
    
    // Supabase 쿼리 생성
    let query = supabase
      .from('articles')
      .select('*', { count: 'exact' });
    
    // 필터 적용
    if (category) {
      query = query.eq('category', category);
    }
    
    if (tag) {
      query = query.contains('tags', [tag]);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }
    
    // 페이지네이션
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, count, error } = await query
      .range(from, to)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch articles: ${error.message}`);
    }
    
    const totalPages = Math.ceil((count || 0) / limit);
    
    // 응답 데이터 변환
    const items = (data as SupabaseArticleData[]).map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary || undefined,
      image: item.image_url || undefined,
      category: item.category,
      date: item.created_at,
      likes: item.likes
    }));
    
    return {
      items,
      totalItems: count || 0,
      totalPages,
      currentPage: page
    };
  },
  
  // 특정 아티클 조회
  async getArticleById(id: string): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .select('*, authors(id, name, avatar)')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    // 저자 정보 포함하여 변환
    const articleData = data as SupabaseArticleData & { authors: { id: string; name: string; avatar: string | null } };
    
    return {
      ...mapSupabaseArticle(articleData),
      author: {
        id: articleData.authors.id,
        name: articleData.authors.name,
        avatar: articleData.authors.avatar || undefined
      }
    };
  },
  
  // 아티클 생성
  async createArticle(data: ArticleCreateInput): Promise<Article> {
    const { data: insertedData, error } = await supabase
      .from('articles')
      .insert({
        title: data.title,
        content: data.content,
        summary: data.summary || null,
        image_url: data.image || null,
        category: data.category,
        tags: data.tags || null,
        author_id: data.authorId,
        is_published: data.isPublished ?? true
      })
      .select()
      .single();
    
    if (error || !insertedData) {
      throw new Error(`Failed to create article: ${error?.message}`);
    }
    
    return mapSupabaseArticle(insertedData as SupabaseArticleData);
  },
  
  // 아티클 수정
  async updateArticle(id: string, data: ArticleUpdateInput): Promise<Article> {
    const updateData: any = {};
    
    // undefined가 아닌 필드만 업데이트
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.image !== undefined) updateData.image_url = data.image;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.isPublished !== undefined) updateData.is_published = data.isPublished;
    
    const { data: updatedData, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !updatedData) {
      throw new Error(`Failed to update article: ${error?.message}`);
    }
    
    return mapSupabaseArticle(updatedData as SupabaseArticleData);
  },
  
  // 아티클 삭제
  async deleteArticle(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete article: ${error.message}`);
    }
    
    return true;
  }
};

// Prisma 기반 아티클 서비스 구현 (예시)
export const articleServicePrisma: ArticleService = {
  // 여기에 Prisma 기반 구현을 추가할 수 있습니다.
  // 예시로 getArticles 메서드만 구현
  async getArticles(params: ArticleListParams = {}): Promise<ArticleListResponse> {
    const { page = 1, limit = 10, category, search, authorId } = params;
    const skip = (page - 1) * limit;
    
    // 필터 조건 생성
    const where: any = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (authorId) where.authorId = authorId;
    
    // 데이터 조회
    const [items, totalItems] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          summary: true,
          image: true,
          category: true,
          createdAt: true,
          likes: true,
          author: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }),
      prisma.article.count({ where })
    ]);
    
    const totalPages = Math.ceil(totalItems / limit);
    
    // 데이터 변환
    const formattedItems = items.map(item => ({
      id: item.id,
      title: item.title,
      summary: item.summary || undefined,
      image: item.image || undefined,
      category: item.category,
      date: item.createdAt.toISOString(),
      author: item.author ? {
        id: item.author.id,
        name: item.author.name
      } : undefined,
      likes: item.likes
    }));
    
    return {
      items: formattedItems,
      totalItems,
      totalPages,
      currentPage: page
    };
  },
  
  // 다른 메서드는 유사한 방식으로 구현
  getArticleById: async (id: string) => { throw new Error('Not implemented') },
  createArticle: async (data: ArticleCreateInput) => { throw new Error('Not implemented') },
  updateArticle: async (id: string, data: ArticleUpdateInput) => { throw new Error('Not implemented') },
  deleteArticle: async (id: string) => { throw new Error('Not implemented') }
};

// 기본 내보내기는 Supabase 서비스 사용
// 필요에 따라 Prisma 서비스로 교체 가능
export const articleService = articleServiceSupabase; 