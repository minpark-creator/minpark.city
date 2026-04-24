# minpark.city — Claude 이어서 작업용 핸드오프

이 문서를 통째로 복사해서 새로운 Claude 세션(Claude Code, Claude Design, 또는 Claude.ai)의 첫 메시지에 붙여넣으면, 이전 맥락 없이도 바로 이어서 작업할 수 있다.

---

## 프로젝트 한 줄 요약

Min Park (urban strategist & planner) 의 개인 사이트 `minpark.city` 를 Next.js 16 + Sanity CMS 로 구현하는 중. 레퍼런스는 [simonebodmerturner.com](https://simonebodmerturner.com) 의 editorial/minimal 느낌.

## 기술 스택 (정확히)

- **Next.js 16.2.4** (App Router + Turbopack) — **주의**: 최신 버전이라 training data 와 API 가 다를 수 있음. 새 API 를 쓰기 전 `node_modules/next/dist/docs/` 를 확인할 것
- **React 19.2.4**
- **Tailwind CSS v4** (`@import "tailwindcss"` + `@layer base` 규칙 중요)
- **Sanity v3** — 임베디드 Studio 가 `/studio/[[...tool]]` 라우트에 있음
- **next-sanity**, `@sanity/client`, `@sanity/vision`
- **EB Garamond** — `next/font/google` 로 로드, `--font-eb-garamond` CSS 변수 → `--font-serif` 로 연결
- **TypeScript**
- **Playwright MCP** 로 브라우저 검증

## 디자인 시스템

- **배경**: `#fffefc` (크림), **글자**: `#231f20`, **muted**: `#6b6b6b`
- **폰트**: EB Garamond 전체 적용 (serif). 강조는 italic
- **타이틀 46px** 고정 (`leading-none tracking-[-0.01em]`)
- **본문 15–16px**, line-height 1.55–1.7
- **컨테이너**: `max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16`
- **그리드**: 12 컬럼, `gap-x-6~8`

## 사이트 구조

### 홈 (`/`) — [app/page.tsx](app/page.tsx)
1. `Header` — 왼쪽 About/Contact, 중앙 "minpark.city" 홈 링크, 오른쪽 Journal/Photograph
2. `CyclingTitle` — "minpark." 고정, 뒤의 단어가 위→아래로 넘어가며 순환 (46px)
3. Intro 문단 (중앙 정렬)
4. `LogoMarquee` — 가로로 무한 스크롤되는 로고 (각 타일 220px 고정 폭)
5. Selected / View all by date 섹션 네비
6. Selected 프로젝트들 (`ProjectEntry` 12-col grid: 메타 3 / summary 3 / 이미지 3장 6)
7. 모든 프로젝트 갤러리 (`GalleryCard` 5-col grid)

### 서브 페이지 — 모두 페이지 타이틀 없이 콘텐츠부터 바로 시작
- `/about` — bio + sections (Expertise, Selected Clients, Contact)
- `/contact` — intro + email/links dl
- `/journal` — 좌: 제목 리스트 / 우: 선택된 글 본문 (클라이언트 컴포넌트로 state 관리)
- `/photograph` — **상단 히어로 (3:2 aspect)** + 아래로 스크롤 시 좌: 제목 리스트 / 우: 이미지 뷰어

## 핵심 파일 지도

```
app/
  layout.tsx                     ← EB Garamond 로드, html 에 font-variable 주입
  globals.css                    ← Tailwind + tokens + marquee 키프레임 + @layer base
  page.tsx                       ← 홈
  components/
    Header.tsx                   ← 3분할 네비 (About/Contact · minpark.city · Journal/Photograph)
    Footer.tsx                   ← ©{current year} 만
    PageShell.tsx                ← max-w 컨테이너 + Header/main/Footer 래퍼
    CyclingTitle.tsx             ← "use client" grid-cols-2 로 prefix 고정, translateY slide
    LogoMarquee.tsx              ← flex + marquee-track, 각 타일 220px w
    ProjectEntry.tsx             ← Selected 섹션의 한 줄짜리 프로젝트 카드
    GalleryCard.tsx              ← 작은 썸네일 + 제목 + year
    ProjectThumb.tsx             ← 이미지 or #efeae2 placeholder
  about/page.tsx
  contact/page.tsx
  journal/page.tsx + JournalClient.tsx
  photograph/page.tsx + PhotographClient.tsx
  studio/[[...tool]]/
    page.tsx                     ← 서버 컴포넌트, metadata export
    StudioClient.tsx             ← "use client", NextStudio 렌더

sanity/
  client.ts
  env.ts                         ← hasSanity 플래그
  queries.ts                     ← 타입 정의 + GROQ + fetch 함수 (각각 fallback 으로 graceful degrade)
  fallback.ts                    ← Min Park 실제 콘텐츠 시드 (.env.local 없어도 사이트 동작)
  schemas/
    index.ts                     ← 6개 스키마 export
    siteSettings.ts              ← 싱글턴: title prefix, cycling words, intro, logos[]
    aboutPage.ts                 ← 싱글턴: headline, bio, sections[{title, items[{year,text}]}]
    contactPage.ts               ← 싱글턴: headline, intro, email, location, links[]
    project.ts                   ← title, slug, year, date, client, location, role, summary, body, images[], isSelected
    journalEntry.ts
    photograph.ts

sanity.config.ts                 ← Studio structure (singletons + document types 분리 렌더링)
.env.local                       ← NEXT_PUBLIC_SANITY_PROJECT_ID=dxqmuym2 / DATASET=production
```

## 이미 잡은 함정들 (다시 밟지 말 것)

1. **Tailwind v4 cascade layers**: unlayered CSS 규칙이 layered utility 를 이긴다. 전역 리셋 (`button { background: none }`, `p { margin: 0 }` 등) 은 반드시 `@layer base { :where(...) { ... } }` 안에 넣을 것. 안 그러면 `bg-[#efeae2]`, `mx-auto` 같은 유틸이 무시됨.

2. **Turbopack HMR 이 CSS 를 캐시한다**: `globals.css` 수정이 반영 안 되면 `pkill -f "next dev" && rm -rf .next && npm run dev` 풀 재시작.

3. **next/font 는 `className` 로만 적용됨**: `<html className={ebGaramond.variable}>` 에 붙이고 CSS 에서 `var(--font-eb-garamond)` 로 참조. body 에 바로 붙이지 말 것.

4. **Studio 페이지의 `metadata` export**: `"use client"` 파일에서는 `metadata` 를 export 할 수 없음 → 서버 컴포넌트 `page.tsx` 에서 metadata export 하고, 실제 `<NextStudio>` 렌더링은 `StudioClient.tsx` ("use client") 에 분리.

5. **CyclingTitle 레이아웃**: 단순 `inline-flex` 로 감싸면 단어 바뀔 때마다 `minpark.` 위치가 흔들린다. `grid grid-cols-2 items-baseline` 으로 prefix 를 오른쪽 정렬 / 단어를 왼쪽 정렬해서 중앙선에 고정할 것.

6. **Marquee 이음새**: `flex gap-8` 을 쓰면 반복 지점에서 gap 계산이 안 맞아 점프함. 각 타일에 동일한 `px-X` 또는 고정 `w-[220px]` 를 주고 트랙에서는 gap 을 빼고, `width: max-content` + doubled array + `translateX(-50%)` 로 돌려야 끊김 없음.

7. **Sanity 환경 변수 없을 때**: 사이트가 깨지지 않게 `queries.ts` 의 모든 fetch 가 `try/catch` → `fallback.ts` 데이터로 폴백. 이 디자인을 유지할 것.

## 현재 남은 실제 콘텐츠 원본

실 사이트 [minpark.city](https://minpark.city) 에 있는 내용:
- Bio: "I'm Min Park, an urban strategist and planner working at the intersection of planning, research, and spatial vision."
- Expertise: Strategic planning, Visioning & spatial narratives, Policy research, Masterplanning, Public speaking & lectures
- 6 projects: Green Belts 2.0 (C40, 2026), Stratford Islands (Academic, 2023), Riyadh Ring (2026), MPlan Mag (2026), Holcim Foundation Fellowship (2025), Europe-Korea Conference (2025)
- Email: `contact.minpark@gmail.com`
- Instagram [@iamminggoo](https://www.instagram.com/iamminggoo/), LinkedIn `minpark-urban-strategy`, Threads `@iamminggoo`

이 내용이 [sanity/fallback.ts](sanity/fallback.ts) 에 시드되어 있음.

## 로컬 실행

```bash
cd "/Users/bagmin/Documents/2026/freelancer website making/independence"
npm install            # 처음 한 번
npm run dev            # http://localhost:3000
```

- **홈**: http://localhost:3000
- **Studio (CMS)**: http://localhost:3000/studio

## Sanity 프로젝트 정보

- **Project ID**: `dxqmuym2`
- **Dataset**: `production`
- **Manage**: https://www.sanity.io/manage/project/dxqmuym2
- **CORS**: `http://localhost:3000` 이 반드시 CORS origins 에 등록되고 *Allow credentials* 체크되어 있어야 Studio 가 동작

## 아직 미완 / 이어서 할 만한 것

- [ ] 각 프로젝트 상세 페이지 (`/works/[slug]`) — 지금은 홈에 Selected 로만 노출. 슬러그는 스키마에 이미 있음
- [ ] 모바일 네비 햄버거 (현재는 데스크탑 우선)
- [ ] 이미지 hover 인터랙션 (포토그래프 리스트)
- [ ] OG / favicon — `app/layout.tsx` metadata + `app/favicon.ico` 교체

## 작업할 때 지켜줬으면 하는 원칙

- 변경 후 반드시 Playwright MCP 로 `http://localhost:3000` 스크린샷 찍어서 확인할 것
- Tailwind v4 규약 준수 (cascade layer 이슈 주의)
- Next.js 16 의 최신 API 기준. training data 의 옛날 API 쓰지 말고 `node_modules/next/dist/docs/` 참조
- 불필요한 주석/과잉 추상화 금지. 바로 돌아가는 코드 우선
- Sanity fallback 패턴 유지: 모든 fetch 는 try/catch + fallback
