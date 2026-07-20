export type Events = "users-management"
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
