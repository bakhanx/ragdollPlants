import React from 'react';

export interface TermsContentType {
  title: string;
  content: React.ReactNode;
}

export const termsContent: Record<'service' | 'privacy' | 'marketing', TermsContentType> = {
  service: {
    title: '서비스 이용약관',
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">제1조 (목적)</h3>
          <p className="text-gray-600 leading-relaxed">
            이 약관은 RagdollPlants (이하 &quot;회사&quot;라 합니다)가 제공하는 식물 관리 서비스 (이하 &quot;서비스&quot;라 합니다)의 
            이용에 관한 조건 및 절차, 회사와 이용자의 권리, 의무, 책임사항 등을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">제2조 (정의)</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>① &quot;서비스&quot;란 회사가 제공하는 식물 관리, 일기 작성, 갤러리 공유 등의 모든 서비스를 의미합니다.</p>
            <p>② &quot;이용자&quot;란 회사의 서비스에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</p>
            <p>③ &quot;회원&quot;이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">제3조 (서비스의 제공)</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>① 회사는 다음과 같은 업무를 수행합니다:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>식물 관리 정보 제공</li>
              <li>식물 일기 작성 및 관리 도구 제공</li>
              <li>식물 갤러리 및 커뮤니티 서비스</li>
              <li>기타 회사가 정하는 업무</li>
            </ul>
            <p>② 회사는 서비스의 품질 향상을 위해 서비스의 내용을 변경할 수 있으며, 변경 시 그 내용과 제공일자를 명시하여 현재의 서비스 화면에 게시합니다.</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">제4조 (회원가입 및 탈퇴)</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.</p>
            <p>② 회원은 언제든지 회원탈퇴를 신청할 수 있으며, 회사는 즉시 회원탈퇴를 처리합니다.</p>
            <p>③ 회원탈퇴 시 회원의 모든 데이터는 개인정보처리방침에 따라 처리됩니다.</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">제5조 (금지행위)</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>회원은 다음 각 호에 해당하는 행위를 하여서는 안 됩니다:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>신청 또는 변경 시 허위 내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>회사가 게시한 정보의 변경</li>
              <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
              <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">제6조 (서비스 이용제한)</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>① 회사는 회원이 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.</p>
            <p>② 회사는 전항에도 불구하고, 주민등록법을 위반한 명의도용 및 결제도용, 전화번호 도용, 저작권법 및 컴퓨터프로그램보호법을 위반한 불법프로그램의 제공 및 운영방해, 정보통신망법을 위반한 불법통신 및 해킹, 악성프로그램의 배포, 접속권한 초과행위 등과 같이 관련법을 위반한 경우에는 즉시 영구이용정지를 할 수 있습니다.</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">제7조 (책임의 한계)</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</p>
            <p>② 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</p>
            <p>③ 회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">제8조 (분쟁해결)</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>① 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.</p>
            <p>② 회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다.</p>
          </div>
        </section>
      </div>
    )
  },

  privacy: {
    title: '개인정보 처리방침',
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">제1조 (개인정보의 처리목적)</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>RagdollPlants는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>회원 가입 및 관리</li>
              <li>서비스 제공 및 운영</li>
              <li>식물 관리 정보 맞춤화</li>
              <li>고객 문의 응답 및 서비스 개선</li>
              <li>새로운 서비스 개발 및 특화</li>
              <li>통계작성, 학술연구 또는 시장조사</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">제2조 (처리하는 개인정보 항목)</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p><strong>필수 정보:</strong></p>
            <ul className="list-disc ml-6 space-y-1">
              <li>아이디, 이름, 이메일 주소</li>
              <li>비밀번호 (암호화 저장)</li>
              <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
            </ul>
            <p className="mt-4"><strong>선택 정보:</strong></p>
            <ul className="list-disc ml-6 space-y-1">
              <li>연락처</li>
              <li>프로필 사진</li>
              <li>관심 식물 정보</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">제3조 (개인정보의 보유 및 이용기간)</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>① 회원탈퇴 시까지 보유하며, 탈퇴 후 즉시 파기합니다.</p>
            <p>② 다만, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>부정이용 기록: 1년 (정보통신망법)</li>
              <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">제4조 (개인정보의 제3자 제공)</h3>
          <p className="text-gray-600 leading-relaxed">
            회사는 정보주체의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 
            다만, 법령의 규정에 의거하거나, 수사 목적으로 법정절차에 의해 요구되는 경우는 예외로 합니다.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">제5조 (개인정보 처리위탁)</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>위탁업체: AWS (Amazon Web Services)</li>
              <li>위탁업무: 클라우드 서비스 제공 및 데이터 보관</li>
              <li>위탁업체: 이메일 발송 서비스</li>
              <li>위탁업무: 회원 대상 이메일 발송</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">제6조 (정보주체의 권리·의무)</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>개인정보 처리현황 통지요구</li>
              <li>개인정보 열람요구</li>
              <li>개인정보 정정·삭제요구</li>
              <li>개인정보 처리정지요구</li>
            </ul>
            <p>② 권리 행사는 개인정보보호법 시행규칙 별지 제8호에 따라 작성하여 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">제7조 (개인정보보호책임자)</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다:</p>
            <div className="bg-blue-50 p-4 rounded-lg mt-2">
              <p><strong>개인정보보호책임자</strong></p>
              <p>담당부서: 개발팀</p>
              <p>연락처: privacy@ragdollplants.com</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">제8조 (개인정보 처리방침 변경)</h3>
          <p className="text-gray-600 leading-relaxed">
            이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
          </p>
        </section>
      </div>
    )
  },

  marketing: {
    title: '마케팅 정보 수신 동의',
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">수집 및 이용 목적</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>RagdollPlants는 다음의 목적으로 마케팅 정보를 발송합니다:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>식물 관리 팁 및 계절별 가이드 제공</li>
              <li>새로운 기능 및 서비스 소개</li>
              <li>이벤트 및 프로모션 정보 안내</li>
              <li>맞춤형 식물 추천 정보</li>
              <li>신상품 및 서비스 출시 알림</li>
              <li>만족도 조사 및 이벤트 참여 안내</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">수집하는 개인정보 항목</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p><strong>필수 항목:</strong> 이메일 주소</p>
            <p><strong>선택 항목:</strong> 이름, 관심 식물 분야, 서비스 이용 패턴</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">보유 및 이용기간</h3>
          <p className="text-gray-600 leading-relaxed">
            마케팅 정보 수신 동의일로부터 동의 철회 시 또는 회원 탈퇴 시까지 보유 및 이용합니다.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">발송 방법 및 빈도</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p><strong>발송 방법:</strong> 이메일, 앱 푸시 알림, SMS (동의 시)</p>
            <p><strong>발송 빈도:</strong> 주 1-2회 (중요 공지는 별도 발송 가능)</p>
            <p><strong>발송 시간:</strong> 오전 9시 ~ 오후 6시 (법정공휴일 제외)</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">동의 철회 방법</h3>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>마케팅 정보 수신에 대한 동의는 언제든지 다음과 같은 방법으로 철회할 수 있습니다:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>마이페이지 &gt; 알림 설정에서 변경</li>
              <li>수신된 이메일의 &quot;수신거부&quot; 링크 클릭</li>
              <li>고객센터(help@ragdollplants.com)를 통한 요청</li>
              <li>개인정보보호책임자에게 서면, 전화, 이메일로 연락</li>
            </ul>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">동의 거부권 및 불이익</h3>
          <p className="text-gray-600 leading-relaxed">
            마케팅 정보 수신 동의는 선택사항이며, 동의하지 않으셔도 기본 서비스 이용에는 제한이 없습니다. 
            다만, 맞춤형 정보 제공 및 이벤트 참여 기회를 놓칠 수 있습니다.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">혜택 안내</h3>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-purple-800 font-medium mb-2">🌱 마케팅 정보 수신 동의 시 혜택:</p>
            <ul className="list-disc ml-6 space-y-1 text-purple-700">
              <li>계절별 식물 관리 가이드 우선 제공</li>
              <li>새로운 기능 베타 테스트 참여 기회</li>
              <li>독점 이벤트 및 할인 정보</li>
              <li>전문가의 맞춤형 식물 추천</li>
              <li>월간 식물 관리 리포트 제공</li>
              <li>커뮤니티 우수 게시글 작성자 혜택</li>
            </ul>
          </div>
        </section>
      </div>
    )
  }
}; 