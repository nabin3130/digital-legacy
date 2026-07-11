# 망각인프라 MVP

Next.js App Router + TypeScript + Supabase 기반 디지털 유산 정책 안내 사이트입니다.

## 실행

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 현재 구조
- 로컬 TypeScript 데이터로 즉시 실행
- Supabase 스키마 초안 포함
- 홈 / 회사 상세 / 비교 / 용어 가이드

## 다음 단계
1. Supabase 프로젝트 생성
2. `supabase/migrations/001_init.sql` 실행
3. 로컬 seed 데이터를 DB로 이전
4. 관리자 입력 화면 추가
5. 공식 정책 링크와 신청 링크 검증 후 입력
