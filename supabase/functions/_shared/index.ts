// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import type { Events, Permission, Role, RealtimeRegisteration } from './types.ts';

export class UserConnection {
  private readonly corsHeaders: Record<string, string>
  private static readonly ALLOWED_ORIGINS = [
    'http://localhost:1420',
    'http://localhost:4173',
		'https://institute-8vgy.vercel.app'
  ] as const

  constructor(private readonly req: Request) {
    this.corsHeaders = this.buildCorsHeaders()
  }

  private buildCorsHeaders(): Record<string, string> {
    const origin = this.req.headers.get('Origin') ?? ''
    return {
      'Access-Control-Allow-Origin': UserConnection.ALLOWED_ORIGINS
        .includes(origin as typeof UserConnection.ALLOWED_ORIGINS[number])
        ? origin : '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': this.req.headers.get('Access-Control-Request-Headers') 
        ?? 'authorization, content-type',
    }
  }

  /**
    Connect the user to the database __PERMISSEVELY__
    @return Client's functions and the HTTP's headers
  */
  public async connect(permission: Permission): Promise<
    [false, Response]
    | [true, {
      client: SupabaseClient
      privilege: SupabaseClient
      corsHeaders: typeof UserConnection.prototype.corsHeaders
      sendDbBroadcastChanges: (event: Events) => Promise<RealtimeRegisteration>
    }]
  > {
    if (this.req.method === 'OPTIONS') return [false, new Response(null, { status: 204, headers: this.corsHeaders })]

    const Authorization = this.req.headers.get('Authorization')
    if (!Authorization) return [false, new Response('Authorization is not defined', { status: 401, headers: this.corsHeaders })]

    const url = Deno.env.get("SUPABASE_URL")
    const anon = Deno.env.get("SUPABASE_ANON_KEY")
    const role = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !anon || !role) return [false, new Response(null, { status: 400, headers: this.corsHeaders })]

    const client = createClient(url, anon, {
      global: { headers: { Authorization } }
    })

    const { data: { user } } = await client.auth.getUser()
    if (!user) return [false, new Response(null, { status: 400, headers: this.corsHeaders })]

    const { data: profile, error } = await client
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single<{ role: Role }>()
    if (error) return [false, new Response(error.message, { status: 400, headers: this.corsHeaders })]

    const { data: rolePermissions } = await client
      .from('role_permissions')
      .select('permissions')
      .eq('role', profile?.role)
      .single<{ permissions: Permission[] }>()

    const isPermissed = rolePermissions?.permissions.includes(permission) ?? false
    if (!isPermissed) return [false, new Response(null, { status: 403, headers: this.corsHeaders })]

    const privilege = createClient(url, role)

    /**
     * Register the admin to the database's changes
     * @return
    */
    const sendDbBroadcastChanges = async (event: Events): Promise<RealtimeRegisteration> => {
      const result = await client.channel("db-changes").send({
        type: "broadcast",
        event,
        payload: {},
      })
      if (result !== 'ok') return [false, new Response(result, { status: 500, headers: this.corsHeaders })]
      return [true]
    }
    return [true, {
      client,
      privilege,
      corsHeaders: this.corsHeaders,
      sendDbBroadcastChanges 
    }]
  }
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-users' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/