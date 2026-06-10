import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { KeyRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { authApi } from '@/features/auth/services/auth.api'
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from '@/features/auth/validators/changePassword.schema'
import { FormField } from '@/shared/forms/fields/FormField'
import { FormSubmitButton } from '@/shared/forms/fields/FormSubmitButton'
import { PasswordInput } from '@/shared/forms/fields/PasswordInput'
import { submitWithToast } from '@/shared/forms/useSubmitMutation'
import { zodFirstErrorMessage } from '@/shared/forms/validators/zod'

export default function ChangePasswordPage() {
  const { t } = useTranslation()
  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
  })

  const form = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    } satisfies ChangePasswordValues,
    onSubmit: async ({ value }) => {
      const result = await submitWithToast(
        changePasswordMutation.mutateAsync,
        { oldPassword: value.oldPassword, newPassword: value.newPassword },
        t,
        {
          successMessageKey: 'toast.changePasswordSuccess',
          errorMessageKey: 'toast.error',
        },
      )

      if (!result.ok) return
      form.reset()
    },
  })

  return (
    <div className="relative top-30 flex justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <KeyRound size={22} className="text-blue-500" />
          <h1 className="text-xl font-bold text-slate-800">{t('auth.changePassword')}</h1>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field
            name="oldPassword"
            validators={{
              onChange: ({ value }) =>
                zodFirstErrorMessage(changePasswordSchema.shape.oldPassword, value, t),
            }}
          >
            {(field) => (
              <FormField
                tone="light"
                label={t('auth.oldPassword')}
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
                />
              </FormField>
            )}
          </form.Field>

          <form.Field
            name="newPassword"
            validators={{
              onChange: ({ value }) =>
                zodFirstErrorMessage(changePasswordSchema.shape.newPassword, value, t),
            }}
          >
            {(field) => (
              <FormField
                tone="light"
                label={t('auth.newPassword')}
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
                />
              </FormField>
            )}
          </form.Field>

          <form.Field
            name="confirmPassword"
            validators={{
              onChange: ({ value, fieldApi }) =>
                zodFirstErrorMessage(changePasswordSchema.shape.confirmPassword, value, t) ||
                (fieldApi.form.getFieldValue('newPassword') !== value
                  ? t('form.passwordMismatch', { defaultValue: 'Passwords do not match' })
                  : undefined),
            }}
          >
            {(field) => (
              <FormField
                tone="light"
                label={t('auth.confirmPassword')}
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
                />
              </FormField>
            )}
          </form.Field>

          <div className="pt-2">
            <FormSubmitButton
              isLoading={changePasswordMutation.isPending}
              loadingText={t('common.loading')}
              className="w-full sm:w-auto px-5"
            >
              {t('common.save')}
            </FormSubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}
