import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { signIn } from "@/lib/auth"
import { useTranslation } from "react-i18next"
import { User } from "@/lib/user"
import { AuthContext } from "@/contexts/auth"

export const LoginForm = ({ className }: React.ComponentProps<"form">) => {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const auth = useContext(AuthContext)
  const { t } = useTranslation()

  useEffect(() => {
    if (auth.status === "authenticated") navigate("/", { replace: true })
  }, [auth.status, navigate])

  const isIdentifierInvalid =
    identifier.length > 0 && identifier.length !== User.static.identifier

  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()
    const [success, result] = await signIn(identifier, password)
    if (!success) {
      toast.error(result)
      return
    }
    toast.success(t(result, { identifier }))
  }
  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={(event) => {
        handleSubmit(event).catch(() => undefined)
      }}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("login.title")}</h1>
          <p className="text-sm text-balance text-muted-foreground">
            {t("login.hint")}
            {/* TODO: add explaination where we can find the id */}
          </p>
        </div>
        <Field data-invalid={isIdentifierInvalid}>
          <FieldLabel htmlFor="identifier">{t("identification")}</FieldLabel>
          <Input
            value={identifier}
            onChange={(event) => {
              setIdentifier(event.target.value)
            }}
            id="identifier"
            name="identifier"
            type="number"
            placeholder="6901120"
            required
            aria-invalid={isIdentifierInvalid}
            className="bg-background"
          />
          {isIdentifierInvalid && (
            <FieldError
              errors={[
                {
                  message: t("signup.identification_mismatch", {
                    identifierLength: User.static.identifier,
                  }),
                },
              ]}
            />
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
          <Input
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
            }}
            id="password"
            type="password"
            required
            className="bg-background"
          />
          <div className="flex items-center justify-end">
            <Button
              variant={null}
              type="button"
              onClick={() => toast.message(t("alerts.feature_unavailable"))}
              className="cursor-default text-sm underline-offset-4 hover:underline"
            >
              {t("login.forgotPassword")}
            </Button>
          </div>
        </Field>
        <Field>
          <Button type="submit">{t("login.login")}</Button>
        </Field>
      </FieldGroup>
    </form>
    /* TODO: add translation btn */
  )
}
