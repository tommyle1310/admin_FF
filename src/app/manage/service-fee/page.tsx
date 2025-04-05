"use client";
import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/lib/axios";

// Định nghĩa type cho finance rule
interface DriverFixedWage {
  [key: string]: string | number; // JSON với key là range (string) và value có thể là số hoặc công thức (string)
}

interface FinanceRule {
  id: string;
  driver_fixed_wage: DriverFixedWage;
  customer_care_hourly_wage: number;
  app_service_fee: number;
  restaurant_commission: number;
  created_by_id: string;
  description?: string; // Optional vì TEXT có thể null
  created_at: number;
  updated_at?: number; // Optional vì có thể chưa update
}

const page = () => {
  const [rules, setRules] = useState<FinanceRule[]>([]);
  const [selectedRule, setSelectedRule] = useState<FinanceRule | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  // Fetch finance rules từ API
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axiosInstance.get("/finance-rules");
        const { EC, EM, data } = response.data;
        if (EC === 0) {
          setRules(data);
        }
      } catch (error) {
        console.error("Error fetching finance rules:", error);
      }
    };
    fetchRules();
  }, []);

  // Handle mở modal và chọn rule
  const handleEdit = (rule: FinanceRule) => {
    setSelectedRule(rule);
    setOpen(true);
  };

  // Handle submit chỉnh sửa rule
  const handleSave = async () => {
    if (!selectedRule) return;
    try {
      const response = await axiosInstance.patch(
        `/finance-rules/${selectedRule.id}`,
        selectedRule
      );
      const { EC, EM, data } = response.data;
      if (EC === 0) {
        setRules((prev) =>
          prev.map((r) => (r.id === selectedRule.id ? selectedRule : r))
        );
        setOpen(false);
      }
    } catch (error) {
      console.error("Error updating rule:", error);
    }
  };

  // Handle thay đổi giá trị trong form
  const handleChange = (field: keyof FinanceRule, value: string) => {
    setSelectedRule((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  // Handle thay đổi JSON driver_fixed_wage
  const handleDriverWageChange = (range: string, value: string) => {
    setSelectedRule((prev) =>
      prev
        ? {
            ...prev,
            driver_fixed_wage: {
              ...prev.driver_fixed_wage,
              [range]: value,
            },
          }
        : null
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Service Fee Manager</h1>

      {/* Bảng danh sách rules */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell>{rule.description}</TableCell>
              <TableCell>{rule.created_by_id}</TableCell>
              <TableCell>
                {new Date(rule.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => handleEdit(rule)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal chỉnh sửa rule */}
      {selectedRule && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="h-[90vh] w-screen overflow-y-scroll">
            <DialogHeader>
              <DialogTitle>Edit Finance Rule - {selectedRule.id}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Customer Care Hourly Wage */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customer_care" className="text-right">
                  Customer Care Hourly Wage
                </Label>
                <Input
                  id="customer_care"
                  type="number"
                  value={selectedRule.customer_care_hourly_wage}
                  onChange={(e) =>
                    handleChange("customer_care_hourly_wage", e.target.value)
                  }
                  className="col-span-3"
                />
              </div>

              {/* App Service Fee */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="app_fee" className="text-right">
                  App Service Fee
                </Label>
                <Input
                  id="app_fee"
                  type="number"
                  value={selectedRule.app_service_fee}
                  onChange={(e) =>
                    handleChange("app_service_fee", e.target.value)
                  }
                  className="col-span-3"
                />
              </div>

              {/* Restaurant Commission */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="restaurant_commission" className="text-right">
                  Restaurant Commission
                </Label>
                <Input
                  id="restaurant_commission"
                  type="number"
                  value={selectedRule.restaurant_commission}
                  onChange={(e) =>
                    handleChange("restaurant_commission", e.target.value)
                  }
                  className="col-span-3"
                />
              </div>

              {/* Driver Fixed Wage JSON Editor */}
              <div className="grid gap-2">
                <Label>Driver Fixed Wage</Label>
                {Object.entries(selectedRule.driver_fixed_wage).map(
                  ([range, value]) => (
                    <div key={range} className="flex items-center gap-2">
                      <Input value={range} disabled className="w-1/3" />
                      <Input
                        value={value}
                        onChange={(e) =>
                          handleDriverWageChange(range, e.target.value)
                        }
                        className="w-2/3"
                      />
                    </div>
                  )
                )}
              </div>

              {/* Description */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={selectedRule.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default page;
