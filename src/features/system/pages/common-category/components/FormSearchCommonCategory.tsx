import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { CommonCategorySearchKeys } from '@/features/system/services'
import { TableSearchBar } from '@/shared/components/ui/TableSearchBar'
import { DropdownInput, type DropdownOption } from '@/shared/forms/fields/DropdownInput'
import { TextInput } from '@/shared/forms/fields/TextInput'

import { COMMON_CATEGORY_GROUP, DEFAULT_COMMON_CATEGORY_SEARCH } from '../constants'

type FormValues = CommonCategorySearchKeys

interface FormProps {
  onSubmit?: (values: CommonCategorySearchKeys) => void
  onReset?: () => void
}

const defaultValues: FormValues = { ...DEFAULT_COMMON_CATEGORY_SEARCH }

export function FormSearchCommonCategory({ onSubmit, onReset }: FormProps) {
  const { t } = useTranslation()

  const categoryGroupOptions = useMemo<DropdownOption[]>(
    () => [
      { value: COMMON_CATEGORY_GROUP.ALL, label: t('commonCategory.search.allGroups') },
      { value: COMMON_CATEGORY_GROUP.USER, label: t('commonCategory.search.groupUser') },
      { value: COMMON_CATEGORY_GROUP.SYSTEM, label: t('commonCategory.search.groupSystem') },
    ],
    [t],
  )

  return (
    <TableSearchBar<FormValues>
      className="min-w-0 max-w-full"
      defaultValues={defaultValues}
      onSearch={(value: FormValues) => onSubmit?.(value)}
      onReset={onReset}
    >
      {({ form, searchControls }) => (
        <>
          <form.Field name="GROUP">
            {(field) => (
              <div className="w-[11rem] shrink-0 sm:w-52">
                <DropdownInput
                  tone="light"
                  className="rounded-md"
                  value={field.state.value}
                  placeholder={t('commonCategory.search.categoryType')}
                  options={categoryGroupOptions}
                  onChange={(value) => field.handleChange(value)}
                  onBlur={field.handleBlur}
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
                  placeholder={t('form.categoryName')}
                  aria-label={t('form.categoryName')}
                />
              </div>
            )}
          </form.Field>

          {searchControls}
        </>
      )}
    </TableSearchBar>
  )
}
