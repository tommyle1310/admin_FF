import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api";
// import { Customer } from "@/app/customers/page";

export const driverService = {
  getAllDrivers: async () => {
    const response = await axiosInstance.get(
      `companion-admin${API_ENDPOINTS.DRIVERS}`
    );
    return response.data;
  },

  //   createCustomer: async (customer: Omit<Customer, "id">) => {
  //     const response = await axiosInstance.post(
  //       `finance-admin${API_ENDPOINTS.CUSTOMERS}`,
  //       customer
  //     );
  //     return response.data;
  //   },

  // updatePromotion: async (id: string, promotion: Partial<Promotion>) => {
  //     const response = await axiosInstance.put(`${API_ENDPOINTS.PROMOTIONS}/${id}`, promotion);
  //     return response.data;
  // },

  // deletePromotion: async (id: string) => {
  //     const response = await axiosInstance.delete(`${API_ENDPOINTS.PROMOTIONS}/${id}`);
  //     return response.data;
  // },

  // togglePromotionStatus: async (id: string, status: 'active' | 'inactive') => {
  //     const response = await axiosInstance.patch(`${API_ENDPOINTS.PROMOTIONS}/${id}/status`, { status });
  //     return response.data;
  // }
};
