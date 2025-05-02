import React from 'react';
import { ContentsLayout } from '../../_components/layout/ContentsLayout';
import BackgroundImage from '../../_components/layout/BackgroundImage';
import Header from '../_components/Header';
import { Input } from '../_components/Input';
import { Checkbox } from '../_components/Checkbox';
import { Button } from '../_components/Button';
import { PasswordInput } from '../_components/PasswordInput';

export default function Page() {
  return (
    <>
      {/* Contents */}
      <BackgroundImage src={'/images/welcome-bg-01.webp'} />

      <ContentsLayout showFooter={false}>
        {/* 헤더 */}
        <Header
          mainText="RagdollPlants"
          subText="랙돌플랜츠"
        />

        {/* Paragraph*/}
        <div className="mb-8 flex flex-col pt-8 text-center text-white">
          <p className="tracking-wide">
            계정을 생성하세요. 식물들이 기다리고 있어요!
          </p>
        </div>

        {/* 입력 폼 */}
        <div className="flex w-full flex-col gap-4">
          <Input
            placeholder="아이디"
            type="text"
          />
          <Input
            placeholder="이름"
            type="text"
          />
          <Input
            placeholder="이메일"
            type="email"
          />
          <Input
            placeholder="연락처 (선택사항)"
            type="text"
          />
          <PasswordInput placeholder="비밀번호" />
          <PasswordInput placeholder="비밀번호 재확인" />
        </div>

        {/* 이용 약관 */}
        <div className="w-full py-4">
          <Checkbox label="이용약관에 모두 동의합니다" />
        </div>

        {/* 버튼 */}
        <Button
          text="회원가입"
          type="primary"
        />
      </ContentsLayout>
    </>
  );
}
