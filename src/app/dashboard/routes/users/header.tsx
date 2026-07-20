import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Settings } from "lucide-react"
import { useTranslation } from "react-i18next"
import { CreateUser } from "@/components/signup"
import type { Table } from "@tanstack/react-table"
import { useDir } from "@/hooks/use-dir.ts"

export const Header = <TData,>({ table }: { readonly table: Table<TData> }) => {
  const { t } = useTranslation()
  const dir = useDir()

  return (
    <div className="flex items-center justify-between gap-2">
      <Input
        placeholder={t("users.search")}
        value={
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
          (table.getColumn("identifier")?.getFilterValue() as string) || ""
        }
        onChange={(event) =>
          table.getColumn("identifier")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              {t("users.view")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map(
                (column): React.ReactNode =>
                  column.id !== "identifier" && (
                    <DropdownMenuCheckboxItem
                      dir={dir}
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => {
                        column.toggleVisibility(value)
                      }}
                    >
                      {t(column.id)}
                    </DropdownMenuCheckboxItem>
                  ),
              )}
          </DropdownMenuContent>
        </DropdownMenu>
        <CreateUser />
      </div>
    </div>
  )
}
