"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const columns = (handleQuantityChange, selectedProducts) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Tout sélectionner"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nom",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-lg"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nom
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-base">{row.getValue("nom")}</div>,
  },
  {
    accessorKey: "description",
    header: () => <span className="text-lg">Description</span>,
    cell: ({ row }) => (
      <div className="text-base">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "quantite",
    header: () => <span className="text-lg">Quantité stock</span>,
    cell: ({ row }) => (
      <div className="text-base">{row.getValue("quantite")}</div>
    ),
  },
  {
    accessorKey: "prix",
    header: () => <span className="text-lg">Prix Unitaire</span>,
    cell: ({ row }) => (
      <div className="text-base">{row.getValue("prix")} F CFA</div>
    ),
  },
  {
    id: "quantiteAchetee",
    header: () => <span className="text-lg">Quantité achetée</span>,
    cell: ({ row }) => {
      const produitId = row.original._id
      const quantiteAchetee = selectedProducts[produitId]?.quantite || 0

      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              handleQuantityChange(produitId, Math.max(0, quantiteAchetee - 1), row.original)
            }
          >
            -
          </Button>
          <span>{quantiteAchetee}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              handleQuantityChange(produitId, quantiteAchetee + 1, row.original)
            }
          >
            +
          </Button>
        </div>
      )
    },
  },
]

export default function DataTableDemo({selectedProducts, setSelectedProducts}) {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // ✅ objet des produits sélectionnés
  // const [selectedProducts, setSelectedProducts] = useState({})

  const fetchData = async () => {
    try {
      const token = await window.electronAPI.getToken()
      if (!token) throw new Error("Token non disponible")

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/produits`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error("Erreur lors de la récupération des données")
      const result = await response.json()
      setData(result)
      setIsLoading(false)
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleQuantityChange = (produitId, newQuantite, produit) => {
    setSelectedProducts((prev) => {
      if (!prev[produitId]) return prev
      return {
        ...prev,
        [produitId]: {
          ...prev[produitId],
          quantite: newQuantite,
          total: produit.prix * newQuantite,
        },
      }
    })
  }

  const table = useReactTable({
    data,
    columns: columns(handleQuantityChange, selectedProducts),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // ✅ mettre à jour selectedProducts quand on coche/décoche
  useEffect(() => {
    const newSelected = {}
    table.getRowModel().rows.forEach((row) => {
      if (row.getIsSelected()) {
        newSelected[row.original._id] = {
          nom: row.original.nom,
          prix: row.original.prix,
          quantite: selectedProducts[row.original._id]?.quantite || 1,
          total:
            row.original.prix *
            (selectedProducts[row.original._id]?.quantite || 1),
        }
      }
    })
    setSelectedProducts(newSelected)
    // alert(JSON.stringify(selectedProducts))
  }, [rowSelection, data])

  // ✅ calcul du total global
  const totalGeneral = Object.values(selectedProducts).reduce(
    (acc, prod) => acc + prod.total,
    0
  )

  if (isLoading) {
    return (
      <div className="w-full text-center py-10 text-xl font-semibold">
        Loading 2...
      </div>
    )
  }

  return (
    <div className="w-full bg-yellow-200/5 p-3">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrer par nom..."
          value={table.getColumn("nom")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("nom")?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-base"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto text-base">
              Colonnes
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize text-base"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ✅ tableau */}
      <div className="overflow-x-auto rounded-md border w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-lg">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-base ">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-lg "
                >
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ✅ affichage du total */}
      <div className="text-right mt-4 text-lg font-bold">
        Total général : {totalGeneral} F CFA
      </div>
    </div>
  )
}
