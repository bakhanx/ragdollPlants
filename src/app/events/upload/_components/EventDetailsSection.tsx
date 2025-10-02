import React from 'react';
import { Input, Textarea } from '@/app/_components/common';
import DatePickerField from '@/app/myplants/_components/forms/DatePickerField';
import EventEditor from './EventEditor';

export interface EventDetailsSectionProps {
  title: string;
  setTitle: (value: string) => void;
  subtitle: string;
  setSubtitle: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
}

export const EventDetailsSection = ({
  title, setTitle,
  subtitle, setSubtitle,
  startDate, setStartDate,
  endDate, setEndDate,
  description, setDescription,
  content, setContent
}: EventDetailsSectionProps) => {
  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <>
      <Input
        id="title"
        label="이벤트 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="예: 봄맞이 가드닝 이벤트"
        required
      />

      <Input
        id="subtitle"
        label="부제목"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        placeholder="예: 신규 회원 20% 할인"
        required
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-50">
          이벤트 기간 <span className="text-red-500">*</span>
        </label>
        
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-gray-200">시작일</label>
            <DatePickerField
              value={startDate}
              onChange={setStartDate}
              max="9999-12-31"
              label="시작 날짜를 선택해주세요"
            />
          </div>
          
          <div>
            <label className="mb-1 block text-xs text-gray-200">종료일</label>
            <DatePickerField
              value={endDate}
              onChange={setEndDate}
              max="9999-12-31"
              label="종료 날짜를 선택해주세요"
            />
          </div>
        </div>
      </div>

      <Textarea
        id="description"
        label="이벤트 설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="이벤트에 대한 간략한 설명을 입력해주세요."
        required
      />

      <EventEditor
        onChange={setContent}
        initialContent={content}
      />
    </>
  );
}; 