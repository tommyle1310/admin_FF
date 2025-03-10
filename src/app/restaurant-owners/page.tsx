'use client'
import React, { useEffect, useState } from 'react';
import { Eye, Pencil, Power, Trash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { TableHeader, TableBody, Table, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { restaurantService } from '@/services/restaurantService';

interface Restaurant {
  id: string;
  name: string;
  owner: string;
  status: string;
  address: string;
}

export const columns: ColumnDef<Restaurant>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    header: ({ column }) => (
      <Button className='text-center' variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Restaurant Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "owner",
    header: ({ column }) => (
      <Button className='text-center' variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Owner
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue("owner")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button className='text-center bg-slate-300' variant="ghost">
        Status
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="text-center">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${status === 'active' ? 'bg-green-100 text-green-800' : 
            status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'}`}>
            {status}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const restaurant = row.original;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-8 w-full p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32">
            <div className="grid gap-4">
              <Button
                variant="ghost"
                className="flex items-center justify-start"
                onClick={() => {
                  // Handle view details
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Details
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-start"
                // onClick={() => handleStatusChange(restaurant.id, restaurant.status === 'active' ? 'inactive' : 'active')}
              >
                <Power className="mr-2 h-4 w-4" />
                {restaurant.status === 'active' ? 'Deactivate' : 'Activate'}
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-start text-destructive"
                // onClick={() => handleDeleteRestaurant(restaurant.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      );
    },
  },
];

const Page = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [stats, setStats] = useState({
    total: 1,
    active: 1,
    ban: 0
  });

  useEffect(() => {
    const result = restaurantService.getAllRestaurants()
     result.then((res) => {
      setRestaurants(res.data.map((item: any) => ({
        id: item._id,
        name: item.restaurant_name,
        owner: item.owner_name,
        status: item.status.is_active ? 'active' : 'inactive',
        address: item.address
      })))
     }).catch((err) => {
      console.log('check err', err)
      setRestaurants([])
     })
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantService.getAllRestaurants();
      setRestaurants(response.data);
      // Update stats here if needed
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setRestaurants([]);
    }
  };

  // const handleStatusChange = async (id: string, newStatus: string) => {
  //   try {
  //     await restaurantService.updateRestaurant(id, { status: newStatus });
  //     fetchRestaurants(); // Refresh the list
  //   } catch (error) {
  //     console.error('Error updating restaurant status:', error);
  //   }
  // };

  // const handleDeleteRestaurant = async (id: string) => {
  //   if (window.confirm('Are you sure you want to delete this restaurant?')) {
  //     try {
  //       await restaurantService.deleteRestaurant(id);
  //       fetchRestaurants(); // Refresh the list
  //     } catch (error) {
  //       console.error('Error deleting restaurant:', error);
  //     }
  //   }
  // };

  const table = useReactTable({
    data: restaurants,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant Owners Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Restaurants</h2>
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Active Restaurants</h2>
          <div className="text-3xl font-bold text-green-600">{stats.active}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Banned</h2>
          <div className="text-3xl font-bold text-yellow-600">{stats.ban}</div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Restaurant List</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;
