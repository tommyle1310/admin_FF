'use client'
import React, { useEffect, useState } from 'react'
import { Eye, Pencil, Power, Trash } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button" 
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { TableHeader, TableBody, Table, TableRow, TableCell, TableHead } from '@/components/ui/table'
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
import { promotionsService } from '@/services/promotionsService'

export type Promotion = {
  id: string
  name: string
  cost: number
  startDate: Date
  endDate: Date
  status: 'active' | 'inactive'
}

const data: Promotion[] = [
  {
    id: "m5gr84i9",
    name: "Summer Special",
    cost: 299.99,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    status: 'active'
  },
]

export const columns: ColumnDef<Promotion>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Promotion Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className='text-center'>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "cost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("cost"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className=" font-medium text-center">{formatted}</div>
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const timestamp = row.getValue("startDate") as number
      const date = new Date(timestamp * 1000)
      return <div className='text-center'>{date.toLocaleDateString('en-GB')}</div>
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const timestamp = row.getValue("endDate") as number
      const date = new Date(timestamp * 1000)
      return <div className='text-center'>{date.toLocaleDateString('en-GB')}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button variant={'ghost'} className='text-center' >
          Actions
        </Button>
      )
    },
    cell: ({ row }) => {
      const promotion = row.original

      return (
        <Popover >
          <PopoverTrigger asChild className='  '>
            <Button variant="ghost" className="h-8 w-full p-0 text-center ">
              {/* <span className="sr-only">Open menu</span> */}
              <MoreHorizontal className="h-4 w-4 " />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32">
            <div className="grid gap-4">
              <Button
                variant="ghost"
                className="flex items-center justify-start"
                onClick={() => {
                  // Handle details action
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Details
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-start"
                onClick={() => {
                  // Handle inactivate action
                }}
              >
                <Power className="mr-2 h-4 w-4" />
                Inactivate
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-start"
                onClick={() => {
                  // Handle edit action
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-start text-destructive"
                onClick={() => {
                  // Handle delete action
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )
    },
  },
]

const page = () => {
    const [listPromotions, setListPromotions] = useState<Promotion[]>([])
    const table = useReactTable({
        data: listPromotions ,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    useEffect(() => {
     const result = promotionsService.getAllPromotions()
     result.then((res) => {
      setListPromotions(res.data.map((item: any) => ({
        id: item._id,
        name: item.name,
        cost: item.promotion_cost_price,
        startDate: item.start_date,
        endDate: item.end_date,
        status: item.status
     })))
     }).catch((err) => {
      // console.log('check err', err)
      setListPromotions(data)
     })
    }, [])

    
    console.log('check list promotions', listPromotions)
    return (
        <div>
            <div className="w-full">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
        </div>
    )
}

export default page
