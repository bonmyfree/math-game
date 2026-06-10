import type { CdsDeletedDocData } from '@/features/digital-transform/services'
import { formatCellValue } from '@/shared/components/table/listTableCells'

export function rowId(row: CdsDeletedDocData) {
  return row.PK_FILES
}

export function fileName(row: CdsDeletedDocData) {
  return formatCellValue(row.FILE_NAME)
}

export function docNo(row: CdsDeletedDocData) {
  return formatCellValue(row.DOCUMENTNUMBER)
}

export function issueDate(row: CdsDeletedDocData) {
  return row.ISSUEDDATE
}

export function uploader(row: CdsDeletedDocData) {
  return formatCellValue(row.UPLOADEDBY)
}

export function deleteTime(row: CdsDeletedDocData) {
  return row.DATETIME
}

export function department(row: CdsDeletedDocData) {
  return formatCellValue(row.UPLOADEDBYDEPARTMENT)
}
