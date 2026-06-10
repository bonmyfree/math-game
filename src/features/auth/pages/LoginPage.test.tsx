import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'

import LoginPage from './LoginPage'
import '@/shared/i18n'

vi.mock('@tanstack/react-router', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

vi.mock('@/features/auth/services/auth.api', () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
    getUserPermissions: vi.fn(),
    changePassword: vi.fn(),
  },
}))

vi.mock('@/features/auth/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    loadPermissions: vi.fn(),
    logout: vi.fn(),
  },
}))

function renderWithProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient()

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('LoginPage', () => {
  it('renders login form', async () => {
    renderWithProviders(<LoginPage />)

    expect(await screen.findByPlaceholderText('admin')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })
})
