import { useTranslation } from 'react-i18next'

import type { BackUserListSearchKeys } from '@/features/system/services'
import { TableSearchBar } from '@/shared/components/ui/TableSearchBar'

interface FormProps {
  onSubmit?: (values: BackUserListSearchKeys) => void
  onReset?: () => void
}

export function FormSearchBackUserAccounts({ onSubmit, onReset }: FormProps) {
  const { t } = useTranslation()

  return (
    <TableSearchBar
      className="min-w-0 max-w-full"
      placeholder={t('form.search')}
      defaultValues={{ keyword: '' }}
      onSearch={({ keyword }) => {
        const kw = keyword.trim()
        onSubmit?.({
          BRANCH: '',
          SUB_BRANCH: '',
          CODE: kw,
          NAME: '',
          GROUP: '',
        })
      }}
      onReset={onReset}
    />
  )
}
