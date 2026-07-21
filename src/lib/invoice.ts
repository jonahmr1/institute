import { supabase } from "./supabase"
import type { SupaInvoice } from '../types/shared'
import { DbInvoice, Response, TranslationKey } from "@/types"

export class Invoice {
	private readonly customer: string
	private readonly image: File
	private readonly vehName: string

	constructor(customer: string, image: File, vehName: string) {
		this.customer = customer
		this.image = image
		this.vehName = vehName
	}

	public async create(sellerIdentifier: string): Response<TranslationKey> {
		const { error } = await supabase.functions.invoke('create-invoice', {
			body: {
				customer: this.customer,
				image: this.id(),
				vehName: this.vehName,
				identifier: sellerIdentifier
			} satisfies SupaInvoice
		})
		if (error) return [false, 'invoices.failed']

		const [success, response] = await this.upload()
		if (!success) return [false, response]
		return [true, 'invoices.success']
	}

	private id() {
		return `${crypto.randomUUID()}`
	}

	private async upload(): Response<TranslationKey | undefined> {
		const { error } = await supabase.storage
		.from('vehicle-images')
		.upload(
			this.id(),
			this.image,
			{
				contentType: this.image.type,
				upsert: false
			}
		)
		if (error) return [false, 'invoices.upload_failed']
		return [true, undefined]
	}

	public static async getInvoices(): Response<DbInvoice[], TranslationKey> {
		const { error, data } = await supabase.from('invoices').select()
		if (error) return [false, 'invoices.failed_fetch']

		return [true, data]
	}

	public static async delete(id: string): Response<TranslationKey> {
		const { error } = await supabase.functions.invoke('delete-user', {
			body: {
				id
			}
		})
		if (error) return [false, 'invoices.failed_delete']

		return [true, 'invoices.success_delete', { id }]
	}
}