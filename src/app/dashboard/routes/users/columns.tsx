import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { UserAccount } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ActionsCell } from "./actions"

export const useColumns = (): ColumnDef<UserAccount>[] => {
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
    {
      accessorKey: "name" satisfies keyof UserAccount,
      filterFn: (row, columnId, filterValue: string) =>
        row.getValue<number>(columnId).toString().includes(filterValue),
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc")
          }}
        >
          {t("users.name")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "identifier" satisfies keyof UserAccount,
      filterFn: (row, columnId, filterValue: string) =>
        row.getValue<number>(columnId).toString().includes(filterValue),
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc")
          }}
        >
          {t("users.identifier")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "roleLabel" satisfies keyof UserAccount,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc")
          }}
        >
          {t("role")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "actions",
      header: () => <p>{t("actions")}</p>,
      cell: ({ row }) => <ActionsCell identifier={row.original.identifier} name={row.original.name} />,
    },
  ]
}
