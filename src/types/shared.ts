export type Events = "users-management" | "invoices-management"
export interface CreateUser<Role> {
  name: string
  identifier: string
  role: Role
  password: string
}
export interface UserAccount<Role, Label = string | unknown> {
  name: string
  id: string
  identifier: string
  role: Role
  roleLabel: Label
}
export interface DeleteUser {
  identifier: string
}

export interface Invoice<T extends string | File | null> {
  customer: string
  image: T
  vehName: string
}

export interface SupaInvoice extends Invoice<string> {
  identifier: string
}
