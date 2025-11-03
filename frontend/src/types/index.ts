export interface Metrics {
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  totalStores: number;
  totalProducts: number;
  totalCustomers: number;
}

export interface TopProduct {
  id: number;
  product_name: string;
  times_sold: string;
  total_quantity: string;
  total_revenue: string;
}

export interface StorePerformance {
  store_id: number;
  store_name: string;
  city: string;
  total_sales: string;
  total_revenue: string;
  average_ticket: string;
  unique_customers: string;
}
