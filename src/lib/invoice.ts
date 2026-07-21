import { supabase } from "./supabase"
import type { Invoice as IInvoice, SupaInvoice } from '../types/shared'
import { Response, TranslationKey } from "@/types"

export class Invoice {
	private readonly customer: string
	private readonly image: File
	private readonly vehName: string

	constructor(customer: string, image: File, vehName: string) {
		this.customer = customer
		this.image = image
		this.vehName = vehName
	}

	public async create(sellerName: string, sellerIdentifier: string): Response<TranslationKey> {
		const { error } = await supabase.functions.invoke('create-invoice', {
			body: {
				customer: this.customer,
				image: this.path(sellerName),
				vehName: this.vehName,
				identifier: sellerIdentifier
			} satisfies SupaInvoice
		})
		if (error) return [false, 'invoices.failed']

		const [success, response] = await this.upload(sellerName)
		if (!success) return [false, response]
		return [true, 'invoices.success']
	}

	private path(seller: string) {
		return `${this.vehName}-${this.customer}-${seller}-${this.image.name}`
	}

	private async upload(seller: string): Response<TranslationKey | undefined> {
		const { error } = await supabase.storage
		.from('vehicle-images')
		.upload(
			this.path(seller),
			this.image,
			{
				contentType: this.image.type,
				upsert: false
			}
		)
		if (error) return [false, 'invoices.upload_failed']
		return [true, undefined]
	}
}