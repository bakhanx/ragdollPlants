import React from 'react';
import { FormField } from './FormField';

export interface EventDetailsSectionProps {
  title: string;
  setTitle: (value: string) => void;
  subtitle: string;
  setSubtitle: (value: string) => void;
  period: string;
  setPeriod: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
}

export const EventDetailsSection = ({
  title, setTitle,
  subtitle, setSubtitle,
  period, setPeriod,
  description, setDescription,
  content, setContent
}: EventDetailsSectionProps) => {
  return (
    <>
      <FormField
        id="title"
        label="이벤트 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="예: 봄맞이 가드닝 이벤트"
        required
      />

      <FormField
        id="subtitle"
        label="부제목"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        placeholder="예: 신규 회원 20% 할인"
        required
      />

      <FormField
        id="period"
        label="이벤트 기간"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        placeholder="예: 2024.05.01 ~ 2024.05.31"
        required
      />

      <FormField
        id="description"
        label="이벤트 설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="textarea"
        placeholder="이벤트에 대한 간략한 설명을 입력해주세요."
        required
      />

      <FormField
        id="content"
        label="상세 내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        type="textarea"
        rows={5}
        placeholder="이벤트 상세 내용을 입력해주세요."
      />
    </>
  );
}; 