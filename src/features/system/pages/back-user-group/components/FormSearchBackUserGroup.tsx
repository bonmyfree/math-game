import { useTranslation } from 'react-i18next'

import type { BackUserGroupSearchKeys } from '@/features/system/services'
import { TableSearchBar } from '@/shared/components/ui/TableSearchBar'
import { CheckboxInput } from '@/shared/forms/fields/CheckboxInput'
import { TextInput } from '@/shared/forms/fields/TextInput'

import { DEFAULT_BACK_USER_GROUP_SEARCH } from '../constants'

type FormValues = {
  CODE: string
  NAME: string
  ACTIVE: boolean
}

interface FormProps {
  onSubmit?: (values: BackUserGroupSearchKeys) => void
  onReset?: () => void
}

function toSearchKeys(values: FormValues): BackUserGroupSearchKeys {
  return {
    CODE: values.CODE,
    NAME: values.NAME,
    ACTIVE: values.ACTIVE ? 1 : 0,
  }
}

const defaultValues: FormValues = {
  CODE: DEFAULT_BACK_USER_GROUP_SEARCH.CODE,
  NAME: DEFAULT_BACK_USER_GROUP_SEARCH.NAME,
  ACTIVE: DEFAULT_BACK_USER_GROUP_SEARCH.ACTIVE === 1,
}

export function FormSearchBackUserGroup({ onSubmit, onReset }: FormProps) {
  const { t } = useTranslation()

  return (
    <TableSearchBar<FormValues>
      className="min-w-0 max-w-full"
      defaultValues={defaultValues}
      onSearch={(value: FormValues) => {
        const hasTextFilter = value.CODE.trim() !== '' || value.NAME.trim() !== ''
        if (hasTextFilter) {
          onSubmit?.(toSearchKeys(value))
        }
      }}
      onReset={onReset}
    >
      {({ form, searchControls }) => (
        <>
          <form.Field name="CODE">
            {(field) => (
              <div className="w-[11rem] shrink-0 sm:w-48">
                <TextInput
                  className="h-9 rounded-md"
                  tone="light"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  type="text"
                  placeholder={t('form.groupCode')}
                  aria-label={t('form.groupCode')}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="NAME">
            {(field) => (
              <div className="w-[11rem] shrink-0 sm:w-48">
                <TextInput
                  className="h-9 rounded-md"
                  tone="light"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  type="text"
                  placeholder={t('form.groupName')}
                  aria-label={t('form.groupName')}
                />
              </div>
            )}
          </form.Field>

          {searchControls}

          <form.Field name="ACTIVE">
            {(field) => (
              <div className="flex h-9 shrink-0 items-center">
                <label className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm font-medium text-slate-700 select-none">
                  <CheckboxInput
                    checked={field.state.value}
                    title={t('common.active')}
                    onCheckedChange={(checked) => {
                      field.handleChange(checked)
                      onSubmit?.({
                        CODE: form.getFieldValue('CODE') as string,
                        NAME: form.getFieldValue('NAME') as string,
                        ACTIVE: checked ? 1 : 0,
                      })
                    }}
                  />
                  <span title={t('common.active')}>{t('common.active')}</span>
                </label>
              </div>
            )}
          </form.Field>
        </>
      )}
    </TableSearchBar>
  )
}
