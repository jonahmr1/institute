import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import React, { useState } from "react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { Input } from "../ui/input"
import { Star } from "../required"
import { Spinner } from "../ui/spinner"
import { Invoice } from "@/lib/invoice"
import type { Invoice as IInvoice } from '@/types/shared'
import { useUser } from "@/hooks/use-user"

export const CreateInvoice = () => {
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [{ customer, image, vehName }, setInvoice] = useState<IInvoice<File | null>>({
		customer: "",
		image: null,
		vehName: "",
	})
	const user = useUser()

	const onChange = (key: keyof IInvoice<File>, value: IInvoice<File>[keyof IInvoice<File>]) => {
		setInvoice((prev) => ({ ...prev, [key]: value }))
	}

	const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
		event.preventDefault()
		setLoading(true)
		if (!image) {
			toast.error("Image cannot be null")
			setLoading(false)
			return
		}
		
		const [success, result, data] = await new Invoice(customer, image, vehName).create(user.getName, user.getIdentifier)
		if (!success) {
			toast.error(t(result, data))
			setLoading(false)
			return
		}
		setInvoice({
			customer: '',
			image: null,
			vehName: ''
		})
		toast.success(t(result, data))
		setOpen(false)
		setLoading(false)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">{t("invoices.create")}</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-sm ">
				<DialogHeader>
					<DialogTitle>{t("invoices.create")}</DialogTitle>
					<DialogDescription>
						{t("invoices.enter_info")}
					</DialogDescription>
				</DialogHeader>
				<form
					id="dialog"
					className="gap-6"
					onSubmit={(event) => {
						handleSubmit(event).catch(() => undefined)
					}}
				>
					<FieldGroup>
						<Field>
							<FieldLabel>Customer <Star /></FieldLabel>
							<Input
								id="customer"
								name="customer"
								value={customer}
								type="text"
								onChange={(event) => {
									onChange("customer", event.target.value)
								}}
								required
								placeholder="Lenix Dev"
							/>
						</Field>
						<Field>
							<FieldLabel>Vehicle Image <Star /></FieldLabel>
							<FieldDescription>Please make sure the image name does not contain any spaces</FieldDescription>
							<Input
								id="image"
								name="image"
								type="file"
								onChange={(event) => {
									setInvoice((prev) => ({
										...prev,
										image: event.target.files?.[0] ?? null,
									}))
								}}
								required
							/>
						</Field>
						<Field>
							<FieldLabel>Vehicle Name</FieldLabel>
							<Input
								id="vehName"
								name="vehName"
								value={vehName}
								onChange={(event) => {
									onChange("vehName", event.target.value)
								}}
								type="text"
								placeholder="Mercedes A180"
							/>
						</Field>
					</FieldGroup>
				</form>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">{t("cancel")}</Button>
					</DialogClose>
					<Button type="submit" form="dialog">
						{loading && <Spinner />}{t("create")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
