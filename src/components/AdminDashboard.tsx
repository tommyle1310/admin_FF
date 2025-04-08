"use client";
import React, { useEffect, useState } from "react";
import DashboardListCards from "@/components/Card/DashboardListCards";
import { NetRevenueChart } from "@/components/Chart/Dashboard/NetRevenueChart";
import { UserGrowthRateChart } from "@/components/Chart/Dashboard/UserGrowthRateChart";
import { DashboardTable } from "@/components/DashboardTable";
import PageTitle from "@/components/PageTitle";
import { sampleDashboardListCards } from "@/utils/sample/DashboardListCards";

const AdminDashboard = () => {
  const [date2, setDate2] = useState<Date | undefined>(new Date());
  const [date1, setDate1] = useState<Date | undefined>(() => {
    const date = new Date(); // Create a new Date object for the current date
    date.setMonth(date.getMonth() - 1); // Subtract one month
    return date; // Return the updated Date object
  });
  useEffect(() => {
    if (date2) {
      const newDate1 = new Date(date2);
      newDate1.setMonth(newDate1.getMonth() - 1);
      setDate1(newDate1);
    }
  }, []);
  return (
    <div className="fc">
      <PageTitle
        date1={date1}
        setDate1={setDate1}
        date2={date2}
        setDate2={setDate2}
        isDashboard
      />
      <DashboardListCards data={sampleDashboardListCards} />
      <div className="jb gap-4 max-lg:grid max-lg:grid-cols-1">
        <div className="card lg:flex-1 fc">
          <NetRevenueChart />
        </div>
        <div className="card lg:flex-1 fc">
          <UserGrowthRateChart />
        </div>
      </div>
      <div className="py-6">
        <div className="card fc gap-4">
          <h1 className="text-xl font-bold">Key Performance</h1>
          <DashboardTable />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
