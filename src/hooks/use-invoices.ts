import { Invoice } from "@/lib/invoice"
import { supabase } from "@/lib/supabase"
import type { DbInvoice } from "@/types"
import type { Events } from "@/types/shared"
import { useState, useEffect } from "react"

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<DbInvoice[]>([])

  useEffect(() => {
    const handler = async () => {
      const [success, data] = await Invoice.getInvoices()
			if (!success) return

			setInvoices(data)
    }
    handler()
    const channel = supabase
			.channel("db-changes")
      .on("broadcast", { event: "invoices-management" satisfies Events }, handler)
      .subscribe()

    return () => {
			supabase.removeChannel(channel).catch(() => undefined)
    }
  }, [])

  return invoices
}
