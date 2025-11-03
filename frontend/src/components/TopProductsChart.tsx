import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TopProduct } from '../types';

interface Props {
  products: TopProduct[];
}

const TopProductsChart = ({ products }: Props) => {
  const data = products.map((p) => ({
    name: p.product_name.length > 20 ? p.product_name.slice(0, 20) + '...' : p.product_name,
    revenue: parseFloat(p.total_revenue),
  }));

  return (
    <div className="chart-container">
      <h2>Top 10 Products by Revenue</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
          <YAxis />
          <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString()}`} />
          <Bar dataKey="revenue" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductsChart;
