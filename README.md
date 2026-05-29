# AI Response → Markdown (Chrome Extension)

ChatGPT, Claude, Gemini, Cursor 등에서 복사한 AI 답변을 Chrome 확장프로그램 팝업에서 즉시 Markdown으로 변환합니다.

## 기술 스택

| 라이브러리 | 역할 |
|-----------|------|
| Manifest V3 | Chrome Extension 최신 스펙 |
| TypeScript (strict) | 타입 안전성 |
| React 19 | Popup UI |
| Vite + [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin) | 확장프로그램 번들링 |
| Tailwind CSS v4 | 스타일 |
| [Turndown](https://github.com/mixmark-io/turndown) | HTML → Markdown |
| [@truto/turndown-plugin-gfm](https://www.npmjs.com/package/@truto/turndown-plugin-gfm) | GFM (표, 체크박스 등) |

변환은 팝업(클라이언트)에서만 실행되며 서버 API는 사용하지 않습니다.

## 프로젝트 구조

```text
public/
└ icons/                 # 확장 아이콘 (16, 48, 128)

src/
├── manifest.json        # MV3 manifest
├── background/
│   └── serviceWorker.ts # MV3 service worker
├── popup/
│   ├── index.html
│   ├── main.tsx
│   ├── Popup.tsx
│   └── Popup.css
├── components/
│   ├── InputPanel.tsx
│   ├── OutputPanel.tsx
│   ├── Toolbar.tsx
│   └── Toast.tsx
├── hooks/
│   └── useClipboardPaste.ts
├── lib/
│   ├── markdownConverter.ts
│   ├── storage.ts         # chrome.storage.local
│   └── clipboard.ts       # 클립보드 읽기/쓰기
└── styles/
    └── globals.css
```

## 설치

```bash
pnpm install
```

## 개발 실행

```bash
pnpm dev
```

Vite가 `dist/`에 확장프로그램을 빌드합니다. 파일 변경 시 자동으로 다시 빌드됩니다.

Chrome에서 **Load unpacked**로 `dist/` 폴더를 로드한 뒤, 확장 아이콘을 클릭해 팝업을 확인하세요. 코드를 수정한 뒤에는 `chrome://extensions`에서 확장프로그램 **새로고침** 버튼을 눌러 반영합니다.

## 프로덕션 빌드

```bash
pnpm build
```

`dist/` 폴더가 생성됩니다. 이 폴더를 Chrome에 로드하거나 Web Store에 업로드합니다.

## 사용 방법

1. AI 답변을 복사합니다 (`Ctrl+C` / `Cmd+C`).
2. 확장프로그램 아이콘을 클릭합니다.
3. 클립보드의 `text/html`(우선) 또는 `text/plain`이 자동으로 변환됩니다.
4. Input에 직접 붙여넣어도 동일하게 변환됩니다.
5. **Copy Markdown**으로 결과를 클립보드에 복사합니다.

팝업을 닫았다 다시 열어도 마지막 Input/Output은 `chrome.storage.local`에 저장되어 유지됩니다.

## Chrome에 Load Unpacked로 설치

1. `pnpm build` 실행
2. Chrome 주소창에 `chrome://extensions` 입력
3. 우측 상단 **개발자 모드** 활성화
4. **압축해제된 확장 프로그램을 로드합니다** 클릭
5. 프로젝트의 **`dist/`** 폴더 선택
6. 툴바에 **AI Response → Markdown** 아이콘이 표시되면 완료

개발 중에는 `pnpm dev`로 watch 빌드 후, `dist/`를 로드하고 변경 시 확장프로그램 새로고침을 사용합니다.

## Chrome Web Store 배포

1. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)에서 개발자 계정 등록 (1회 등록비)
2. `pnpm build`로 `dist/` 생성
3. `dist/` 폴더 내용을 ZIP으로 압축 (루트에 `manifest.json`이 있어야 함)
4. 대시보드 → **새 항목** → ZIP 업로드
5. 스토어 등록 정보 작성:
   - 이름, 설명, 스크린샷 (1280×800 또는 640×400 권장)
   - 아이콘 128×128 (`public/icons/icon128.png` 사용 가능)
   - 개인정보 처리방침 URL (클립보드·storage 사용 시 명시 권장)
6. 권한 설명: `storage`(상태 저장), `clipboardRead`(복사 내용 자동 변환)
7. 심사 제출 후 승인되면 게시

### 배포 전 체크리스트

- [ ] `manifest.json`의 `version` 증가
- [ ] 프로덕션 빌드 `pnpm build` 성공
- [ ] ChatGPT / Claude 등에서 복사 → 팝업 → Copy Markdown E2E 확인
- [ ] 개인정보 처리방침 및 권한 사용 이유 문서화

## MVP 기능

- Popup UI (약 680px 너비)
- 붙여넣기 시 `text/html` 우선, 없으면 `text/plain`
- Turndown + GFM (제목, 리스트, 표, 체크박스, 코드, 인용, 굵게/기울임)
- **Copy Markdown** (`navigator.clipboard.writeText`)
- **Convert** / **Clear**
- `chrome.storage.local` 상태 유지
- 팝업 열 때 클립보드 자동 읽기 및 변환

## 향후 확장 (미구현, 구조만 고려)

| 후보 | 설명 |
|------|------|
| A | 선택 영역 우클릭 → Copy Selection as Markdown |
| B | 현재 페이지 전체 Markdown 변환 |
| C | ChatGPT 답변 DOM 자동 추출 |
| D | 단축키 `Ctrl+Shift+M` 즉시 복사 |

`background/serviceWorker.ts` 및 `lib/` 모듈을 확장해 추가할 수 있습니다.

## 스크립트

| 명령 | 설명 |
|------|------|
| `pnpm dev` | 개발 빌드 (watch) |
| `pnpm build` | 타입 검사 + 프로덕션 빌드 |
| `pnpm lint` | ESLint |
