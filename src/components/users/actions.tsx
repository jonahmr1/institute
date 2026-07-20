import { useUser } from "@/hooks/use-user"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Button } from "../ui/button"
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenu,
} from "../ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { User } from "@/lib/user"
import { useDir } from "@/hooks/use-dir.ts"

export const ActionsCell = ({
  identifier,
}: {
  readonly identifier: string
}) => {
  const { t } = useTranslation()
  const dir = useDir()
  const currentUser = useUser()
  const [disabled, setDisabled] = useState(false)

  const handleDelete = async () => {
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

  return (
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
            navigator.clipboard.writeText(identifier).catch(() => undefined)
            toast.success(t("users.copied", { identifier }))
          }}
        >
          {t("users.copy_id")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={disabled}
          variant="destructive"
          onClick={() => {
            handleDelete().catch(() => undefined)
          }}
        >
          {t("users.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
