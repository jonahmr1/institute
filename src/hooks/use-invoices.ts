import { Invoice } from "@/lib/invoice"
import { supabase } from "@/lib/supabase"
import { DbInvoice } from "@/types"
import { Events } from "@/types/shared"
import { useState, useEffect } from "react"

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<DbInvoice[]>([])

  useEffect(() => {
    const handler = () => {
      Invoice.getInvoices()
        .then(([success, data]) => {
          if (success) setInvoices(data)
        })
        .catch(() => undefined)
    }
    handler()
    const channel = supabase
      .channel("db-changes")
      .on("broadcast", { event: "invoices-management" satisfies Events }, () => {
				console.debug(true)
				handler()
			})
      .subscribe()

    return () => {
      supabase.removeChannel(channel).catch(() => undefined)
    }
  }, [])

  return invoices
}
