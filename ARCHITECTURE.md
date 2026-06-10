# Kiến trúc ứng dụng (react-base)

Tài liệu mô tả các lớp chính, luồng dữ liệu và quy ước mở rộng. Code chi tiết nằm trong `src/`.

## 1. Phân tầng

| Tầng                          | Vai trò                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------- |
| **`src/app/`**                | Khởi động: `App`, `router`, `lazyRoutes` — không chứa business theo feature.    |
| **`src/features/<feature>/`** | Theo domain: pages, API riêng feature, route factory (nếu có), validators.      |
| **`src/shared/`**             | UI chung, hooks, stores, services, i18n, types, utils — dùng lại xuyên feature. |

**Nguyên tắc:** feature không import ngược `app/router` trực tiếp; subtree route lớn export factory nhận `parent` route (ví dụ `createSystemRoutes`) để tránh circular dependency.

## 2. Routing

- **TanStack Router** định nghĩa cây route trong `app/router.tsx`.
- Trang được **lazy-load** qua `app/lazyRoutes.tsx` (`React.lazy` + `Suspense` + `PageLoader`).
- **Auth:** `/login` nằm ngoài layout; mọi route dưới layout dùng `ProtectedRoute` (đọc `useAuthStore`).
- **Layout:** `MainLayout` (Sidebar, Header, outlet). Các path ví dụ: `/`, `/dashboard`, `/account/change-password`, `/users`, `/user-roles`, `/system/...`.

## 3. Trạng thái & phiên đăng nhập

- **`auth.store` (Zustand):** user, tokens, permissions, `clearAuth`, hydrate từ persist (nếu cấu hình).
- **`tokenProvider`:** bộ nhớ tạm cho access/refresh token đồng bộ với store — `api.service` đọc token khi gắn header.
- **Permissions:** map từ API sang object `functionCode → ['view' | 'update' | 'approve']` (`permission.util`). Sidebar dùng `canViewNavRights`; tab bar dùng `canViewTabRight` (`permissionVisibility.ts`).

## 4. HTTP & 401 / refresh

- **`api.service`:** một `AxiosInstance` + object `apiService` (`get`, `post`, `command`, …).
- Request: Bearer từ `tokenProvider`.
- **401:** nếu có `refreshToken` và URL không thuộc nhóm login/refresh, một lần **`refreshPromise`** gọi `POST` tới `VITE_AUTH_REFRESH_PATH` (mặc định `/auth/refresh`), cập nhật token qua `applyRefreshedTokens`, rồi **retry** request. Thất bại hoặc 401 lần hai → `clearAuth` + điều hướng login.
- **Toast lỗi API** (trừ 401 đã xử lý auth): `QueryClient` / `MutationCache` + `toast.service`.

## 5. Server state vs client state

- **TanStack Query:** cache, `staleTime` / `gcTime` mặc định trong `shared/query/queryClient.ts` (ví dụ stale query 5 phút, mutation `gcTime` tương ứng).
- **Zustand:** locale, auth, modal config — không thay Query cho dữ liệu server.

## 6. UI & UX

- **Tailwind v4** + **shadcn/radix** (Dialog, DropdownMenu, …). Header dùng `DropdownMenu` cho ngôn ngữ và menu user.
- **i18next:** resource phẳng; `keySeparator: false` / `nsSeparator: false` để key chứa dấu chấm literal (`auth.login.title`).
- **Modal:** root `<Modal />` điều khiển bởi `useModalStore`; form phức tạp có thể giữ Dialog cục bộ (xem JSDoc `UserCreateModal`).

## 7. Kiểm thử & chất lượng

- **Vitest** + Testing Library cho unit/integration nhẹ (ví dụ `LoginPage.test.tsx`).
- **ESLint** (TypeScript, React hooks, import order, jsx-key, …). **CI** chạy `lint`, `typecheck`, `test` (xem `.github/workflows/ci.yml`).

## 8. Mở rộng feature mới (checklist)

1. Thư mục `features/<tên>/` (pages, `api/*`, validators nếu cần).
2. Lazy export trong `lazyRoutes.tsx` nếu là trang.
3. Gắn route trong `router.tsx` hoặc factory route của feature khác.
4. Thêm key i18n trong `shared/i18n/locales/*`.
5. Cập nhật `NAV_ITEMS` / tabs nếu có mục menu mới; kiểm tra `right` / permission.
