import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { UserAccount } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useUser } from "@/hooks/use-user"
import { toast } from "sonner"
import { useDir } from "@/hooks/use-dir.ts"
import { User } from "@/lib/user"
import { useState } from "react"
import {
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenu,
} from "../ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export const useColumns = (): ColumnDef<UserAccount>[] => {
  const { t } = useTranslation()
	const dir = useDir()
	const currentUser = useUser()
	const [disabled, setDisabled] = useState(false)

	const handleDelete = async (identifier: string) => {
		if (currentUser.getIdentifier === identifier) {
			toast.error(t("alerts.delete_yourself"))
			return
		}
		setDisabled(true)
		const [success, result, data] = await User.deleteUser(identifier)
		if (success) {
			toast.success(t(result, data))
			return
		}
		toast.error(t(result))
		setDisabled(false)
	}

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
      cell: ({ row }) => (
				<DropdownMenu dir={dir}>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => {
								navigator.clipboard.writeText(row.original.identifier).catch(() => undefined)
								toast.success(t("users.copied", { identifier: row.original }))
							}}
						>
							{t("users.copy_id")}
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								navigator.clipboard.writeText(row.original.name).catch(() => undefined)
								toast.success(t("users.name_copied", { name }))
							}}
						>
							{t("users.copy_name")}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							disabled={disabled}
							variant="destructive"
							onClick={() => {
								handleDelete(row.original.identifier).catch(() => undefined)
							}}
						>
							{t("users.delete")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
    },
  ]
}
