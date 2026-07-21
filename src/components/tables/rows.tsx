import {
  type ColumnDef,
  type SortingState,
  type Row,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ReactNode} from "react";
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Settings } from "lucide-react"
import { useDir } from "@/hooks/use-dir.ts"
import type { Rows } from "@/types"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  rows: Rows<TData>
}

export const DataTable = <TData, TValue>({
	rows: {
		data,
		filters
	},
  columns,
	features
}: Readonly<DataTableProps<TData, TValue>> & { features: ReactNode[] }) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const { t } = useTranslation()
	const dir = useDir()

  const searchableColumns = filters.map(String)
  const globalFilterFn = (row: Row<TData>, _columnIds: string, filterValue: string) => {
    const needle = String(filterValue ?? "").toLowerCase()
    if (!needle) {
      return true
    }
    return searchableColumns.some((columnId) => String(row.getValue<unknown>(columnId) ?? "").toLowerCase().includes(needle))
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      globalFilter,
      rowSelection,
      columnVisibility,
    },
  })

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
				<Input
					placeholder={t("search")}
					value={globalFilter}
					onChange={(event) => { setGlobalFilter(event.target.value); }}
					className="max-w-sm"
				/>
				<div className="flex gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								<Settings className="mr-2 h-4 w-4" />
								{t("view")}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map(
									(column): React.ReactNode =>
										!filters.includes(column.id as Extract<keyof TData, string>) && (
											<DropdownMenuCheckboxItem
												dir={dir}
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) => {
													column.toggleVisibility(value)
												}}
											>
												{t(column.id)}
											</DropdownMenuCheckboxItem>
										),
								)}
						</DropdownMenuContent>
					</DropdownMenu>
					{...features}
				</div>
			</div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, i) => (
                  <TableHead key={header.id} className={i === 0 || i === headerGroup.headers.length - 1 ? "" : "px-0"}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("no_results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
				<p className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} {t("of")}{" "}
					{table.getFilteredRowModel().rows.length} {t("rows_selected")}
				</p>
				<div className="flex items-center justify-end space-x-2 py-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							table.previousPage()
						}}
						disabled={!table.getCanPreviousPage()}
					>
						{t("previous")}
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							table.nextPage()
						}}
						disabled={!table.getCanNextPage()}
					>
						{t("next")}
					</Button>
				</div>
			</div>
    </div>
  )
}
