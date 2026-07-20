import { t } from "i18next"
import { Field, FieldLabel, FieldDescription } from "../ui/field"
import { Input } from "../ui/input"
import zxcvbn from "zxcvbn"
import { User } from "@/lib/user"
import type { OnChange } from "@/types"
import { Star } from "../required"

export const Password = ({
  password,
  confirmPassword,
  onChange,
}: {
  readonly password: string
  readonly confirmPassword: string
  readonly onChange: OnChange
}) => {
  const strength = zxcvbn(password)

  const widths = ["1%", "20%", "60%", "80%", "100%"]
  const colors = [
    "bg-destructive",
    "bg-red-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-green-500",
  ]
  const isConfirmed = password !== confirmPassword
  return (
    <Field>
      <Field className="grid grid-rows-2 gap-4">
        <Field>
          <FieldLabel htmlFor="password">
            {t("password")}
            <Star />
          </FieldLabel>
          <Input
            id="password"
            type="password"
            required
            value={password}
						placeholder="********"
            onChange={(event) => {
              onChange("password", event.target.value)
            }}
          />
        </Field>
        <Field data-invalid={isConfirmed}>
          <FieldLabel htmlFor="confirm-password">
            {t("signup.confirm_password")}
            <Star />
          </FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
						placeholder="********"
            value={confirmPassword}
            onChange={(event) => {
              onChange("confirmPassword", event.target.value)
            }}
            aria-invalid={isConfirmed}
          />
        </Field>
      </Field>
      <div hidden={!password} className="h-1 pb-1 w-full bg-muted rounded-full">
        <div
          className={`h-1 rounded-full transition-all ${colors[strength.score]}`}
          style={{ width: widths[strength.score] }}
        />
      </div>
      <FieldDescription>
        {t("signup.password_rule", { length: User.static.password })}
      </FieldDescription>
    </Field>
  )
}
