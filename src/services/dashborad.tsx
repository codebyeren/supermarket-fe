import type { DashboardData } from "../types";
import axiosInstance from "./axiosInstance";

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await axiosInstance.get<{ code: number; message: string; data: DashboardData }>("/dashboard");
  return response.data.data;
};