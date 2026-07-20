import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { User } from "@/lib/user"
import type { AuthState, UserAccount } from "@/types"
import { AuthContext } from "@/contexts/auth"
import type { Session } from "@supabase/supabase-js"

export const AuthProvider = ({
  children,
}: {
  readonly children: React.ReactNode
}) => {
  const [state, setState] = useState<AuthState>({
    status: "loading",
    user: undefined,
  })

  const fetchUser = async (session: Readonly<Session>) => {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("role, identifier, name")
      .eq("id", session.user.id)
      .single<UserAccount>()

    if (userError) {
      setState({ status: "unauthenticated", user: null })
      return undefined
    }
    return user
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session) {
        setState({ status: "unauthenticated", user: null })
        return
      }

      if (session.user.deleted_at !== undefined) {
        setState({ status: "unauthorized", user: null })
        return
      }

      const user = await fetchUser(session)
      if (!user) return

      const userInstance = new User(user.identifier, user.role, user.name)
      setState({ status: "authenticated", user: userInstance })
    })

    return (): void => {
      subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}
