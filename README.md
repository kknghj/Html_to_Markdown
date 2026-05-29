# Html_to_Markdown

AI 답변(ChatGPT, Claude, Gemini, Cursor 등)을 복사해 붙여넣으면 Markdown으로 변환하는 웹앱 MVP입니다.

## 설치

```bash
pnpm install
```

## 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

## 빌드

```bash
pnpm build
pnpm start
```

## 사용 방법

1. AI 답변을 복사합니다.
2. 좌측 Input 영역에 붙여넣기(Ctrl+V)합니다.  
   - `text/html`이 있으면 HTML로 변환합니다.  
   - 없으면 `text/plain`을 사용합니다.
3. 우측 Output에서 Markdown 결과를 확인합니다.
4. **Copy Markdown**으로 클립보드에 복사해 Cursor, GitHub, Notion 등에 붙여넣습니다.

**Load Sample HTML** 버튼으로 표·리스트·코드·체크박스 샘플 변환을 바로 확인할 수 있습니다.

## 기술 스택

| 라이브러리 | 역할 |
|-----------|------|
| [Next.js](https://nextjs.org/) (App Router) | React 프레임워크, 클라이언트 중심 UI |
| [TypeScript](https://www.typescriptlang.org/) | strict 타입 안전성 |
| [Tailwind CSS](https://tailwindcss.com/) | 반응형 2열 레이아웃·스타일 |
| [Turndown](https://github.com/mixmark-io/turndown) | HTML → Markdown 변환 |
| [@truto/turndown-plugin-gfm](https://www.npmjs.com/package/@truto/turndown-plugin-gfm) | GFM(표, 체크박스 등) 지원 |

변환 로직은 브라우저에서만 실행되며 서버 API는 사용하지 않습니다.

## 프로젝트 구조

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── InputPanel.tsx
│   ├── OutputPanel.tsx
│   ├── Toolbar.tsx
│   └── Toast.tsx
├── hooks/
│   └── useClipboardPaste.ts
└── lib/
    ├── markdownConverter.ts
    └── sampleHtml.ts
```

## 향후 확장 포인트

- Markdown 미리보기 (react-markdown 등)
- 변환 히스토리 (localStorage / DB)
- Drag & Drop · 파일 업로드
- Chrome Extension
- Notion / GitHub 직접 Export
- Turndown 규칙 커스터마이징 (AI별 HTML 패치)
