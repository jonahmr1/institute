import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import type { Table } from "@tanstack/react-table"

export const TableFooter = <TData,>({
  table,
}: {
  readonly table: Table<TData>
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between py-4">
      <p className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} {t("users.of")}{" "}
        {table.getFilteredRowModel().rows.length} {t("users.rows_selected")}
      </p>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.previousPage()
          }}
          disabled={!table.getCanPreviousPage()}
        >
          {t("users.previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.nextPage()
          }}
          disabled={!table.getCanNextPage()}
        >
          {t("users.next")}
        </Button>
      </div>
    </div>
  )
}
