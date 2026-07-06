import prisma from "../config/db";

export default class DashboardRepository {
  getStats = async () => {};

  getRevenueOverTime = async (startDate: Date, endDate: Date) => {};

  getTopProducts = async (limit: number) => {};

  getOrderStatusBreakdown = async () => {};

  getRecentOrders = async (limit: number) => {};
}
