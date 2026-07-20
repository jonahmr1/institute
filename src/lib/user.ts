import { supabase } from "./supabase"
import type {
  Role,
  Permission,
  Response,
  UserAccount,
  CreateUser,
  DeleteUser,
  TranslationKey,
} from "@/types"
import { FunctionsHttpError } from "@supabase/supabase-js"
import { ROLE_PERMISSIONS } from "."

export class User {
  private static readonly IDENTIFIER_LENGTH = 7
  private static readonly PASSWORD_LENGTH = 8
  private readonly identifier: string
  private readonly role: Role
  private readonly name: string

  public constructor(identifier: string, role: Role, name: string) {
    this.identifier = identifier
		this.role = role
		this.name = name
  }

  public static get static() {
    return {
      password: User.PASSWORD_LENGTH,
      identifier: User.IDENTIFIER_LENGTH,
    }
  }

  public get getIdentifier(): string {
    return this.identifier
  }

  public get getName(): string {
    return this.name
  }

  public get getRole(): Role {
    return this.role
  }

  public static async createUser({
    name,
    identifier,
    role,
    password,
    confirmPassword,
  }: Readonly<{
		name: string
    identifier: string
    role: Role
    password: string
    confirmPassword: string
  }>): Promise<Response<TranslationKey, string, number | string | undefined>> {
		if (!name.length) return [
			false,
			"signup.empty_name",
		]
    if (identifier.length !== User.IDENTIFIER_LENGTH)
      return [
        false,
        "signup.identification_mismatch",
        { identifierLength: User.IDENTIFIER_LENGTH },
      ]
    if (password.length < User.PASSWORD_LENGTH)
      return [
        false,
        "signup.password_mismatch",
        { passwordLength: User.PASSWORD_LENGTH },
      ]
    if (password !== confirmPassword)
      return [false, "signup.passwords_unmatched"]

    const result: { error: Error | null } = await supabase.functions.invoke(
      "create-user",
      {
        body: {
					name,
          identifier,
          password,
          role,
        } satisfies CreateUser as CreateUser,
      },
    )
    const { error } = result

    if (error) return await User.catchHttpError(error)
    return [true, "signup.success", { identifier }]
  }

  public static async signOut(): Response<TranslationKey> {
		const { error } = await supabase.auth.signOut({ scope: "local" })
    if (error) return [false, error.message]
    return [true, "alerts.logout_success"]
  }

  public static async getUsers(): Response<UserAccount[]> {
    const reponse = await supabase.functions.invoke<UserAccount[]>(
      "get-users",
      {
        body: {},
      },
    )

    if (!reponse.data) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      return await User.catchHttpError(reponse.error as Error)
    }

    return [true, reponse.data]
  }

  public static async deleteUser(identifier: string): Response<TranslationKey> {
    const { error } = (await supabase.functions.invoke("delete-user", {
      body: { identifier } as DeleteUser,
    })) as { error: Error | null }
    if (error) return await User.catchHttpError(error)

    return [true, "signout.delete_success", { identifier }]
  }

  private static async catchHttpError(
    error: Readonly<Error>,
  ): Promise<[false, string]> {
    if (error instanceof FunctionsHttpError) {
      const errorInstance: { context: { text: () => Promise<string> } } = error
      const message = await errorInstance.context.text()
      return [false, message]
    }
    return [false, error.message]
  }

  public can(permission: Permission): boolean {
    return ROLE_PERMISSIONS[this.role].includes(permission)
  }
}
