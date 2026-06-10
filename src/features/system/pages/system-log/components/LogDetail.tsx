import { isEmpty, isEqual } from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SystemLogDetailData } from '@/features/system/services'
type LogDetailProps = {
  data: SystemLogDetailData
}
export function LogDetail({ data }: LogDetailProps) {
  const { t } = useTranslation()

  const [newData, setNewData] = useState<Record<string, unknown>>()
  const [oldData, setOldData] = useState<Record<string, unknown>>()
  useEffect(() => {
    const handleGetPropertyChange = () => {
      console.log('handleGetPropertyChange')
      const _arrProperty = []
      const newData = data?.C_NEW_DATA ? JSON.parse(data?.C_NEW_DATA) : {}
      const oldData = data?.C_OLD_DATA ? JSON.parse(data?.C_OLD_DATA) : {}

      if (!Array.isArray(newData) && !Array.isArray(oldData))
        Object.keys(newData).forEach((element) => {
          console.log(element)
          if (!isEqual(newData[element.trim()], oldData[element.trim()])) {
            _arrProperty.push(element.trim())
          }
        })
      setNewData(newData)
      setOldData(oldData)
    }
    handleGetPropertyChange()
  }, [data])

  return (
    <div className="flex flex-col gap-5">
      {newData && !isEmpty(newData) && (
        <div className="bg-gray-100 border rounded-md p-4">
          <p className="text-lg font-bold">{t('common.prevInfo')}</p>
          <div className="d-grid grid-4 gap-4 mt-2">
            {Object.keys(newData).map((item, index) => (
              <div key={index}>
                <p className="font-bold">{item}</p>
                <input
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-0 text-sm leading-5"
                  disabled
                  value={String(newData[item.trim()]) || '_'}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {oldData && !isEmpty(oldData) && (
        <div className="bg-gray-100 border rounded-md p-4">
          <p className="text-lg font-bold">{t('common.updatedInfo')}</p>
          <div className="d-grid grid-4 gap-4 mt-2">
            {Object.keys(oldData).map((item, index) => (
              <div key={index}>
                <p className="font-bold">{item}</p>
                <input
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-0 text-sm leading-5"
                  disabled
                  value={String(oldData[item.trim()]) || '_'}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
