# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Tài liệu này viết bằng tiếng Việt để đồng bộ với [README.md](./README.md) và [ARCHITECTURE.md](./ARCHITECTURE.md). Giao diện app cũng dùng tiếng Việt.

## Bối cảnh quan trọng

Repo được đặt tên `react-base` / "BoltX" và README/ARCHITECTURE mô tả phần **boilerplate hạ tầng** (auth, permissions, CRUD users/roles). Nhưng **sản phẩm thực tế là "Game Toán Học"** — game toán cho học sinh tiểu học (lớp 1–5). Toàn bộ tính năng sản phẩm nằm ở [src/features/games/](src/features/games/); các phần users/roles/system chủ yếu là scaffold kế thừa từ boilerplate.

- **Chưa có backend thật.** Login hardcode `admin / 123456` trong [auth.service.ts](src/features/auth/services/auth.service.ts); `apiService` + luồng refresh 401 đã dựng sẵn nhưng chưa gọi API thật.
- **Mobile-first**: đối tượng chính là webview trên điện thoại (target iPhone 14 Pro Max, viewport ~430px). Thiết kế mobile trước, mở rộng lên desktop bằng breakpoint; touch target ≥44px.

## Lệnh thường dùng

```bash
npm run dev            # dev server (cổng 5173, thường tự nhảy sang 5174 nếu bận)
npm run build          # tsc -b && vite build (production mode)
npm run build:prod     # build production tường minh (ưu tiên khi release)
npm run lint           # ESLint
npm run typecheck      # tsc -b (strict; build luôn typecheck trước)
npm run test           # Vitest chạy 1 lần
npm run test:watch     # Vitest watch
npm run e2e            # Playwright
npm run deploy         # build:prod + firebase deploy --only hosting
```

Chạy **một** test:

```bash
npx vitest run src/features/games/engine/grades.test.ts   # 1 file
npx vitest run -t "tên test"                               # lọc theo tên
```

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) chạy `lint` + `typecheck` + `test`. Husky + lint-staged tự chạy `eslint --fix` và `prettier` khi commit.

Verify bằng cách điều khiển app thật: Playwright chỉ có `chromium` đầy đủ → `chromium.launch({ channel: 'chromium' })`; script phải nằm trong cây dự án để resolve `node_modules`. Đăng nhập qua `input[placeholder="admin"]` + `input[type="password"]` + `button[type="submit"]`.

## Kiến trúc games engine (phần cốt lõi)

Thư mục [src/features/games/engine/](src/features/games/engine/) là trái tim sản phẩm. Có **hai thể loại game**, mỗi thể loại một component engine + một kiểu generator (định nghĩa ở [types.ts](src/features/games/engine/types.ts)):

| Thể loại      | Component                                                        | Generator → dữ liệu                   | Cơ chế                                                                                                           |
| ------------- | ---------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Kéo–thả**   | [DragDropGame.tsx](src/features/games/engine/DragDropGame.tsx)   | `RoundGenerator → GameRound`          | Kéo ô đáp án đúng vào ô `?`. `totalRounds` có giá trị → game hữu hạn (có màn chúc mừng); bỏ trống → chơi vô tận. |
| **Thử thách** | [ChallengeGame.tsx](src/features/games/engine/ChallengeGame.tsx) | `ChallengeGenerator → ChallengeRound` | Trắc nghiệm A/B/C/D, có mạng/đếm giờ, độ khó tăng theo `level`.                                                  |

**Đăng ký nội dung theo lớp** — [gradeRegistry.ts](src/features/games/engine/gradeRegistry.ts): `GRADE_GAMES` map lớp `'2'`–`'5'` → `{ focus, play, challenge }`, mỗi config trỏ tới generator trong [grade2.tsx](src/features/games/engine/grade2.tsx) … [grade5.tsx](src/features/games/engine/grade5.tsx). Trang [GradePlayPage](src/features/games/pages/GradePlayPage.tsx) / [GradeChallengePage](src/features/games/pages/GradeChallengePage.tsx) đọc `$grade` từ route rồi render engine tương ứng.

> **Lớp 1 là ngoại lệ**: KHÔNG nằm trong `GRADE_GAMES`. Lớp 1 có trang riêng ([FirstClassPage](src/features/games/pages/FirstClassPage.tsx), các `*GamePage`) và generator riêng trong [rounds.tsx](src/features/games/engine/rounds.tsx).

**Helper dựng câu hỏi** — [gradeBuilders.tsx](src/features/games/engine/gradeBuilders.tsx): dùng chung cho lớp 2–5. Đáng chú ý `distinctNumbers(answer, count, spread, floor, sameUnits)` sinh số nhiễu (distractor) — tham số `sameUnits` ép một số nhiễu giữ nguyên chữ số hàng đơn vị để bé không đoán đáp án bằng mẹo. `numTile` / `textTile` / `bigExpr` chuẩn hóa cách hiển thị số & biểu thức.

**Phản hồi & phần thưởng**:

- Âm thanh [sounds.ts](src/features/games/engine/sounds.ts): một `AudioContext` duy nhất (yeah.mp3 giải mã thành buffer + tiếng tổng hợp Web Audio), resume ở mọi thao tác chạm để tránh chặn autoplay. Có nút bật/tắt tiếng.
- Hiệu ứng ăn mừng [celebrations.ts](src/features/games/engine/celebrations.ts) + [celebrationEffects.tsx](src/features/games/engine/celebrationEffects.tsx) (pháo hoa; trang thử nghiệm `/games/fireworks`).
- Xu thưởng: engine gọi [useCoinsStore](src/shared/stores/coins.store.ts) (persist localStorage) — mỗi câu đúng +1, thắng game +bonus; đổi vật phẩm ở trang Exchange.

## Routing ([app/router.tsx](src/app/router.tsx))

- Mọi page **lazy-load** qua [app/lazyRoutes.tsx](src/app/lazyRoutes.tsx). `/login` nằm ngoài layout; phần còn lại nằm dưới `appLayoutRoute` = `ProtectedRoute` + `MainLayout`.
- **Thứ tự route quan trọng**: các path tĩnh của Lớp 1 (`/games/1/play`, `/games/1/challenge`, `/games/1/counting`, …) khai báo TRƯỚC route param `/games/$grade/play` và `/games/$grade/challenge` (lớp 2–5) để khớp đúng — đừng đảo thứ tự tùy tiện.
- Thêm route: export lazy component trong `lazyRoutes.tsx` → `createRoute` với `getParentRoute` đúng → thêm vào `routeTree`. Feature lớn export factory `createXxxRoutes(parent)` gọi từ `router.tsx` (tránh circular import).

## Quy ước cần theo

- **Alias `@/` → `src/`** ([vite.config.ts](vite.config.ts) + tsconfig). Ưu tiên import tuyệt đối.
- **Thứ tự import** do ESLint `import/order` enforce: `builtin → external → internal (@/** trước) → parent/sibling/index → object → type`, alphabet hóa, có dòng trống giữa nhóm.
- **CSS scoped cho page**: một số page (vd [LoginPage.tsx](src/features/auth/pages/LoginPage.tsx)) import `./X.css?inline` rồi inject `<style>{styles}</style>` dưới class bọc `.<page>-scope` để tên class không rò ra global. Style chung khác dùng Tailwind v4.
- **i18n phẳng**: `keySeparator: false` / `nsSeparator: false` → key chứa dấu chấm là literal (vd `'auth.login.title'`). Thêm key phải thêm ở **cả** [vi.ts](src/shared/i18n/locales/vi.ts) **và** [en.ts](src/shared/i18n/locales/en.ts) — type `I18nKeys = Record<keyof typeof vi, string>` lấy `vi` làm nguồn chuẩn nên thiếu key bên `en` sẽ lỗi typecheck. `t()` chấp nhận `defaultValue` cho key chưa có.
- **TS strict** (`noUnusedLocals` / `noUnusedParameters`): tham số/biến bỏ không dùng phải đặt tiền tố `_`.
- Server state → **TanStack Query**; auth/locale/modal/coins → **Zustand**. Đừng thay Query bằng Zustand cho dữ liệu server.

## Hạ tầng kế thừa (chi tiết ở ARCHITECTURE.md)

Auth store + tokenProvider, `apiService` xử lý 401→refresh tập trung, permissions map (`functionCode → quyền`) với nav/tab visibility default-deny, root `<Modal/>` điều khiển bởi `useModalStore`. Các phần này đã dựng sẵn nhưng phần lớn chưa nối backend thật trong bối cảnh game hiện tại.
