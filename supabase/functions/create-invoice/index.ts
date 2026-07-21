import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import type { SupaInvoice } from '../../../src/types/shared.ts'
import { UserConnection } from '../_shared/index.ts'

export default {
  fetch: withSupabase({ auth: ["user"] }, async (req, ctx) => {
    if (ctx.authMode !== "user") return new Response('Unauthenticated, 1st degree', {
			status: 402
		})
		const connection = new UserConnection(req)
		const [success, response] = await connection.connect('create:invoice')
		if (!success) return response
		const { privilege, corsHeaders, sendDbBroadcastChanges } = response
	
		const { customer, image, vehName, identifier }: SupaInvoice = await req.json()

		const { error } = await privilege
			.from('invoices')
			.insert({ customer, image, veh_name: vehName, seller: identifier })
		if (error) return new Response(error.message, { status: 400, headers: corsHeaders })

			const [ok, result] = await sendDbBroadcastChanges("invoices-management")
		if (!ok) return result
		
		return new Response('OK', { status: 200, headers: corsHeaders })
	})
};