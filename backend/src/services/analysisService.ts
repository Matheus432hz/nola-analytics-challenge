import pool from '../config/database';

// Top produtos mais vendidos
export const getTopProducts = async (limit: number = 10) => {
  const query = `
    SELECT 
      p.id,
      p.name as product_name,
      COUNT(ps.id) as times_sold,
      SUM(ps.quantity) as total_quantity,
      SUM(ps.total_price) as total_revenue
    FROM products p
    INNER JOIN product_sales ps ON ps.product_id = p.id
    INNER JOIN sales s ON s.id = ps.sale_id
    WHERE s.sale_status_desc = 'COMPLETED'
    GROUP BY p.id, p.name
    ORDER BY total_revenue DESC
    LIMIT $1
  `;

  const result = await pool.query(query, [limit]);
  return result.rows;
};


// Performance por loja
export const getStorePerformance = async () => {
  const query = `
    SELECT 
      st.id as store_id,
      st.name as store_name,
      st.city,
      COUNT(s.id) as total_sales,
      SUM(s.total_amount) as total_revenue,
      AVG(s.total_amount) as average_ticket,
      COUNT(DISTINCT s.customer_id) as unique_customers
    FROM stores st
    LEFT JOIN sales s ON s.store_id = st.id AND s.sale_status_desc = 'COMPLETED'
    GROUP BY st.id, st.name, st.city
    ORDER BY total_revenue DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

// Vendas por canal
export const getSalesByChannel = async () => {
  const query = `
    SELECT 
      c.id as channel_id,
      c.name as channel_name,
      COUNT(s.id) as total_sales,
      SUM(s.total_amount) as total_revenue,
      AVG(s.total_amount) as average_ticket
    FROM channels c
    LEFT JOIN sales s ON s.channel_id = c.id AND s.sale_status_desc = 'COMPLETED'
    GROUP BY c.id, c.name
    ORDER BY total_revenue DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

// Vendas por período (dia da semana / hora)
export const getSalesByTime = async () => {
  const query = `
    SELECT 
      EXTRACT(DOW FROM created_at) as day_of_week,
      EXTRACT(HOUR FROM created_at) as hour_of_day,
      COUNT(*) as total_sales,
      SUM(total_amount) as total_revenue,
      AVG(total_amount) as average_ticket
    FROM sales
    WHERE sale_status_desc = 'COMPLETED'
    GROUP BY day_of_week, hour_of_day
    ORDER BY day_of_week, hour_of_day
  `;

  const result = await pool.query(query);
  return result.rows;
};

// Clientes inativos (sem compra há mais de 30 dias)
export const getInactiveCustomers = async (daysInactive: number = 30) => {
  const query = `
    SELECT 
      c.id,
      c.name,
      c.email,
      c.phone,
      MAX(s.created_at) as last_purchase_date,
      NOW() - MAX(s.created_at) as days_since_last_purchase,
      COUNT(s.id) as total_purchases,
      SUM(s.total_amount) as lifetime_value
    FROM customers c
    INNER JOIN sales s ON s.customer_id = c.id
    WHERE s.sale_status_desc = 'COMPLETED'
    GROUP BY c.id, c.name, c.email, c.phone
    HAVING MAX(s.created_at) < NOW() - INTERVAL '${daysInactive} days'
    ORDER BY lifetime_value DESC
    LIMIT 100
  `;

  const result = await pool.query(query);
  return result.rows;
};
