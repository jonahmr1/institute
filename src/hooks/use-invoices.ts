import { Invoice } from "@/lib/invoice"
import { supabase } from "@/lib/supabase"
import type { DbInvoice } from "@/types"
import type { Events } from "@/types/shared"
import { useState, useEffect } from "react"

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<DbInvoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handler = async () => {
      setIsLoading(true)
      try {
        const [success, data] = await Invoice.getInvoices()
        if (success) setInvoices(data)
      } finally {
        setIsLoading(false)
      }
    }
    handler().catch(() => undefined)
    const channel = supabase
      .channel("db-changes")
      .on(
        "broadcast",
        { event: "invoices-management" satisfies Events },
        () => {
          handler().catch(() => undefined)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel).catch(() => undefined)
    }
  }, [])

  return { invoices, isLoading }
}
