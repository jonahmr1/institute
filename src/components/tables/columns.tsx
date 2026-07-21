import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { TranslationKey } from "@/types"
import type { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { ReactNode } from "react"

export const useColumns = <T,>({
  columns,
  Actions,
}: {
  columns: {
    accessorKey: string
    label: TranslationKey
    overrides?: Pick<ColumnDef<T>, "cell">
  }[]
  Actions: (row: Row<T>) => ReactNode
}): ColumnDef<T>[] => {
  const { t } = useTranslation()
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(value === true)
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(value === true)
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...columns.map(({ accessorKey, label, overrides }) => ({
      accessorKey,
      filterFn: (row: Row<T>, columnId: string, filterValue: string) =>
        String(row.getValue<unknown>(columnId) ?? "").includes(filterValue),
      header: ({
        column,
      }: {
        column: {
          toggleSorting: (desc?: boolean) => void
          getIsSorted: () => "asc" | "desc" | false
        }
      }) => (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc")
          }}
        >
          {t(label)}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      ...overrides,
    })),
    {
      id: "actions",
      header: () => <p>{t("actions")}</p>,
      cell: async ({ row }) => Actions(row),
    },
  ]
}
