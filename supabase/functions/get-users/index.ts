import { UserConnection } from '../_shared/index.ts'
import type { Role, UserAccount } from '../_shared/types.ts'

Deno.serve(async (req) => {
  const connection = new UserConnection(req)
  const [success, response] = await connection.connect('read:users')
  if (!success) return response
  const { privilege: priviledged, corsHeaders } = response

  const { data: { users }, error } = await priviledged.auth.admin.listUsers()

  // why its throwing User not allowed here?
  if (error) return new Response(error.message, { status: 400, headers: corsHeaders })

  /* Get the users's data from `public.users` */
  const { data: profiles, error: postgresError } = await priviledged
    .from('users')
    .select('id, role, identifier').overrideTypes<UserAccount<Role>[]>()
  if (postgresError) return new Response(postgresError.message, { status: 400, headers: corsHeaders })

  /* Security: only send wanted data */
  const usersData = users.flatMap((user) => {
    // remove the falsy value returned from the method `find` and filters out the soft deleted users
    const profile = profiles.find((p) => p.id === user.id && !user.deleted_at)
    if (!profile) return []
    return [{ identifier: profile.identifier, role: profile.role }]
  })

  return Response.json(usersData, { status: 200, headers: corsHeaders })
})