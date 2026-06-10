import { useCallback, useMemo, useRef, useState } from 'react'

export function useTableRowSelection(pageIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const selectAllRef = useRef<HTMLInputElement>(null)

  const allCurrentSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))
  const someOnPage = pageIds.some((id) => selectedIds.has(id))
  const selectAllIndeterminate = someOnPage && !allCurrentSelected

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      const allSelected = pageIds.length > 0 && pageIds.every((id) => prev.has(id))
      if (allSelected) {
        pageIds.forEach((id) => next.delete(id))
      } else {
        pageIds.forEach((id) => next.add(id))
      }
      return next
    })
  }, [pageIds])

  const toggleRow = useCallback((pk: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(pk)
      else next.delete(pk)
      return next
    })
  }, [])

  const clearSelection = useCallback(() => setSelectedIds(new Set()), [])

  const selectedCount = selectedIds.size

  return useMemo(
    () => ({
      selectedIds,
      selectAllRef,
      allCurrentSelected,
      selectAllIndeterminate,
      toggleSelectAll,
      toggleRow,
      clearSelection,
      selectedCount,
    }),
    [
      selectedIds,
      allCurrentSelected,
      selectAllIndeterminate,
      toggleSelectAll,
      toggleRow,
      clearSelection,
      selectedCount,
    ],
  )
}
