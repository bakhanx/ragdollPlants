import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Input } from './Input';
import { Button } from './Button';
import { PasswordInput } from './PasswordInput';
import { TermsAgreement } from './TermsAgreement';
import { signUpSchema, type SignUpData } from '@/lib/validations/auth';
import { signUpAction } from '../signup/actions';

export const SignUpForm: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<string>('');
  
  // 약관 동의 상태 관리
  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
    age: false,
    marketing: false
  });

  // 개별 약관 동의 변경
  const handleAgreementChange = (type: keyof typeof agreements) => {
    setAgreements(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // 전체 동의 변경 (필수 약관만)
  const handleAllAgreementChange = (checked: boolean) => {
    setAgreements(prev => ({
      ...prev,
      service: checked,
      privacy: checked,
      age: checked,
      // marketing은 선택사항이므로 전체 동의에서 제외
    }));
  };

  // 필수 약관 모두 동의했는지 확인
  const isAllRequiredAgreed = agreements.service && agreements.privacy && agreements.age;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur' // 입력 필드를 벗어날 때 검증
  });

  const onSubmit = async (data: SignUpData) => {
    // 필수 약관 동의 확인
    if (!isAllRequiredAgreed) {
      setServerMessage('필수 약관에 모두 동의해주세요.');
      return;
    }

    setIsSubmitting(true);
    setServerMessage('');

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone || '');
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);
      formData.append('agreeToTerms', 'true'); // 필수 약관 동의 완료
      formData.append('marketingAgreement', agreements.marketing.toString()); // 마케팅 동의 추가

      // 서버 액션 호출
      const result = await signUpAction(formData);

      if (result.success) {
        setServerMessage(result.message || '회원가입이 완료되었습니다!');
        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setServerMessage(result.message || '회원가입에 실패했습니다.');
        
        // 서버에서 반환된 필드별 에러 처리
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            setError(field as keyof SignUpData, {
              type: 'server',
              message: messages[0]
            });
          });
        }
      }
    } catch (error) {
      console.error('회원가입 요청 중 오류:', error);
      setServerMessage('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 서버 메시지 표시 */}
      {serverMessage && (
        <div className={`p-4 rounded-lg text-center ${
          serverMessage.includes('완료') || serverMessage.includes('성공')
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {serverMessage}
        </div>
      )}

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
        <Input
          {...register('username')}
          placeholder="아이디"
          type="text"
          error={errors.username?.message}
        />
        
        <Input
          {...register('name')}
          placeholder="이름"
          type="text"
          error={errors.name?.message}
        />
        
        <Input
          {...register('email')}
          placeholder="이메일"
          type="email"
          error={errors.email?.message}
        />
        
        <Input
          {...register('phone')}
          placeholder="연락처 (선택사항) - 010-0000-0000"
          type="text"
          error={errors.phone?.message}
        />
        
        <PasswordInput
          {...register('password')}
          placeholder="비밀번호"
          error={errors.password?.message}
          showStrengthMeter={true}
        />
        
        <PasswordInput
          {...register('confirmPassword')}
          placeholder="비밀번호 재확인"
          error={errors.confirmPassword?.message}
          showStrengthMeter={false}
        />

        {/* 이용 약관 */}
        <div className="w-full py-4">
          {/* react-hook-form용 hidden 필드 */}
          <input 
            {...register('agreeToTerms')}
            type="hidden"
            value={isAllRequiredAgreed.toString()}
          />
          
          <TermsAgreement
            agreements={agreements}
            onAgreementChange={handleAgreementChange}
            onAllAgreementChange={handleAllAgreementChange}
            isAllRequiredAgreed={isAllRequiredAgreed}
          />
        </div>

        {/* 버튼 */}
        <Button
          text={isSubmitting ? "회원가입 중..." : "회원가입"}
          buttonType="primary"
          disabled={isSubmitting || !isAllRequiredAgreed}
        />
      </form>
    </div>
  );
}; 