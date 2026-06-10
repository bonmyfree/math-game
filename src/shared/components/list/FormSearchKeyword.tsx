import { useTranslation } from 'react-i18next'

import { TableSearchBar } from '@/shared/components/ui/TableSearchBar'

interface FormSearchKeywordProps {
  onSubmit?: (keyword: string) => void
  onReset?: () => void
  placeholder?: string
}

export function FormSearchKeyword({ onSubmit, onReset, placeholder }: FormSearchKeywordProps) {
  const { t } = useTranslation()

  return (
    <TableSearchBar
      className="min-w-0 max-w-full"
      placeholder={placeholder ?? t('form.search')}
      defaultValues={{ keyword: '' }}
      onSearch={({ keyword }) => onSubmit?.(keyword.trim())}
      onReset={onReset}
    />
  )
}
