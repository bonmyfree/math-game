import { useForm } from '@tanstack/react-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/components/ui/button'
import { CheckboxInput } from '@/shared/forms/fields/CheckboxInput'
import { DropdownInput, type DropdownOption } from '@/shared/forms/fields/DropdownInput'
import { FormField } from '@/shared/forms/fields/FormField'
import { FormSubmitButton } from '@/shared/forms/fields/FormSubmitButton'
import { TextAreaInput } from '@/shared/forms/fields/TextAreaInput'
import { TextInput } from '@/shared/forms/fields/TextInput'
import { zodFirstErrorMessage } from '@/shared/forms/validators/zod'
import { toastService } from '@/shared/services/toast.service'
import { useModalStore } from '@/shared/stores/modal.store'
import { cn } from '@/shared/utils'

import {
  backFunctionAddSchema,
  type BackFunctionAddValues,
} from '../../../validators/backFunctionAdd.schema'

type Props = {
  parentOptions: DropdownOption[]
  mode?: 'create' | 'update'
  itemId?: string
  initialValues?: Partial<BackFunctionAddValues>
  /** Chỉ xem: ẩn Lưu, vô hiệu hóa field (dùng khi user không có quyền update) */
  readOnly?: boolean
  onSubmitForm?: (
    values: BackFunctionAddValues,
    meta: { mode: 'create' | 'update'; itemId?: string },
  ) => Promise<boolean>
}

export function BackFunctionAddForm({
  parentOptions,
  mode = 'create',
  itemId,
  initialValues,
  readOnly = false,
  onSubmitForm,
}: Props) {
  const { t } = useTranslation()
  const closeModal = useModalStore((s) => s.closeModal)

  const form = useForm({
    defaultValues: {
      C_GROUP: initialValues?.C_GROUP ?? '',
      C_CODE: initialValues?.C_CODE ?? '',
      C_NAME: initialValues?.C_NAME ?? '',
      C_MENU_NAME: initialValues?.C_MENU_NAME ?? '',
      C_PARENT_CODE: initialValues?.C_PARENT_CODE ?? '',
      C_VIEW_FLAG: initialValues?.C_VIEW_FLAG ?? false,
      C_UPDATE_FLAG: initialValues?.C_UPDATE_FLAG ?? false,
      C_APPROVE_FLAG: initialValues?.C_APPROVE_FLAG ?? false,
      C_MENU_FLAG: initialValues?.C_MENU_FLAG ?? false,
      C_ADMIN_FLAG: initialValues?.C_ADMIN_FLAG ?? false,
      C_ACTIVE: initialValues?.C_ACTIVE ?? false,
      C_CONTENT: initialValues?.C_CONTENT ?? '',
    } as BackFunctionAddValues,
    onSubmit: async ({ value }) => {
      if (readOnly) return
      const parsed = backFunctionAddSchema.safeParse(value)
      if (!parsed.success) return

      if (onSubmitForm) {
        const ok = await onSubmitForm(parsed.data, { mode, itemId })
        if (!ok) return
      } else {
        toastService.info(
          `${t(
            mode === 'update' ? 'backFunction.form.updateHint' : 'backFunction.form.submitHint',
          )}: ${parsed.data.C_CODE} — ${parsed.data.C_NAME}`,
        )
      }

      form.reset()
      closeModal()
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (readOnly) return
        void form.handleSubmit()
      }}
      className="space-y-4 px-6 py-5 text-sm text-slate-700"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <form.Field
          name="C_GROUP"
          validators={{
            onChange: ({ value }) =>
              zodFirstErrorMessage(backFunctionAddSchema.shape.C_GROUP, value, t),
          }}
        >
          {(field) => (
            <FormField tone="light" label={t('form.group')} error={field.state.meta.errors[0]}>
              <TextInput
                tone="light"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="SYSTEM"
                readOnly={readOnly}
                disabled={readOnly}
                hasError={field.state.meta.errors.length > 0}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field
          name="C_CODE"
          validators={{
            onChange: ({ value }) =>
              zodFirstErrorMessage(backFunctionAddSchema.shape.C_CODE, value, t),
          }}
        >
          {(field) => (
            <FormField
              tone="light"
              label={t('backFunction.form.code')}
              error={field.state.meta.errors[0]}
              required
            >
              <TextInput
                tone="light"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder={t('backFunction.form.codePlaceholder')}
                readOnly={readOnly}
                disabled={readOnly}
                hasError={field.state.meta.errors.length > 0}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field
          name="C_NAME"
          validators={{
            onChange: ({ value }) =>
              zodFirstErrorMessage(backFunctionAddSchema.shape.C_NAME, value, t),
          }}
        >
          {(field) => (
            <FormField
              tone="light"
              label={t('backFunction.form.name')}
              error={field.state.meta.errors[0]}
              required
            >
              <TextInput
                tone="light"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder={t('backFunction.form.namePlaceholder')}
                readOnly={readOnly}
                disabled={readOnly}
                hasError={field.state.meta.errors.length > 0}
              />
            </FormField>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <form.Field
          name="C_MENU_NAME"
          validators={{
            onChange: ({ value }) =>
              zodFirstErrorMessage(backFunctionAddSchema.shape.C_MENU_NAME, value, t),
          }}
        >
          {(field) => (
            <FormField
              tone="light"
              label={t('backFunction.form.menuName')}
              error={field.state.meta.errors[0]}
            >
              <TextInput
                tone="light"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder={t('backFunction.form.menuNamePlaceholder')}
                readOnly={readOnly}
                disabled={readOnly}
                hasError={field.state.meta.errors.length > 0}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field
          name="C_PARENT_CODE"
          validators={{
            onChange: ({ value }) =>
              zodFirstErrorMessage(backFunctionAddSchema.shape.C_PARENT_CODE, value, t),
          }}
        >
          {(field) => (
            <FormField
              tone="light"
              label={t('backFunction.form.parentCode')}
              error={field.state.meta.errors[0]}
            >
              <DropdownInput
                tone="light"
                value={field.state.value}
                options={parentOptions}
                onBlur={field.handleBlur}
                disabled={readOnly}
                hasError={field.state.meta.errors.length > 0}
                onChange={(v) => field.handleChange(v)}
                className="rounded-lg"
              />
            </FormField>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
        <form.Field name="C_VIEW_FLAG">
          {(field) => (
            <label
              className={cn(
                'inline-flex items-center gap-2 text-sm text-slate-700',
                readOnly && 'cursor-not-allowed opacity-90',
              )}
            >
              <CheckboxInput
                checked={field.state.value}
                onCheckedChange={field.handleChange}
                disabled={readOnly}
              />
              {t('backFunction.form.rightView')}
            </label>
          )}
        </form.Field>
        <form.Field name="C_UPDATE_FLAG">
          {(field) => (
            <label
              className={cn(
                'inline-flex items-center gap-2 text-sm text-slate-700',
                readOnly && 'cursor-not-allowed opacity-90',
              )}
            >
              <CheckboxInput
                checked={field.state.value}
                onCheckedChange={field.handleChange}
                disabled={readOnly}
              />
              {t('backFunction.form.rightUpdate')}
            </label>
          )}
        </form.Field>
        <form.Field name="C_APPROVE_FLAG">
          {(field) => (
            <label
              className={cn(
                'inline-flex items-center gap-2 text-sm text-slate-700',
                readOnly && 'cursor-not-allowed opacity-90',
              )}
            >
              <CheckboxInput
                checked={field.state.value}
                onCheckedChange={field.handleChange}
                disabled={readOnly}
              />
              {t('backFunction.form.rightApprove')}
            </label>
          )}
        </form.Field>
        <form.Field name="C_MENU_FLAG">
          {(field) => (
            <label
              className={cn(
                'inline-flex items-center gap-2 text-sm text-slate-700',
                readOnly && 'cursor-not-allowed opacity-90',
              )}
            >
              <CheckboxInput
                checked={field.state.value}
                onCheckedChange={field.handleChange}
                disabled={readOnly}
              />
              {t('backFunction.form.showOnMenu')}
            </label>
          )}
        </form.Field>
        <form.Field name="C_ADMIN_FLAG">
          {(field) => (
            <label
              className={cn(
                'inline-flex items-center gap-2 text-sm text-slate-700',
                readOnly && 'cursor-not-allowed opacity-90',
              )}
            >
              <CheckboxInput
                checked={field.state.value}
                onCheckedChange={field.handleChange}
                disabled={readOnly}
              />
              {t('backFunction.form.rightAdmin')}
            </label>
          )}
        </form.Field>
        <form.Field name="C_ACTIVE">
          {(field) => (
            <label
              className={cn(
                'inline-flex items-center gap-2 text-sm text-slate-700',
                readOnly && 'cursor-not-allowed opacity-90',
              )}
            >
              <CheckboxInput
                checked={field.state.value}
                onCheckedChange={field.handleChange}
                disabled={readOnly}
              />
              {t('common.active')}
            </label>
          )}
        </form.Field>
      </div>

      <form.Field
        name="C_CONTENT"
        validators={{
          onChange: ({ value }) =>
            zodFirstErrorMessage(backFunctionAddSchema.shape.C_CONTENT, value, t),
        }}
      >
        {(field) => (
          <FormField tone="light" label={t('form.note')} error={field.state.meta.errors[0]}>
            <TextAreaInput
              tone="light"
              rows={4}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder={t('form.notePlaceholder')}
              readOnly={readOnly}
              disabled={readOnly}
              hasError={field.state.meta.errors.length > 0}
            />
          </FormField>
        )}
      </form.Field>

      <div className="-mx-6 -mb-5 mt-2 flex flex-wrap justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-3">
        <Button
          type="button"
          variant="outline"
          size="default"
          className="h-auto px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
          onClick={() => closeModal()}
        >
          {readOnly ? t('common.back') : t('common.cancel')}
        </Button>
        {!readOnly ? (
          <FormSubmitButton className="w-auto px-5 cursor-pointer">
            {t(mode === 'update' ? 'common.update' : 'common.save')}
          </FormSubmitButton>
        ) : null}
      </div>
    </form>
  )
}
