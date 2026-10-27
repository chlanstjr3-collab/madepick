# MadePick: 실서비스 연결 안내

현재 배포 주소: https://chlanstjr3-collab.github.io/madepick/

## 완료된 코드

한국어/영어 UI, Google 로그인 연결 로직, 회원 프로필, 요청/제작/전시 항목의 공용 데이터 조회와 작성, 참여, 진행상태, 댓글, 별점 리뷰, 추천/비추천, 기간별 랭킹, 본인 글 수정/삭제, 신고, GitHub Pages 자동 배포 및 JS 문법 검사.

현재 가짜 상품과 가짜 추천 수는 완전히 제거했습니다.

## 보류된 계정 연결

Supabase 프로젝트 생성, 데이터베이스 SQL 실행, Google OAuth Provider 설정, publishable key 입력, 여러 사용자 계정으로 실제 통합 검증은 계정 소유자 인증과 권한이 필요하므로 아직 진행되지 않았습니다.

### 1. Supabase

1. https://supabase.com 에서 프로젝트를 만들고 Supabase SQL Editor에서 supabase/schema.sql을 새 프로젝트에 한 번 실행합니다.
2. Supabase Project Settings → API에서 Project URL과 publishable key (legacy anon key 가능)를 찾습니다.
3. GitHub 저장소의 config.js를 편집하여 공개 값을 넣습니다. 예:

    window.MADEPICK_CONFIG = {
      supabaseUrl: "https://YOUR-PROJECT.supabase.co",
      supabaseAnonKey: "YOUR_PUBLISHABLE_KEY"
    };

4. 저장(Commit)하면 GitHub Pages 배포가 자동으로 실행됩니다.

주의: service_role 키, sb_secret_... 키, Google OAuth client secret을 GitHub 코드나 대화에 절대 업로드하지 마세요. 공개용 publishable 키는 브라우저에 들어가도 되는 키이지만 SQL의 Row Level Security(RLS) 적용이 전제입니다.

### 2. Google OAuth

1. Google Auth Platform/Google Cloud Console에서 Web application용 OAuth Client ID와 Secret을 만듭니다.
2. Google Authorized JavaScript origins: https://chlanstjr3-collab.github.io
3. Google Authorized redirect URIs: Supabase Authentication → Providers → Google에 나오는 Callback URL (대개 https://YOUR-PROJECT.supabase.co/auth/v1/callback).
4. Google Client ID와 Client Secret은 Supabase의 Google Provider 설정 화면에만 입력합니다.
5. Supabase Authentication → URL Configuration:
   Site URL: https://chlanstjr3-collab.github.io/madepick/
   Redirect URLs: https://chlanstjr3-collab.github.io/madepick/
6. Google OAuth 동의 화면이 테스트 모드라면 테스트 사용자 추가 또는 공개 설정이 필요합니다.

공식 참고:
- https://supabase.com/docs/guides/auth/social-login/auth-google
- https://supabase.com/docs/guides/auth/redirect-urls

### 3. 두 계정으로 통합 테스트

- Google 계정 A로 로그인하고 요청 글과 댓글을 남깁니다.
- 계정 B로 로그인하여 A의 요청 글을 보고 제작 참여/진행 상태를 변경합니다.
- B가 자신이 만든 실제 HTTPS 작품 링크를 전시하고 요청과 연결합니다.
- A가 작품을 직접 사용해 본 뒤 별점 리뷰와 댓글을 남깁니다.
- 다른 사람 글을 수정할 수 없는지, 자기 글 삭제만 가능한지 확인합니다.
- 투표가 중복되지 않는지, 랭킹 값이 실제 투표로 계산되는지 확인합니다.

## 실서비스 운영 주의점

- 현재 Supabase 연결이 없으므로 로그인/등록은 비활성에 가까운 설정 안내 단계입니다. 데이터베이스 연결 뒤에야 실제 다중 사용자 서비스로 사용할 수 있습니다.
- 코드에는 가짜 등록 상품이나 허위 추천 숫자를 넣지 않았습니다.
- GitHub Pages 프런트엔드는 정적 단일 페이지 앱(SPA)입니다. 개별 작품 URL은 #/product/아이디 형태이므로 검색엔진의 작품별 SEO를 위해서는 Next.js SSR/SSG 혹은 별도 서버 렌더링으로 이전해야 합니다.
- 현재 데이터 조회 최대치는 초기 베타 기준 250~1000건입니다. 실제 이용자가 늘면 서버 페이지네이션과 캐시를 추가하세요.
- 신고용 데이터베이스와 버튼은 있으나 전문 관리자 화면, 자동 콘텐츠 검열, CAPTCHA 및 강화된 속도 제한이 필요합니다.
- 공개 운영 전 개인정보처리방침과 서비스 약관, 운영자 연락처, 신고 처리 기준을 확정하세요.

서비스 코드: index.html, app.js, styles.css, config.js
데이터베이스 코드: supabase/schema.sql
자동 배포: .github/workflows/pages.yml

## 4. 작품 사진 저장소 연결

위의 supabase/schema.sql 파일 안에는 사진 저장용 Supabase Storage 공개 버킷인
product-media의 생성 코드와 보안 정책도 포함되어 있습니다. 새 프로젝트에 전체 SQL을 적용하면
따로 Storage 버킷을 수동으로 생성할 필요가 없습니다.

- 사진 최대 5장 / 한 장에 최대 5MB / JPG, PNG, WebP만 지원합니다.
- 첫 번째 사진이 전시 목록과 작품 상세페이지의 대표 이미지입니다.
- 사진의 저장 경로는 로그인 사용자 UUID / 작품 UUID / 임의 사진 UUID의 형태입니다.
- 본인 폴더에만 업로드/삭제할 수 있도록 storage.objects의 RLS 정책을 적용합니다.
- **public 버킷이므로 업로드한 작품 이미지는 누구나 URL로 볼 수 있습니다.**
  개인정보, 신분증, 비밀 문서, 비공개 자료는 업로드하지 않아야 합니다.
- 사진 업로드가 실패하면 작품 등록도 완료되지 않으며, 가능한 한 업로드한 파일을 정리하도록 구현했습니다.
- 작품 등록 후 사진을 추가하거나 삭제하고 홍보 문구를 수정할 수 있습니다.
- Supabase가 아직 연결되지 않았으므로 실사진 업로드까지는 검증되지 않았습니다.

작품 등록 화면에서 다음 항목들을 작성할 수 있습니다:
제목, 짧은 홍보 문구, 상세 소개, 주요 기능/장점, 카테고리,
실제 이용 가능한 외부 웹사이트 주소, 관련 요청, 소개 사진.
