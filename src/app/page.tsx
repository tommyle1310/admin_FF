"use client";
import AdminDashboard from "@/components/AdminDashboard";
import DashboardCustomerCare from "@/components/DashboardCustomerCare";
import { useAdminStore } from "@/stores/adminStore";
import { useCustomerCareStore } from "@/stores/customerCareStore";
import { useState, useEffect } from "react";

export default function Home() {
  const adminLoggedInAs = useAdminStore((state) => state.user?.logged_in_as);
  const customerCareLoggedInAs = useCustomerCareStore(
    (state) => state.user?.logged_in_as
  );
  const loggedInAs = adminLoggedInAs || customerCareLoggedInAs; // Lấy từ store nào có giá trị
  const RenderHomeComponent = () => {
    switch (loggedInAs) {
      case "SUPER_ADMIN":
        return <AdminDashboard />;
      case "FINANCE_ADMIN":
        return <AdminDashboard />;
      case "COMPANION_ADMIN":
        return <AdminDashboard />;
      case "CUSTOMER_CARE_REPRESENTATIVE":
        return <DashboardCustomerCare />;
      default:
        return <AdminDashboard />;
    }
  };

  return <RenderHomeComponent />;
}
