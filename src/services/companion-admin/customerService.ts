import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api";

export const customerService = {
  getAllCustomers: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CUSTOMERS);
      // API might return { data: [customers] } or just [customers]
      const data = response.data;
      return Array.isArray(data) ? data : data.data || [];
    } catch (error: any) {
      console.error("Error fetching customers:", error.message);
      return [];
    }
  },
  createCustomer: async () => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.CUSTOMERS, {
        /* customer data */
      });
      return response.data;
    } catch (error: any) {
      console.error("Error creating customer:", error.message);
      return null;
    }
  },
  updateCustomerStatus: async (customerId: string, newStatus: boolean) => {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.CUSTOMERS}/${customerId}/status`,
        { isActive: newStatus }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating customer status:", error.message);
      return null;
    }
  },
};