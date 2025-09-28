export interface ArticleData {
  title: string;
  content: string;
  summary: string;
  image: string;
  tags: string[];
  categoryId: string;
}

export const ARTICLE_DATA: ArticleData[] = [
  {
    title: '초보자를 위한 몬스테라 키우기 완벽 가이드',
    summary:
      '몬스테라를 처음 키우는 분들을 위한 물주기, 빛 관리, 분갈이까지 모든 것을 알려드립니다.',
    content: `<h1>몬스테라 키우기 완벽 가이드</h1>

<h2>몬스테라란?</h2>
<p>몬스테라(Monstera deliciosa)는 중남미가 원산지인 아로이드과 식물로, 특유의 구멍 뚫린 잎으로 유명합니다. 실내에서 키우기 쉬워 초보자들에게 인기가 높은 식물입니다.</p>

<h2>기본 관리법</h2>

<h3>1. 빛 관리</h3>
<ul>
<li><strong>밝은 간접광</strong>을 선호합니다</li>
<li>직사광선은 잎을 태울 수 있으니 피해주세요</li>
<li>북향 창가나 커튼으로 빛을 걸러주는 곳이 좋습니다</li>
</ul>

<h3>2. 물주기</h3>
<ul>
<li>흙 표면이 마르면 충분히 물을 줍니다</li>
<li>보통 <strong>일주일에 1-2번</strong> 정도가 적당합니다</li>
<li>겨울에는 물주기 간격을 늘려주세요</li>
</ul>

<h3>3. 습도 관리</h3>
<ul>
<li><strong>50-60%</strong>의 습도를 유지해주세요</li>
<li>가습기를 사용하거나 물을 담은 그릇을 근처에 두세요</li>
<li>잎에 분무를 해주는 것도 좋습니다</li>
</ul>

<h3>4. 온도</h3>
<ul>
<li><strong>18-25°C</strong>가 적정 온도입니다</li>
<li>15°C 이하로 내려가지 않도록 주의하세요</li>
</ul>

<h2>분갈이 시기와 방법</h2>

<h3>언제 분갈이를 해야 할까요?</h3>
<ul>
<li>뿌리가 화분 밑으로 나올 때</li>
<li>물이 잘 빠지지 않을 때</li>
<li>보통 <strong>2-3년에 한 번</strong> 정도</li>
</ul>

<h3>분갈이 방법</h3>
<ol>
<li>기존 화분보다 <strong>한 치수 큰 화분</strong> 준비</li>
<li>배수가 잘 되는 흙 사용 (배양토 + 펄라이트)</li>
<li>뿌리를 살살 풀어준 후 새 화분에 심기</li>
<li>분갈이 후 <strong>일주일 정도는 그늘</strong>에서 관리</li>
</ol>

<h2>자주 발생하는 문제와 해결법</h2>

<h3>잎이 노랗게 변할 때</h3>
<ul>
<li><strong>과습</strong>이 원인일 가능성이 높습니다</li>
<li>물주기를 줄이고 통풍을 좋게 해주세요</li>
</ul>

<h3>잎에 갈색 반점이 생길 때</h3>
<ul>
<li><strong>직사광선</strong>에 의한 화상일 수 있습니다</li>
<li>더 그늘진 곳으로 옮겨주세요</li>
</ul>

<h3>새 잎에 구멍이 없을 때</h3>
<ul>
<li><strong>빛이 부족</strong>하거나 <strong>어린 식물</strong>일 수 있습니다</li>
<li>시간이 지나면서 자연스럽게 구멍이 생깁니다</li>
</ul>

<h2>번식 방법</h2>

<h3>삽목으로 번식하기</h3>
<ol>
<li><strong>기근(공중뿌리)이 있는 줄기</strong>를 잘라주세요</li>
<li>물에 꽂아 뿌리를 내리거나 바로 흙에 심어도 됩니다</li>
<li>2-3주 후 새로운 뿌리가 나옵니다</li>
</ol>

<h2>마무리</h2>
<p>몬스테라는 관리가 쉬운 편이지만, 기본적인 관리법을 지켜주면 더욱 건강하게 자랍니다. 인내심을 갖고 꾸준히 관리해주시면 아름다운 몬스테라를 키울 수 있을 거예요!</p>`,
    image: '/images/welcome-bg-02.webp',
    tags: ['몬스테라', '초보자', '실내식물', '관리법'],
    categoryId: 'GUIDE'
  },
  {
    title: '실내 공기정화 식물 BEST 10',
    summary:
      'NASA가 인정한 공기정화 효과가 뛰어난 실내식물들을 소개합니다. 건강한 실내 환경을 만들어보세요.',
    content: `<h1>실내 공기정화 식물 BEST 10</h1>

<p>실내 공기 질이 걱정되시나요? NASA 연구에서 입증된 공기정화 효과가 뛰어난 식물들을 소개합니다.</p>

<h2>TOP 10 공기정화 식물</h2>

<h3>1. 산세베리아 (Sansevieria)</h3>
<ul>
<li><strong>제거 성분</strong>: 포름알데히드, 벤젠, 자일렌</li>
<li><strong>특징</strong>: 밤에도 산소를 방출하는 특별한 식물</li>
<li><strong>관리</strong>: 물을 적게 줘도 되어 초보자에게 완벽</li>
</ul>

<h3>2. 스파티필름 (Peace Lily)</h3>
<ul>
<li><strong>제거 성분</strong>: 암모니아, 벤젠, 포름알데히드</li>
<li><strong>특징</strong>: 아름다운 흰 꽃이 피는 공기정화 식물</li>
<li><strong>관리</strong>: 습도를 좋아하므로 분무를 자주 해주세요</li>
</ul>

<h3>3. 아레카야자 (Areca Palm)</h3>
<ul>
<li><strong>제거 성분</strong>: 포름알데히드, 자일렌, 톨루엔</li>
<li><strong>특징</strong>: 천연 가습기 역할도 하는 야자수</li>
<li><strong>관리</strong>: 밝은 간접광과 적당한 습도 필요</li>
</ul>

<h3>4. 고무나무 (Rubber Plant)</h3>
<ul>
<li><strong>제거 성분</strong>: 포름알데히드</li>
<li><strong>특징</strong>: 넓은 잎으로 높은 공기정화 효과</li>
<li><strong>관리</strong>: 물주기가 쉽고 성장이 빠름</li>
</ul>

<h3>5. 드라세나 (Dracaena)</h3>
<ul>
<li><strong>제거 성분</strong>: 벤젠, 포름알데히드, 트리클로로에틸렌</li>
<li><strong>특징</strong>: 다양한 품종으로 인테리어 효과도 좋음</li>
<li><strong>관리</strong>: 직사광선을 피하고 적당한 물주기</li>
</ul>

<h2>공간별 배치 팁</h2>

<h3>거실</h3>
<p><strong>아레카야자, 고무나무</strong>: 큰 공간에 적합한 대형 식물</p>

<h3>침실</h3>
<p><strong>산세베리아</strong>: 밤에도 산소 방출로 수면에 도움</p>

<h3>욕실</h3>
<p><strong>보스턴고사리, 스파티필름</strong>: 습도가 높은 환경 선호</p>

<h2>주의사항</h2>
<ul>
<li>반려동물이 있다면 독성 여부를 확인하세요</li>
<li>정기적인 잎 청소로 공기정화 효과 유지</li>
<li>적절한 환기와 함께 사용하면 더욱 효과적</li>
</ul>

<h2>마무리</h2>
<p>건강한 실내 환경을 위해 지금 바로 공기정화 식물을 들여보세요!</p>`,
    image: '/images/welcome-bg-03.webp',
    tags: ['공기정화', '실내식물', '건강', 'NASA'],
    categoryId: 'TIPS'
  },
  {
    title: '겨울철 식물 관리의 모든 것',
    summary:
      '추운 겨울, 식물들이 건강하게 겨울을 날 수 있도록 도와주는 관리법을 알려드립니다.',
    content: `<h1>겨울철 식물 관리의 모든 것</h1>

<p>겨울이 되면 식물들도 휴면기에 들어갑니다. 이 시기에 올바른 관리를 해주면 봄에 더욱 건강한 모습으로 만날 수 있어요.</p>

<h2>겨울철 식물의 변화</h2>

<h3>성장 속도 둔화</h3>
<ul>
<li>대부분의 식물이 <strong>휴면기</strong>에 들어갑니다</li>
<li>새 잎이 나오는 속도가 현저히 느려집니다</li>
<li>이는 자연스러운 현상이니 걱정하지 마세요</li>
</ul>

<h3>물 흡수량 감소</h3>
<ul>
<li>성장이 둔화되면서 <strong>물 필요량도 줄어듭니다</strong></li>
<li>과습으로 인한 뿌리썩음 주의가 필요합니다</li>
</ul>

<h2>겨울철 관리 포인트</h2>

<h3>1. 물주기 조절</h3>
<ul>
<li><strong>여름의 절반 정도</strong>로 물주기 간격을 늘려주세요</li>
<li>흙이 완전히 마른 후 2-3일 더 기다렸다가 물을 주세요</li>
<li>물의 온도는 <strong>실온</strong>과 비슷하게 맞춰주세요</li>
</ul>

<h3>2. 온도 관리</h3>
<ul>
<li><strong>최저 온도 15°C</strong> 이상 유지</li>
<li>창가는 밤에 온도가 급격히 떨어지니 주의</li>
<li>난방기 바람이 직접 닿지 않도록 해주세요</li>
</ul>

<h3>3. 습도 관리</h3>
<ul>
<li>난방으로 인해 <strong>실내 습도가 낮아집니다</strong></li>
<li>가습기 사용하거나 물을 담은 그릇을 근처에 두세요</li>
<li>잎에 분무를 해주되, 저녁에는 피해주세요</li>
</ul>

<h2>식물별 겨울 관리법</h2>

<h3>다육식물</h3>
<ul>
<li><strong>물주기를 더욱 줄여주세요</strong> (월 1-2회)</li>
<li>5°C 이하로 내려가지 않도록 주의</li>
<li>웃자람 방지를 위해 충분한 빛 제공</li>
</ul>

<h3>관엽식물 (몬스테라, 고무나무 등)</h3>
<ul>
<li>잎에 먼지가 쌓이지 않도록 <strong>정기적으로 닦아주세요</strong></li>
<li>습도 유지가 특히 중요합니다</li>
<li>새 잎이 나오지 않아도 정상입니다</li>
</ul>

<h2>겨울나기 성공 팁</h2>
<ol>
<li><strong>관찰이 가장 중요합니다</strong> - 매일 식물 상태를 확인하세요</li>
<li><strong>인내심을 가지세요</strong> - 겨울에는 성장이 느린 것이 정상입니다</li>
<li><strong>기록을 남기세요</strong> - 물주기 날짜를 기록해두세요</li>
</ol>

<h2>마무리</h2>
<p>겨울철 올바른 관리로 식물들과 함께 따뜻한 겨울을 보내세요!</p>`,
    image: '/images/welcome-bg-05.webp',
    tags: ['겨울관리', '휴면기', '온도관리', '물주기'],
    categoryId: 'GUIDE'
  }
];
