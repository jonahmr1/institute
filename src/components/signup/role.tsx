import { t } from "i18next"
import { Field, FieldLabel } from "../ui/field"
import { isRole, ROLE_PERMISSIONS } from "@/lib"
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Select,
} from "../ui/select"
import type { OnChange } from "@/types"
import { Star } from "../required"
import { useDir } from "@/hooks/use-dir.ts"

export const RoleSelector = ({ onChange }: { readonly onChange: OnChange }) => {
  const dir = useDir()
  return (
    <Field>
      <FieldLabel>
        {t("role")}
        <Star />
      </FieldLabel>
      <Select
        dir={dir}
        defaultValue="student"
        onValueChange={(value) => {
          if (isRole(value)) onChange("role", value)
        }}
      >
        <SelectTrigger dir={dir} className="w-full">
          <SelectValue placeholder={t("signup.role")} />
        </SelectTrigger>
        <SelectContent dir={dir}>
          <SelectGroup className="w-full">
            <SelectLabel>{t("roles")}</SelectLabel>
            {Object.keys(ROLE_PERMISSIONS).map((role) => (
              <SelectItem key={role} value={role}>
                {t(`roles_alias.${role}`)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
