import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api";
import { Promotion } from "@/app/promotions/page";

export const promotionsService = {
  getAllPromotions: async () => {
    const response = await axiosInstance.get(
      `finance-admin${API_ENDPOINTS.PROMOTIONS}`
    );
    return response.data;
  },

  createPromotion: async (promotion: Omit<Promotion, "id">) => {
    const response = await axiosInstance.post(
      `finance-admin${API_ENDPOINTS.PROMOTIONS}`,
      promotion
    );
    return response.data;
  },

  updatePromotion: async (id: string, promotion: Partial<Promotion>) => {
    const response = await axiosInstance.put(
      `${API_ENDPOINTS.PROMOTIONS}/${id}`,
      promotion
    );
    return response.data;
  },

  // deletePromotion: async (id: string) => {
  //     const response = await axiosInstance.delete(`${API_ENDPOINTS.PROMOTIONS}/${id}`);
  //     return response.data;
  // },

  // togglePromotionStatus: async (id: string, status: 'active' | 'inactive') => {
  //     const response = await axiosInstance.patch(`${API_ENDPOINTS.PROMOTIONS}/${id}/status`, { status });
  //     return response.data;
  // }
};
