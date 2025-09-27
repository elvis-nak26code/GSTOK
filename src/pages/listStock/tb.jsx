"use client"
import Modifier from "./modifier"
import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

import { useState ,useEffect } from "react"
import { Loader2 } from "lucide-react"
import AlertDialogDemo from "./dialogAlert"

// Colonnes de ton tableau
export const columns = [
  {
    id: "select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nom",
    header: "Nom",
    cell: ({ row }) => <div className="text-base font-medium bg-blue-50 p-1">{row.getValue("nom")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div className="text-base font-medium">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "categorie",
    header: "Catégorie",
    cell: ({ row }) => (
      <div className="text-base font-medium capitalize bg-amber-50 p-2">{row.getValue("categorie")}</div>
    ),
  },
  {
    accessorKey: "prix",
    header: () => <div className="text-right text-lg font-semibold">Prix</div>,
    cell: ({ row }) => {
      const prix = parseFloat(row.getValue("prix"))
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "FCF",
      }).format(prix)
      return <div className="text-right text-base font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "seuilAlerte",
    header: "Seuil d'alerte",
    cell: ({ row }) => <div className="text-base font-medium bg-red-50 p-2">{row.getValue("seuilAlerte")}</div>,
  },
  {
    accessorKey: "quantite",
    header: "Quantité",
    cell: ({ row }) => {
      const quantite = row.getValue("quantite");
      const seuilAlerte = row.getValue("seuilAlerte");
    
      return (
        <div
          className={`text-base font-medium p-2 rounded ${
            quantite <= seuilAlerte
              ? "bg-red-500 text-white animate-pulse" // alerte (clignotant rouge)
              : "bg-green-50 text-green-700" // stock OK
          }`}
        >
          {quantite}
        </div>
      );
    },
    
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const produit = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(produit._id)}>
              Copier l’ID produit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>Modifier produit</DropdownMenuItem> */}
            {/* On passe fetchData comme onUpdate */}
            {/* <AlertDialogDemo id={produit._id} /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function DataTableDemo() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // ⚡ fetchData accessible pour rafraîchir le tableau
  const fetchData = async () => {
    try {
        const token = await window.electronAPI.getToken();
        // alert("Token récupéré :" + token);
        if (!token) throw new Error("Token non disponible");
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/produits`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
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

  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: data.length,
      },
    },
  })

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      )}
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Rechercher un produit..."
            value={(table.getColumn("nom")?.getFilterValue()) ?? ""}
            onChange={(event) =>
              table.getColumn("nom")?.setFilterValue(event.target.value)
            }
            className="w-[80%] h-14"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colonnes <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-lg font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.original._id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={`${row.original._id}-${cell.id}`} className="text-base font-medium">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                    <TableCell className='flex gap-4'>
                      {/* cellule ajouter */}
                      <Modifier data={row.original} onUpdate={fetchData}/>
                      <AlertDialogDemo id={row.original._id} onUpdate={fetchData} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-base">
                    Aucun résultat.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
