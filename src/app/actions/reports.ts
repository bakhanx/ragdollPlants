'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// 신고 사유 옵션
export const REPORT_REASONS = [
  { value: 'spam', label: '스팸/홍보' },
  { value: 'inappropriate', label: '부적절한 내용' },
  { value: 'harassment', label: '괴롭힘' },
  { value: 'fake', label: '허위 정보' },
  { value: 'copyright', label: '저작권 침해' },
  { value: 'other', label: '기타' }
] as const;

export type ReportReason = typeof REPORT_REASONS[number]['value'];

interface CreateReportData {
  contentType: 'article' | 'diary' | 'gallery' | 'event' | 'plant';
  contentId: string;
  reason: ReportReason;
  description?: string;
}

// 신고 제출
export async function createReport(data: CreateReportData) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('로그인이 필요합니다.');
    }

    // 이미 신고한 적이 있는지 확인
    const existingReport = await prisma.report.findFirst({
      where: {
        contentType: data.contentType,
        contentId: data.contentId,
        reporterId: session.user.id
      }
    });

    if (existingReport) {
      throw new Error('이미 신고한 콘텐츠입니다.');
    }

    // 신고 생성
    await prisma.$transaction(async (tx) => {
      // 신고 기록 생성
      await tx.report.create({
        data: {
          contentType: data.contentType,
          contentId: data.contentId,
          reason: data.reason,
          description: data.description,
          reporterId: session.user.id
        }
      });

      // 해당 콘텐츠의 신고 카운트 증가
      const updateData = { reportCount: { increment: 1 } };
      
      switch (data.contentType) {
        case 'article':
          await tx.article.update({
            where: { id: parseInt(data.contentId) },
            data: updateData
          });
          break;
        case 'diary':
          await tx.diary.update({
            where: { id: data.contentId },
            data: updateData
          });
          break;
        case 'gallery':
          await tx.gallery.update({
            where: { id: data.contentId },
            data: updateData
          });
          break;
        case 'event':
          await tx.event.update({
            where: { id: parseInt(data.contentId) },
            data: updateData
          });
          break;
        case 'plant':
          await tx.plant.update({
            where: { id: data.contentId },
            data: updateData
          });
          break;
      }
    });

    return { success: true, message: '신고가 접수되었습니다.' };
  } catch (error) {
    console.error('신고 생성 오류:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : '신고 접수에 실패했습니다.' 
    };
  }
}

// 관리자 - 신고 목록 조회
export async function getReports(status?: string) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('관리자 권한이 필요합니다.');
    }

    const where = status ? { status } : {};

    const reports = await prisma.report.findMany({
      where,
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return reports;
  } catch (error) {
    console.error('신고 목록 조회 오류:', error);
    throw error;
  }
}

// 관리자 - 신고 상태 업데이트
export async function updateReportStatus(
  reportId: string, 
  status: 'reviewed' | 'resolved' | 'dismissed'
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('관리자 권한이 필요합니다.');
    }

    await prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        reviewerId: session.user.id,
        updatedAt: new Date()
      }
    });

    revalidatePath('/admin');
    return { success: true, message: '신고 상태가 업데이트되었습니다.' };
  } catch (error) {
    console.error('신고 상태 업데이트 오류:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : '상태 업데이트에 실패했습니다.' 
    };
  }
}

// 관리자 - 신고된 콘텐츠 삭제/비활성화
export async function handleReportedContent(
  reportId: string,
  action: 'delete' | 'disable'
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      throw new Error('관리자 권한이 필요합니다.');
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId }
    });

    if (!report) {
      throw new Error('신고를 찾을 수 없습니다.');
    }

    await prisma.$transaction(async (tx) => {
      // 신고 상태를 resolved로 변경
      await tx.report.update({
        where: { id: reportId },
        data: {
          status: 'resolved',
          reviewerId: session.user.id
        }
      });

      // 콘텐츠 처리
      if (action === 'delete') {
        switch (report.contentType) {
          case 'article':
            await tx.article.delete({
              where: { id: parseInt(report.contentId) }
            });
            break;
          case 'diary':
            await tx.diary.delete({
              where: { id: report.contentId }
            });
            break;
          case 'gallery':
            await tx.gallery.delete({
              where: { id: report.contentId }
            });
            break;
          case 'event':
            await tx.event.delete({
              where: { id: parseInt(report.contentId) }
            });
            break;
          case 'plant':
            await tx.plant.update({
              where: { id: report.contentId },
              data: { isActive: false }
            });
            break;
        }
      }
    });

    revalidatePath('/admin');
    return { 
      success: true, 
      message: action === 'delete' ? '콘텐츠가 삭제되었습니다.' : '콘텐츠가 비활성화되었습니다.' 
    };
  } catch (error) {
    console.error('신고된 콘텐츠 처리 오류:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : '콘텐츠 처리에 실패했습니다.' 
    };
  }
} 