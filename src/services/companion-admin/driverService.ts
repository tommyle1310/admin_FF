import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api";
// import { Customer } from "@/app/customers/page";

export interface Driver {
  id: string;
  first_name: string;
  active_points: number;
  last_name: string;
  rating: { review_count: number; average_rating: number };
  avatar: {
    url: string;
    key: string;
  };
  vehicle: {
    color: string;
    model: string;
    license_plate: string;
  };
  available_for_work: boolean;
  address: string;
  contact_email: {
    email: string;
  }[];
}
export const driverService = {
  getAllDrivers: async () => {
    const response = await axiosInstance.get(
      `companion-admin${API_ENDPOINTS.DRIVERS}`
    );
    return response.data;
  },

    createDriver: async () => {
      const response = await axiosInstance.post(
        `companion-admin${API_ENDPOINTS.DRIVERS}`
      );
      return response.data;
    },

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
