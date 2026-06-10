# React Base (BoltX)

Boilerplate React 19 + TypeScript, Vite 8, TanStack (Router / Query / Table / Form), Zustand, Tailwind CSS v4, react-i18next, và UI Radix/shadcn.

Tài liệu kiến trúc chi tiết: **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

---

## Tech stack

| Mục đích            | Thư viện                         |
| ------------------- | -------------------------------- |
| Build               | Vite 8                           |
| Ngôn ngữ            | TypeScript 6                     |
| Package manager     | Yarn                             |
| Routing             | TanStack Router                  |
| Server state        | TanStack Query                   |
| Bảng dữ liệu        | TanStack Table                   |
| Form                | TanStack Form + Zod              |
| HTTP                | Axios (`api.service`)            |
| State cục bộ / auth | Zustand                          |
| Style               | Tailwind v4, CVA, tw-animate-css |
| UI primitives       | radix-ui, shadcn                 |
| i18n                | i18next, react-i18next           |
| Toast               | react-toastify                   |
| Icons               | lucide-react (named imports)     |

---

## Cấu trúc thư mục (feature-based)

```
src/
├── app/
│   ├── App.tsx           # QueryClient, router, toast, root Modal
│   ├── router.tsx        # Cây route (layout, auth, system, users)
│   └── lazyRoutes.tsx    # Lazy pages + Suspense
├── features/
│   ├── auth/             # Login, đổi mật khẩu, auth.api / auth.service
│   ├── dashboard/
│   ├── system/           # routes factory, layouts, SystemLog, …
│   └── users/            # UserList, UserRoles, UserCreateModal, userApi
└── shared/
    ├── components/       # layout (MainLayout, Sidebar, Header), ui, …
    ├── forms/
    ├── hooks/            # usePermission, …
    ├── i18n/             # init + locales en/vi
    ├── query/            # QueryClient defaults
    ├── services/         # api.service, tokenProvider, toast.service
    ├── stores/           # auth, global, modal
    ├── types/
    └── utils/            # cn, permissionVisibility, …
```

---

## Cài đặt & script

```bash
yarn install
yarn dev              # dev local
yarn build            # tsc -b && vite build (mode production)
yarn lint             # ESLint
yarn typecheck        # tsc -b
yarn test             # Vitest (run once)
yarn test:watch
yarn e2e              # Playwright (nếu cấu hình)
```

**CI:** trên mỗi push / PR tới `main`, `master`, `develop`, workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) chạy `yarn lint`, `yarn typecheck`, `yarn test`.

---

## Biến môi trường

Frontend chỉ đọc biến có prefix **`VITE_`**. Gợi ý file: `.env.local` (không commit), `.env.uat`, `.env.production`.

| Biến                     | Mô tả                                                |
| ------------------------ | ---------------------------------------------------- |
| `VITE_API_BASE_URL`      | Base URL API (mặc định dev: `http://localhost:3000`) |
| `VITE_AUTH_REFRESH_PATH` | Endpoint refresh token (mặc định `/auth/refresh`)    |

```bash
yarn dev:uat      # vite --mode uat
yarn build:uat    # build theo .env.uat
yarn build:prod   # build production rõ ràng
```

`yarn build` mặc định cũng là production mode của Vite; nên ưu tiên `yarn build:prod` khi release.

---

## API layer

```ts
import { apiService } from '@/shared/services/api.service'

export const productApi = {
  getAll: () => apiService.get<Product[]>('/products'),
  create: (body: CreateDto) => apiService.post<Product>('/products', body),
}
```

- Gắn Bearer, xử lý **refresh token** tập trung trên 401, logout khi refresh thất bại.
- Pattern **command** (nếu backend dùng): `apiService.command(...)`.

---

## Thêm route

1. (Tuỳ chọn) Export lazy component trong `src/app/lazyRoutes.tsx`.
2. Trong `src/app/router.tsx`, tạo `createRoute` với `getParentRoute` đúng (`rootRoute`, `appLayoutRoute`, …).
3. Với feature lớn: export `createXxxRoutes(parent)` trong feature, gọi từ `router.tsx` (giống `createSystemRoutes`).

---

## i18n

- Key **phẳng** trong object locale (ví dụ `'auth.login.title'`).
- `i18n.init`: `keySeparator: false`, `nsSeparator: false`.

---

## Ghi chú

- Ưu tiên **TanStack Query** cho dữ liệu server; Zustand cho auth, locale, UI modal.
- Quyền menu: `NAV_ITEMS` + `canViewNavRights` (default-deny, `'ALL'` nếu cần bypass). Tab: `canViewTabRight`.
