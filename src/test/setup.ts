import '@testing-library/jest-dom/vitest'

// TanStack Router may call scrollTo during navigation in tests
Object.defineProperty(window, 'scrollTo', {
  value: () => null,
  writable: true,
})

// Force i18n language in tests
try {
  localStorage.setItem('i18nextLng', 'vi')
} catch {
  // ignore
}
