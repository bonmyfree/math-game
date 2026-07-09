import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Lock, User } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

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
    if (isAuthenticated) navigate({ to: '/home' })
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
        {/* Floating math symbols in the background */}
        <div className="mathBg" aria-hidden="true">
          <span className="floatSym s1">+</span>
          <span className="floatSym s2">−</span>
          <span className="floatSym s3">×</span>
          <span className="floatSym s4">÷</span>
          <span className="floatSym s5">=</span>
          <span className="floatSym s6">7</span>
          <span className="floatSym s7">?</span>
          <span className="floatSym s8">√</span>
        </div>

        <div className="loginPanel">
          <div className="loginContainer">
            {/* Brand hero */}
            <div className="brandHero">
              <div className="mascot" aria-hidden="true">
                🧮
              </div>
              <h1 className="brandTitle">
                {t('auth.login.appName', { defaultValue: 'Game Toán Học' })}
              </h1>
              <p className="brandTagline">
                {t('auth.login.tagline', {
                  defaultValue: 'Học toán thật vui cùng những trò chơi! ✨',
                })}
              </p>
            </div>

            <div className="card">
              <div className="cardHeader">
                <h2 className="cardTitle">{t('auth.login')}</h2>
                <p className="cardSubtitle">
                  {t('auth.login.cardSubtitle', {
                    defaultValue: 'Đăng nhập để bắt đầu chơi nhé!',
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
                  defaultValue: 'Cùng khám phá thế giới những con số kỳ diệu nào! 🚀',
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
