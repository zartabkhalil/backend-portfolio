export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface TopProduct {
  id: number;
  title: string;
  totalSold: number;
  revenue: number;
}

export interface OrderStatusBreakdown {
  status: string;
  count: number;
}

export interface DashboardQuery {
  startDate?: string;
  endDate?: string;
}
