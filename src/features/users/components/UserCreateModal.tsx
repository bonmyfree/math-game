import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { userApi } from '@/features/users/api/userApi'
import {
  createUserSchema,
  type CreateUserValues,
} from '@/features/users/validators/createUser.schema'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { FormField } from '@/shared/forms/fields/FormField'
import { FormSubmitButton } from '@/shared/forms/fields/FormSubmitButton'
import { TextInput } from '@/shared/forms/fields/TextInput'
import { submitWithToast } from '@/shared/forms/useSubmitMutation'
import { zodFirstErrorMessage } from '@/shared/forms/validators/zod'
import { queryClient } from '@/shared/query/queryClient'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Local controlled Dialog for this form. Prefer `useModalStore` + root `<Modal />` for
 * simple imperative content (confirm, info); keep Radix Dialog colocated when heavy form
 * state and `useForm` lifecycles should stay in one component.
 */
export function UserCreateModal({ open, onOpenChange }: Props) {
  const { t } = useTranslation()

  const createMutation = useMutation({
    mutationFn: userApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const form = useForm({
    defaultValues: {
      username: '',
      fullName: '',
      email: '',
      role: 'Member',
      status: 'active' as CreateUserValues['status'],
    } satisfies CreateUserValues,
    onSubmit: async ({ value }) => {
      const result = await submitWithToast(createMutation.mutateAsync, value, t, {
        successMessageKey: 'toast.userCreateSuccess',
        errorMessageKey: 'toast.error',
      })
      if (!result.ok) return

      form.reset()
      onOpenChange(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus size={18} className="text-blue-600" />
            {t('users.create.title')}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field
              name="username"
              validators={{
                onChange: ({ value }) =>
                  zodFirstErrorMessage(createUserSchema.shape.username, value, t),
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
                    placeholder="username"
                    hasError={field.state.meta.errors.length > 0}
                  />
                </FormField>
              )}
            </form.Field>

            <form.Field
              name="fullName"
              validators={{
                onChange: ({ value }) =>
                  zodFirstErrorMessage(createUserSchema.shape.fullName, value, t),
              }}
            >
              {(field) => (
                <FormField
                  tone="light"
                  label={t('form.fullName')}
                  error={field.state.meta.errors[0]}
                  required
                >
                  <TextInput
                    tone="light"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Full name"
                    hasError={field.state.meta.errors.length > 0}
                  />
                </FormField>
              )}
            </form.Field>
          </div>

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => zodFirstErrorMessage(createUserSchema.shape.email, value, t),
            }}
          >
            {(field) => (
              <FormField
                tone="light"
                label={t('form.email')}
                error={field.state.meta.errors[0]}
                required
              >
                <TextInput
                  tone="light"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="email@example.com"
                  hasError={field.state.meta.errors.length > 0}
                />
              </FormField>
            )}
          </form.Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field
              name="role"
              validators={{
                onChange: ({ value }) =>
                  zodFirstErrorMessage(createUserSchema.shape.role, value, t),
              }}
            >
              {(field) => (
                <FormField
                  tone="light"
                  label={t('form.role')}
                  error={field.state.meta.errors[0]}
                  required
                >
                  <TextInput
                    tone="light"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Member"
                    hasError={field.state.meta.errors.length > 0}
                  />
                </FormField>
              )}
            </form.Field>

            <form.Field name="status">
              {(field) => (
                <FormField tone="light" label={t('form.status')}>
                  <select
                    value={field.state.value ?? 'active'}
                    onChange={(e) =>
                      field.handleChange(e.target.value as CreateUserValues['status'])
                    }
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-0 text-sm leading-5 text-slate-900 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option value="active">{t('common.active')}</option>
                    <option value="inactive">{t('common.inactive')}</option>
                  </select>
                </FormField>
              )}
            </form.Field>
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              {t('common.cancel')}
            </Button>
            <FormSubmitButton
              isLoading={createMutation.isPending}
              loadingText={t('common.loading')}
              className="w-auto"
            >
              {t('common.save')}
            </FormSubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
