# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 환경 변수 설정

이 프로젝트는 여러 외부 서비스를 사용하므로 환경 변수 설정이 필요합니다.

### 1. `.env` 파일 생성

프로젝트 루트 디렉토리에 `.env` 파일을 생성하세요. `.env.example` 파일을 참고하여 다음 환경 변수들을 설정합니다:

```env
# Supabase 설정
VITE_SUPABASE_URL=https://vokdtihuzdbcgylftrar.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# 토스페이먼츠 설정
VITE_TOSS_CLIENT_KEY=your-toss-client-key

# OpenAI 설정 (채팅봇)
VITE_OPENAI_API_KEY=your-openai-api-key
```

### 2. 환경 변수 설명

- **VITE_SUPABASE_URL**: Supabase 프로젝트 URL
- **VITE_SUPABASE_ANON_KEY**: Supabase Anon (Public) Key
- **VITE_TOSS_CLIENT_KEY**: 토스페이먼츠 클라이언트 키
- **VITE_OPENAI_API_KEY**: OpenAI API 키 (채팅봇 기능용)

### 3. 중요 사항

- `.env` 파일은 Git에 커밋되지 않습니다 (`.gitignore`에 포함됨)
- 실제 API 키는 절대 공개 저장소에 커밋하지 마세요
- 로컬 개발 시 `npm run dev`를 실행하기 전에 `.env` 파일이 루트에 존재해야 합니다

## Supabase DB 연동 가이드

이 프로젝트는 Supabase를 사용해 결제 내역을 저장합니다. 아래 순서대로 설정하세요.

2. **DB 스키마 생성**
   - Supabase 대시보드 > SQL Editor에서 `sql/create_payments_table.sql`과 `sql/create_favorites_table.sql`을 실행해 필요한 테이블을 만듭니다.

3. **Row Level Security 및 정책**
   - 동일한 SQL Editor에서 `sql/payments_policies.sql`과 `sql/favorites_policies.sql`을 실행해 두 테이블 모두에 RLS와 정책을 적용하세요.

4. **테스트**
   - 앱에서 장바구니 결제 버튼을 눌러 결제 내역이 저장되는지 확인하고, `/mypage.html`에서 목록이 조회되는지 검증하세요.
