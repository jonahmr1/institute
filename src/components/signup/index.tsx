import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import React, { useState } from "react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { User } from "@/lib/user"
import type { OnChange, Role } from "@/types"
import { Identifier } from "./identifier"
import { RoleSelector } from "./role"
import { Password } from "./password"
import { Input } from "../ui/input"
import { Star } from "../required"
import { Spinner } from "../ui/spinner"

export const CreateUser = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
  const [{ name, identifier, role, password, confirmPassword }, setUser] = useState<{
    name: string
    identifier: string
    role: Role
    password: string
    confirmPassword: string
  }>({
    name: "",
    identifier: "",
    role: "student" satisfies Role,
    password: "",
    confirmPassword: "",
  })
  const onChange: OnChange = (key: string, value: string) => {
    setUser((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()
		setLoading(true)
    const [success, result, data] = await User.createUser({
			name,
      identifier,
      role,
      password,
      confirmPassword,
    })
    if (!success) {
      toast.error(t(result, data))
			setLoading(false)
			return
    }
    setUser({
      name: "",
      identifier: "",
      role: "student",
      password: "",
      confirmPassword: "",
    })
    toast.success(t(result, data))
    setOpen(false)
		setLoading(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("signup.create_user")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm ">
        <DialogHeader>
          <DialogTitle>{t("signup.create_user")}</DialogTitle>
          <DialogDescription>
            {t("signup.enter_user_information")}
          </DialogDescription>
        </DialogHeader>
        <form
          id="dialog"
          className="gap-6"
          onSubmit={(event) => {
            handleSubmit(event).catch(() => undefined)
          }}
        >
          <FieldGroup>
						<Field>
							<FieldLabel>{t(('users.name'))} <Star /></FieldLabel>
							<Input
								id="name"
								name="name"
								value={name}
								type="text"
								onChange={(event) => {
									onChange("name", event.target.value)
								}}
								required
								placeholder="Lenix Dev"
							/>
						</Field>
            <Identifier {...{ identifier, setUser, onChange }} />
            <RoleSelector {...{ setUser, onChange }} />
            <Password {...{ password, confirmPassword, onChange }} />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </DialogClose>
          <Button type="submit" form="dialog">
            {loading && <Spinner />}{t("create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
