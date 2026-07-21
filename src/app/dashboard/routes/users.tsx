import { DataTable } from "@/components/tables/rows"
import { useColumns } from "@/components/tables/columns"
import { useUsers } from "@/hooks/use-users"
import type { Rows, UserAccount } from "@/types"
import { useTranslation } from "react-i18next"
import { isRole } from "@/lib"
import { toast } from "sonner"
import { User } from "@/lib/user"
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenu,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { useDir } from "@/hooks/use-dir.ts"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreateUser } from "@/components/signup"

export const Users = () => {
  const { t } = useTranslation()
  const dir = useDir()
  const currentUser = useUser()
  const [disabled, setDisabled] = useState(false)

  const rows: Rows<UserAccount> = {
    data: useUsers().map((user) => ({
      ...user,
      roleLabel: isRole(user.role) ? t(`roles_alias.${user.role}`) : user.role,
    })),
    filters: ["identifier", "name"],
  }

  const columns = useColumns<UserAccount>({
    columns: [
      {
        accessorKey: "name",
        label: "users.name",
      },
      {
        accessorKey: "identifier",
        label: "users.identifier",
      },
      {
        accessorKey: "roleLabel",
        label: "role",
      },
    ],
    Actions: (row) => (
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
              navigator.clipboard
                .writeText(row.original.identifier)
                .catch(() => undefined)
              toast.success(
                t("users.copied", { identifier: row.original.identifier }),
              )
            }}
          >
            {t("users.copy_id")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard
                .writeText(row.original.name)
                .catch(() => undefined)
              toast.success(t("users.name_copied", { name: row.original.name }))
            }}
          >
            {t("users.copy_name")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={disabled}
            variant="destructive"
            onClick={async () => {
              if (currentUser.getIdentifier === row.original.identifier) {
                toast.error(t("alerts.delete_yourself"))
                return
              }
              setDisabled(true)
              const [success, result, data] = await User.deleteUser(
                row.original.identifier,
              )
              if (success) {
                toast.success(t(result, data))
                return
              }
              toast.error(t(result))
              setDisabled(false)
            }}
          >
            {t("users.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  })

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="max-w-4/5 container mx-auto py-10">
        <DataTable columns={columns} rows={rows} features={[<CreateUser />]} />
      </div>
    </div>
  )
}
