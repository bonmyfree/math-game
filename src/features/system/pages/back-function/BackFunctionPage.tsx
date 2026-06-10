import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import FuncTreeTable from '@/features/system/components/FuncTreeTable'
import { systemService, type SaveBackFunctionPayload } from '@/features/system/services'
import { PageToolbar } from '@/shared/components/layout/PageToolbar'
import { AddButton } from '@/shared/components/ui/AddButton'
import { ConfirmActionModal } from '@/shared/components/ui/ConfirmActionModal'
import { QueryState } from '@/shared/components/ui/QueryState'
import type { DropdownOption } from '@/shared/forms/fields/DropdownInput'
import { usePermission } from '@/shared/hooks/usePermission'
import PageGuard from '@/shared/pages/PageGuard'
import { toastService } from '@/shared/services/toast.service'
import { useModalStore } from '@/shared/stores/modal.store'

import { BackFunctionAddForm } from './components/BackFunctionAddForm'
import { SYSTEM_RIGHT } from '../../routes/constant'

import type { BackFunctionAddValues } from '../../validators/backFunctionAdd.schema'

/** Hệ thống > Người dùng Back > Chức năng Back — cây quyền (PERMISSION.GET_ALL_AUTHORITY) */
export default function BackFunctionPage() {
  const { t } = useTranslation()
  const { canView, canUpdate } = usePermission(SYSTEM_RIGHT.BACK_FUNCTION)
  const { openModal } = useModalStore()
  const queryClient = useQueryClient()
  const authorityQueryKey = ['authority', 'getAllAuthority'] as const
  const [deleteTarget, setDeleteTarget] = useState<{
    pk: string | number
    name: string
  } | null>(null)

  const {
    data: rows = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: authorityQueryKey,
    queryFn: () => systemService.getAllAuthority(),
    enabled: canView,
  })

  const createBackFunctionMutation = useMutation({
    mutationFn: (payload: SaveBackFunctionPayload) => systemService.createBackFunction(payload),
  })

  const updateBackFunctionMutation = useMutation({
    mutationFn: (payload: SaveBackFunctionPayload) => systemService.updateBackFunction(payload),
  })

  const deleteBackFunctionMutation = useMutation({
    mutationFn: (itemId: string) => systemService.deleteBackFunction({ LIST_ITEM_ID: itemId }),
  })

  const reloadAuthorityTable = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: authorityQueryKey })
  }, [queryClient])

  const parentOptions = useMemo<DropdownOption[]>(
    () =>
      rows.map((row) => ({
        value: String(row.C_CODE ?? ''),
        label: row.C_PATH_NAME || row.C_MENU_NAME || String(row.C_CODE ?? ''),
      })),
    [rows],
  )

  const toSavePayload = useCallback(
    (values: BackFunctionAddValues, itemId?: string): SaveBackFunctionPayload => ({
      ITEM_ID: itemId ?? '',
      GROUP: values.C_GROUP,
      CODE: values.C_CODE,
      NAME: values.C_NAME,
      MENU_NAME: values.C_MENU_NAME || null,
      PARENT_CODE: values.C_PARENT_CODE,
      VIEW_FLAG: values.C_VIEW_FLAG ? 1 : 0,
      UPDATE_FLAG: values.C_UPDATE_FLAG ? 1 : 0,
      APPROVE_FLAG: values.C_APPROVE_FLAG ? 1 : 0,
      MENU_FLAG: values.C_MENU_FLAG ? 1 : 0,
      ADMIN_FLAG: values.C_ADMIN_FLAG ? 1 : 0,
      ACTIVE: values.C_ACTIVE ? 1 : 0,
      CONTENT: values.C_CONTENT || null,
    }),
    [],
  )

  const handleSubmitForm = useCallback(
    async (
      values: BackFunctionAddValues,
      meta: { mode: 'create' | 'update'; itemId?: string },
    ): Promise<boolean> => {
      if (!canUpdate) {
        toastService.warning(t('common.permissionDenied'))
        return false
      }
      const payload = toSavePayload(values, meta.itemId)
      const ok =
        meta.mode === 'update'
          ? await updateBackFunctionMutation.mutateAsync(payload)
          : await createBackFunctionMutation.mutateAsync(payload)

      if (!ok) {
        toastService.error(
          t(
            meta.mode === 'update'
              ? 'backFunction.toast.updateFail'
              : 'backFunction.toast.createFail',
          ),
        )
        return false
      }

      await reloadAuthorityTable()
      toastService.success(
        t(
          meta.mode === 'update'
            ? 'backFunction.toast.updateSuccess'
            : 'backFunction.toast.createSuccess',
        ),
      )
      return true
    },
    [
      createBackFunctionMutation,
      reloadAuthorityTable,
      t,
      toSavePayload,
      updateBackFunctionMutation,
      canUpdate,
    ],
  )

  const handleDetail = useCallback(
    (pk: string | number) => {
      const row = rows.find((r) => String(r.PK_AUTHORITY) === String(pk))
      if (!row) {
        toastService.warning(`${t('common.detail')}: ${String(pk)}`)
        return
      }

      const initialValues = {
        C_GROUP: row.C_GROUP ?? 'SYSTEM',
        C_CODE: row.C_CODE ?? '',
        C_NAME: row.C_NAME ?? row.C_MENU_NAME ?? '',
        C_MENU_NAME: row.C_MENU_NAME ?? '',
        C_PARENT_CODE: row.C_PARENT_CODE ?? parentOptions[0]?.value ?? '',
        C_VIEW_FLAG: row.C_VIEW_FLAG === 1,
        C_UPDATE_FLAG: row.C_UPDATE_FLAG === 1,
        C_APPROVE_FLAG: row.C_APPROVE_FLAG === 1,
        C_MENU_FLAG: row.C_MENU_FLAG === 1,
        C_ADMIN_FLAG: row.C_ADMIN_FLAG === 1,
        C_ACTIVE: row.C_ACTIVE === 1,
        C_CONTENT: row.C_CONTENT ?? '',
      }

      openModal({
        title: canUpdate ? 'modal.backFunction.editTitle' : 'modal.backFunction.viewTitle',
        size: 'lg',
        className:
          'max-w-[760px] !p-0 gap-0 overflow-hidden [&>[data-slot=dialog-header]]:border-b [&>[data-slot=dialog-header]]:border-slate-200 [&>[data-slot=dialog-header]]:px-6 [&>[data-slot=dialog-header]]:py-4 [&_[data-slot=dialog-title]]:text-xl [&_[data-slot=dialog-title]]:font-semibold [&>[data-slot=dialog-close]]:top-3 [&>[data-slot=dialog-close]]:right-3',
        children: (
          <BackFunctionAddForm
            mode="update"
            readOnly={!canUpdate}
            itemId={String(row.PK_AUTHORITY ?? '')}
            parentOptions={parentOptions}
            initialValues={initialValues}
            onSubmitForm={canUpdate ? handleSubmitForm : undefined}
          />
        ),
      })
    },
    [canUpdate, handleSubmitForm, openModal, parentOptions, rows, t],
  )

  const handleDelete = useCallback(
    (pk: string | number) => {
      if (!canUpdate) return
      const row = rows.find((r) => String(r.PK_AUTHORITY) === String(pk))
      setDeleteTarget({
        pk,
        name: row?.C_PATH_NAME || row?.C_MENU_NAME || row?.C_NAME || row?.C_CODE || String(pk),
      })
    },
    [canUpdate, rows],
  )

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    if (!canUpdate) {
      setDeleteTarget(null)
      return
    }
    const itemId = String(deleteTarget.pk)
    const ok = await deleteBackFunctionMutation.mutateAsync(itemId)
    if (!ok) {
      toastService.error(t('backFunction.toast.deleteFail'))
      return
    }
    await reloadAuthorityTable()
    toastService.success(t('backFunction.toast.deleteSuccess'))
    setDeleteTarget(null)
  }, [canUpdate, deleteBackFunctionMutation, deleteTarget, reloadAuthorityTable, t])

  const handleAdd = useCallback(() => {
    if (!canUpdate) return
    openModal({
      title: 'modal.backFunction.addTitle',
      size: 'lg',
      className:
        'max-w-[760px] !p-0 gap-0 overflow-hidden [&>[data-slot=dialog-header]]:border-b [&>[data-slot=dialog-header]]:border-slate-200 [&>[data-slot=dialog-header]]:px-6 [&>[data-slot=dialog-header]]:py-4 [&_[data-slot=dialog-title]]:text-xl [&_[data-slot=dialog-title]]:font-semibold [&>[data-slot=dialog-close]]:top-3 [&>[data-slot=dialog-close]]:right-3',
      children: (
        <BackFunctionAddForm parentOptions={parentOptions} onSubmitForm={handleSubmitForm} />
      ),
    })
  }, [canUpdate, handleSubmitForm, openModal, parentOptions])

  return (
    <PageGuard functionCode={SYSTEM_RIGHT.BACK_FUNCTION}>
      <div className="px-4 pb-6 pt-4 sm:px-6">
        {canUpdate ? (
          <PageToolbar>
            <AddButton onClick={handleAdd} />
          </PageToolbar>
        ) : null}

        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => void refetch()}
        >
          <FuncTreeTable
            rows={rows}
            functionCode={SYSTEM_RIGHT.BACK_FUNCTION}
            onDetail={handleDetail}
            onDelete={canUpdate ? handleDelete : undefined}
          />
        </QueryState>

        <ConfirmActionModal
          open={!!deleteTarget}
          actionType="delete"
          objectName={deleteTarget?.name ?? ''}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          cancelText={t('common.cancel')}
          confirmText={t('common.delete')}
        />
      </div>
    </PageGuard>
  )
}
