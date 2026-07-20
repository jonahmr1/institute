import type { Database } from '../../../src/types/_database.ts'
export type { UserAccount, CreateUser, DeleteUser, Events } from '../../../src/types/shared.ts'

export type Role = Database['public']['Tables']['users']['Row']['role']
export type Permission = Database["public"]["Enums"]["user_permissions"]
export type RealtimeRegisteration = [true] | [false, Response]