import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { UserConnection } from '../_shared/index.ts'

export default {
  fetch: withSupabase({ auth: ["user"] }, async (req, ctx) => {
    if (ctx.authMode !== "user") return new Response('Unauthenticated, 1st degree', {
			status: 402
		})
		const connection = new UserConnection(req)
		const [success, response] = await connection.connect('delete:user')
		if (!success) return response
		const { privilege, corsHeaders, sendDbBroadcastChanges } = response
	
		const { id }: { id: string } = await req.json()
	
		const { error } = await privilege
			.from('invoices')
			.delete()
			.eq('id', id)
		if (error) return new Response(error.message, { status: 400, headers: corsHeaders })
	
		const [ok, result] = await sendDbBroadcastChanges("invoices-management")
		if (!ok) return result
	
		return new Response("OK", { status: 200, headers: corsHeaders })
	})
};

