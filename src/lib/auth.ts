import { supabase } from "./supabase"
import type { Response, TranslationKey } from "@/types"

export const signIn = async (
  identifier: string,
  password: string,
): Response<TranslationKey> => {
  const { error } = await supabase.auth.signInWithPassword({
    email: `${identifier}@example.com`,
    password,
  })
  if (error) return [false, error.message]

  return [true, "alerts.signin_success"]
}
