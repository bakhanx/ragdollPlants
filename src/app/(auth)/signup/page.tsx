'use client';

import React from 'react';
import { ContentsLayout } from '../../_components/layout/ContentsLayout';
import BackgroundImage from '../../_components/layout/BackgroundImage';
import Header from '../_components/Header';
import { SignUpForm } from '../_components/SignUpForm';

export default function Page() {
  return (
    <>
      {/* Background */}
      <BackgroundImage src={'/images/welcome-bg-01.webp'} />

      <ContentsLayout showFooter={false}>
        {/* 헤더 */}
        <Header
          mainText="RagdollPlants"
          subText="랙돌플랜츠"
        />

        {/* 설명 */}
        <div className="mb-8 flex flex-col pt-8 text-center text-white">
          <p className="tracking-wide">
            계정을 생성하세요. 식물들이 기다리고 있어요!
          </p>
        </div>

        {/* 회원가입 폼 */}
        <SignUpForm />
      </ContentsLayout>
    </>
  );
}
