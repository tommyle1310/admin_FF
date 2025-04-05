"use client";
import React, { useEffect, useState } from "react";
import { Eye, Power, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  TableHeader,
  TableBody,
  Table,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { customerService } from "@/services/companion-admin/customerService";
import { Spinner } from "@/components/Spinner";
import Image from "next/image";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: { city: string; street: string }[];
  avatar: { url: string; key: string };
  user: {
    email: string;
  };
  isActive: boolean;
}

const Page = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    ban: 0,
  });

  useEffect(() => {
    setIsLoading(true);
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const result = await customerService.getAllCustomers();
    if (result) {
      setCustomers(result);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const totalCount = customers.length;
    const activeCount = customers.filter((c) => c.isActive).length;
    const bannedCount = customers.filter((c) => !c.isActive).length;

    setStats({
      total: totalCount,
      active: activeCount,
      ban: bannedCount,
    });
  }, [customers]);

  const handleGenerateCustomer = async () => {
    setIsLoading(true);
    const result = await customerService.createCustomer();
    setIsLoading(false);
    if (result && result.EC === 0) {
      fetchCustomers();
    }
  };

  const handleStatusChange = async (customerId: string, newStatus: boolean) => {
    setIsLoading(true);
    const result = await customerService.updateCustomerStatus(
      customerId,
      newStatus
    );
    setIsLoading(false);
    if (result && result.EC === 0) {
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.id === customerId
            ? { ...customer, isActive: newStatus }
            : customer
        )
      );
    }
  };

  const columns: ColumnDef<Customer>[] = [
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
      accessorKey: "user.email",
      header: ({ column }) => (
        <Button
          className="text-center"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="flex flex-row items-center gap-2">
            <Image
              src={customer?.avatar?.url}
              alt="avatar"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full"
            />
            <span>{customer?.user?.email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          className="text-center"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="text-center">
            {customer.first_name} {customer.last_name}
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <Button
          className="text-center"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <div className="text-center">
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
              ${
                isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
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
        const customer = row.original;
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
                  onClick={() =>
                    handleStatusChange(customer.id, !customer.isActive)
                  }
                >
                  <Power className="mr-2 h-4 w-4" />
                  {customer.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center justify-start text-destructive"
                  // onClick={() => handleDeleteCustomer(customer.id)}
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

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <Spinner isVisible={isLoading} isOverlay />
      <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Customers</h2>
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Active Customers</h2>
          <div className="text-3xl font-bold text-green-600">
            {stats.active}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Banned Customers</h2>
          <div className="text-3xl font-bold text-red-600">{stats.ban}</div>
        </div>
      </div>

      <div className="mt-8">
        <div className="justify-between flex items-center">
          <h2 className="text-xl font-semibold mb-4">Customer List</h2>
          <Button onClick={handleGenerateCustomer}>Generate Customer</Button>
        </div>
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
  );
};

export default Page;
