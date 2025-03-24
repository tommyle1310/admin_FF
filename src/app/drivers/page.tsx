"use client";
import { IMAGE_LINKS } from "@/assets/imageLinks";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Driver,
  driverService,
} from "@/services/companion-admin/driverService";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export const columns: ColumnDef<Driver>[] = [
  {
    accessorKey: "email",
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
      const driver = row.original;
      console.log("check", driver?.contact_email?.[0]?.email )
      return (
        <div className="flex flex-row items-center gap-2">
          <Image
            src={driver?.avatar?.url ?? IMAGE_LINKS.DEFAULT_AVATAR}
            alt="avatar"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span>{driver?.contact_email?.[0]?.email ?? ""}</span>
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
        Driver Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const driver = row.original;
      return (
        <div className="text-center">
          {driver.first_name} {driver.last_name}
        </div>
      );
    },
  },
  {
    accessorKey: "available_for_work",
    header: ({ column }) => (
      <Button
        className="text-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Availability
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("available_for_work") ? "Available" : "Unavailable"}
      </div>
    ),
  },
  {
    accessorKey: "active_points",
    header: ({ column }) => (
      <Button
        className="text-center"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Active Points
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("active_points")}</div>
    ),
  },
];

const Page = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    ban: 0,
  });

  useEffect(() => {
    const result = driverService.getAllDrivers();
    setIsLoading(true);
    result
      .then((res) => {
        setDrivers(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const totalCount = drivers.length;
    const activeCount = drivers.filter((d) => d.available_for_work).length;
    const bannedCount = drivers.filter((d) => !d.available_for_work).length;

    setStats({
      total: totalCount,
      active: activeCount,
      ban: bannedCount,
    });
  }, [drivers]);

  const table = useReactTable({
    data: drivers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleGenerateDriver = async () => {
    setIsLoading(true);
    const result = await driverService.createDriver();
    setIsLoading(false);
    if (result.EC === 0) {
      fetchDrivers();
    }
  };

  const fetchDrivers = async () => {
    const result = driverService.getAllDrivers();
    result
      .then((res) => {
        const responseData = res.data;
        const buildData = responseData.map((item: Driver ) => ({
          id: item.id,
          first_name: item.first_name,
          active_points: item.active_points,
          last_name: item.last_name,
          rating: { 
            review_count: item.rating.review_count, 
            average_rating: item.rating.average_rating 
          },
          avatar: {
            url: item.avatar?.url,
            key: item.avatar?.key
          },
          vehicle: {
            color: item.vehicle.color,
            model: item.vehicle.model,
            license_plate: item.vehicle.license_plate,
          },
          available_for_work: item.available_for_work,
          address: '',
          contact_email: [{
            email: item?.contact_email?.[0]?.email ?? ''
          }]
        }))
        const {EC, EM, data} = res.data
        setDrivers(buildData);
      })
      .catch((err) => {
        console.log("check err", err);
        setDrivers([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="p-4">
      <Spinner isVisible={isLoading} isOverlay />
      <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Drivers</h2>
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Active Drivers</h2>
          <div className="text-3xl font-bold text-green-600">{stats.active}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Banned Drivers</h2>
          <div className="text-3xl font-bold text-red-600">{stats.ban}</div>
        </div>
      </div>

      <div className="mt-8">
        <div className="justify-between flex items-center">
          <h2 className="text-xl font-semibold mb-4">Driver List</h2>
          <Button onClick={handleGenerateDriver}>Generate Driver</Button>
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

