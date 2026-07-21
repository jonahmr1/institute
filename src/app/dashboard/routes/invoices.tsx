import { DataTable } from "@/components/tables/rows"
import { useColumns } from "@/components/tables/columns"
import type { DbInvoice, Rows,  } from "@/types"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import {
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenu,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { useDir } from "@/hooks/use-dir.ts"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreateInvoice } from "@/components/invoices"
import { useInvoices } from "@/hooks/use-invoices"
import { Invoice } from "@/lib/invoice"

export const invoices = () => {
	const { t } = useTranslation()
	const dir = useDir()
	const user = useUser()
	const [disabled, setDisabled] = useState(false)

	const rows: Rows<DbInvoice> = {
		data: useInvoices().map(invoice => ({
			...invoice,
			created_at: new Intl.DateTimeFormat("en-US", {
				dateStyle: "medium",
				timeStyle: "short",
			}).format(new Date(invoice.created_at))
		})),
		filters: ['id', 'customer', 'veh_name', 'seller']
	}

	const columns = useColumns<DbInvoice>({
		columns: [
			{
				accessorKey: 'id',
				label: 'invoices.id',
			},
			{
				accessorKey: 'customer',
				label: 'invoices.customer',
			},
			{
				accessorKey: 'veh_name',
				label: 'invoices.veh_name',
			},
			{
				accessorKey: 'seller',
				label: 'invoices.seller',
			},
			{
				accessorKey: 'created_at',
				label: 'invoices.date',
			},
		],
		Actions: (row) => (
			<DropdownMenu dir={dir}>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => {
							navigator.clipboard.writeText(row.original.id).catch(() => undefined)
							toast.success(t("invoices.copied", { identifier: row.original.id }))
						}}
					>
						{t("invoices.copy_id")}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							navigator.clipboard.writeText(row.original.customer).catch(() => undefined)
							toast.success(t("users.customer_name_copied", { name: row.original.customer }))
						}}
					>
						{t("invoices.copy_customer")}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							navigator.clipboard.writeText(row.original.seller.toString()).catch(() => undefined)
							toast.success(t("users.seller_id_copied", { id: row.original.seller }))
						}}
					>
						{t("invoices.copy_seller")}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						disabled={disabled || user.getRole !== 'manager'}
						variant="destructive"
						onClick={async () => {
							setDisabled(true)
							const [success, result, data] = await Invoice.delete(row.original.id)
							if (success) {
								toast.success(t(result, data))
								return
							}
							toast.error(t(result, data))
							setDisabled(false)
						}}
					>
						{t("invoices.delete")}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		)
	})

	return (
		<div className="h-full w-full flex items-center justify-center">
			<div className="max-w-4/5 container mx-auto py-10">
				<DataTable columns={columns} rows={rows} features={[
					<CreateInvoice />
				]} />
			</div>
		</div>
	)
}
