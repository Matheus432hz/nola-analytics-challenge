import pool from '../config/database';

export interface GeneralMetrics {
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  totalStores: number;
  totalProducts: number;
  totalCustomers: number;
}

export const getGeneralMetrics = async (): Promise<GeneralMetrics> => {
  const query = `
    SELECT 
      COUNT(DISTINCT s.id) as total_sales,
      COALESCE(SUM(s.total_amount), 0) as total_revenue,
      COALESCE(AVG(s.total_amount), 0) as average_ticket,
      COUNT(DISTINCT s.store_id) as total_stores,
      COUNT(DISTINCT ps.product_id) as total_products,
      COUNT(DISTINCT s.customer_id) as total_customers
    FROM sales s
    LEFT JOIN product_sales ps ON ps.sale_id = s.id
    WHERE s.sale_status_desc = 'COMPLETED'
  `;

  const result = await pool.query(query);
  const row = result.rows[0];

  return {
    totalSales: parseInt(row.total_sales),
    totalRevenue: parseFloat(row.total_revenue),
    averageTicket: parseFloat(row.average_ticket),
    totalStores: parseInt(row.total_stores),
    totalProducts: parseInt(row.total_products),
    totalCustomers: parseInt(row.total_customers),
  };
};
