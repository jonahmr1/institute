import { UserConnection } from '../_shared/index.ts'
import { DeleteUser } from "../_shared/types.ts";

/* Whether to mark the user as deleted instead of literally deleting it from the db entierly */
const markAsDeletedInstead = true

Deno.serve(async (req) => {
  const connection = new UserConnection(req)
  const [success, response] = await connection.connect('delete:user')
  if (!success) return response
  const { privilege: privilege, corsHeaders, sendDbBroadcastChanges } = response

  const { identifier }: DeleteUser = await req.json()

  const { data, error: clientError } = await privilege
    .from('users')
    .select('id')
    .eq('identifier', identifier)
    .maybeSingle<{ id: string }>()
  if (clientError) return new Response(clientError.message, { status: 400, headers: corsHeaders })
  if (!data?.id) return new Response('User not found', { status: 400, headers: corsHeaders })

  const { error } = await privilege.auth.admin.deleteUser(data.id, markAsDeletedInstead)
  if (error) return new Response(error.message, { status: 400, headers: corsHeaders })

  const [ok, result] = await sendDbBroadcastChanges("users-management")
  if (!ok) return result

  return new Response("OK", { status: 200, headers: corsHeaders })
})