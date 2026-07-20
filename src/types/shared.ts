export type Events = "users-management"
export interface CreateUser<Role> {
  identifier: string
  role: Role
  password: string
}
export interface UserAccount<Role, Label = string> {
  id: string
  identifier: string
  role: Role
  roleLabel: Label
}
export interface DeleteUser {
  identifier: string
}
