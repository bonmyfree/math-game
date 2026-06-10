import { useForm } from '@tanstack/react-form'
import { useTranslation } from 'react-i18next'

import { SystemLogSearchKeys } from '@/features/system/services'
import { SearchButton } from '@/shared/components/ui/SearchButton'
import { DatePicker } from '@/shared/forms/fields/DatePicker'
import { FormField } from '@/shared/forms/fields/FormField'
import { TextInput } from '@/shared/forms/fields/TextInput'

import { DEFAULT_FILTER } from '../constants'

type FormValues = SystemLogSearchKeys

interface FormProps {
  onSubmit?: (values: SystemLogSearchKeys) => void
  onReset?: () => void
}

export function FormSearchLogs({ onSubmit, onReset }: FormProps) {
  const { t } = useTranslation()

  const form = useForm({
    defaultValues: { ...DEFAULT_FILTER } as FormValues,
    onSubmit: async ({ value }) => {
      const hasSearchValues = Object.values(value).some((v) => v !== '')
      if (hasSearchValues) {
        onSubmit?.(value)
      }
    },
  })

  return (
    <form
      className="form w-full"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <div className="d-grid grid-4 w-full">
        <form.Field name="USER_CODE">
          {(field) => (
            <FormField label={t('common.creator')} tone="light">
              <TextInput
                className="rounded-md px-3 py-1 h-9"
                tone="light"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                type="text"
                placeholder={t('common.creator')}
                aria-label={t('common.creator')}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="BUSSINESS_CODE">
          {(field) => (
            <FormField label={t('common.business')} tone="light">
              <TextInput
                className="rounded-md px-3 py-1 h-9"
                tone="light"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                type="text"
                placeholder={t('common.business')}
                aria-label={t('common.business')}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="ACTION_CODE">
          {(field) => (
            <FormField label={t('common.actionType')} tone="light">
              <TextInput
                className="rounded-md px-3 py-1 h-9"
                tone="light"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                type="text"
                placeholder={t('common.actionType')}
                aria-label={t('common.actionType')}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="DATA_CODE">
          {(field) => (
            <FormField label={t('common.data')} tone="light">
              <TextInput
                className="rounded-md px-3 py-1 h-9"
                tone="light"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                type="text"
                placeholder={t('common.data')}
                aria-label={t('common.data')}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="FROM_DATE">
          {(field) => (
            <FormField label={t('common.fromDate')} tone="light">
              <DatePicker
                ariaLabel={t('common.fromDate')}
                value={field.state.value}
                onChange={(date) => field.handleChange(date ?? '')}
              />
            </FormField>
          )}
        </form.Field>

        <form.Field name="TO_DATE">
          {(field) => (
            <FormField label={t('common.toDate')} tone="light">
              <DatePicker
                ariaLabel={t('common.toDate')}
                value={field.state.value}
                onChange={(date) => field.handleChange(date ?? '')}
              />
            </FormField>
          )}
        </form.Field>

        <div className="flex min-w-0 flex-wrap items-end gap-2">
          <SearchButton
            resetVariant="toolbar"
            onReset={() => {
              form.reset()
              onReset?.()
            }}
          />
        </div>
      </div>
    </form>
  )
}
