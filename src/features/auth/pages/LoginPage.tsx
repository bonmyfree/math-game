import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Lock, User } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import LogoFull from '@/assets/img/logo/logo_full.svg'
import { authService } from '@/features/auth/services/auth.service'
import { FormField } from '@/shared/forms/fields/FormField'
import { FormSubmitButton } from '@/shared/forms/fields/FormSubmitButton'
import { PasswordInput } from '@/shared/forms/fields/PasswordInput'
import { TextInput } from '@/shared/forms/fields/TextInput'
import { submitWithToast } from '@/shared/forms/useSubmitMutation'
import { zodFirstErrorMessage } from '@/shared/forms/validators/zod'
import { useAuthStore } from '@/shared/stores/auth.store'

import styles from './LoginPage.css?inline'
import { loginSchema, type LoginValues } from '../validators/login.schema'

const LOGIN_DEV_DEFAULTS: LoginValues = { user: 'admin', pass: '123456' }
const LOGIN_DEFAULTS: LoginValues = { user: '', pass: '' }

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const loginMutation = useMutation({
    mutationFn: authService.login,
  })

  useEffect(() => {
    if (isAuthenticated) navigate({ to: '/dashboard' })
  }, [isAuthenticated, navigate])

  const form = useForm({
    defaultValues: import.meta.env.DEV ? LOGIN_DEV_DEFAULTS : LOGIN_DEFAULTS,
    onSubmit: async ({ value }) => {
      const result = await submitWithToast(loginMutation.mutateAsync, value, t, {
        successMessageKey: 'toast.loginSuccess',
        errorMessageKey: 'toast.loginFailed',
      })

      if (!result.ok) return
      navigate({ to: '/' })
    },
  })

  return (
    <>
      {/* Scoped under .login-page-scope so class names (e.g. .card) do not leak globally */}
      <style>{styles}</style>

      <div className="login-page-scope loginRoot">
        {/* Left panel (desktop) */}
        <div className="loginBrand">
          <div className="loginPattern" />
          <div className="loginBrandInner">
            <div className="brandLogo">
              <img src={LogoFull} alt="Bolt Holdings" style={{ height: 40, width: 'auto' }} />
            </div>

            <div>
              <h1 className="brandTitle">{t('auth.login.title')}</h1>
              <p className="brandSubtitle">{t('auth.login.subtitle')}</p>
              <div className="brandFooter">
                {t('auth.login.brandHint', {
                  defaultValue: 'Sign in with your account to access the system.',
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="loginPanel">
          <div className="loginContainer">
            {/* Mobile header */}
            <div className="mobileHeader">
              <img
                src={LogoFull}
                alt="Bolt Holdings"
                style={{ height: 40, width: 'auto', margin: '0 auto 16px' }}
              />
              <h1 className="mobileTitle">{t('auth.login')}</h1>
              <p className="mobileSubtitle">
                {t('auth.login.mobileSubtitle', {
                  defaultValue: 'Document management system',
                })}
              </p>
            </div>

            <div className="card">
              {/* Desktop header */}
              <div className="desktopHeader">
                <h2 className="desktopTitle">{t('auth.login')}</h2>
                <p className="desktopSubtitle">
                  {t('auth.login.desktopSubtitle', {
                    defaultValue: 'Please sign in with your account',
                  })}
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  form.handleSubmit()
                }}
                className="form"
              >
                <form.Field
                  name="user"
                  validators={{
                    onChange: ({ value }) => zodFirstErrorMessage(loginSchema.shape.user, value, t),
                  }}
                >
                  {(field) => (
                    <FormField
                      tone="light"
                      label={t('form.username')}
                      error={field.state.meta.errors[0]}
                      required
                    >
                      <TextInput
                        tone="light"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        type="text"
                        placeholder="admin"
                        hasError={field.state.meta.errors.length > 0}
                        leftIcon={<User size={16} />}
                      />
                    </FormField>
                  )}
                </form.Field>

                <form.Field
                  name="pass"
                  validators={{
                    onChange: ({ value }) => zodFirstErrorMessage(loginSchema.shape.pass, value, t),
                  }}
                >
                  {(field) => (
                    <FormField
                      tone="light"
                      label={t('form.password')}
                      error={field.state.meta.errors[0]}
                      required
                    >
                      <PasswordInput
                        tone="light"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="••••••••"
                        hasError={field.state.meta.errors.length > 0}
                        leftIcon={<Lock size={16} />}
                      />
                    </FormField>
                  )}
                </form.Field>

                <FormSubmitButton
                  isLoading={loginMutation.isPending}
                  loadingText={t('auth.login.loading')}
                >
                  {t('auth.login.button')}
                </FormSubmitButton>
              </form>

              <div className="footerInfo">
                {t('auth.login.footerInfo', {
                  defaultValue: 'This system uses centralized authentication for security.',
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
