import { supabase } from "@/lib/supabase"
import { User } from "@/lib/user"
import type { Events, UserAccount } from "@/types"
import { useState, useEffect } from "react"

export const useUsers = () => {
  const [users, setUsers] = useState<UserAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handler = async () => {
      setIsLoading(true)
      try {
        const [success, data] = await User.getUsers()
        if (success && Array.isArray(data)) setUsers(data)
      } finally {
        setIsLoading(false)
      }
    }
    handler().catch(() => undefined)
    const channel = supabase
      .channel("db-changes")
      .on("broadcast", { event: "users-management" satisfies Events }, () => {
        handler().catch(() => undefined)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel).catch(() => undefined)
    }
  }, [])

  return { users, isLoading }
}
