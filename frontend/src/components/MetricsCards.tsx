import { TrendingUp, DollarSign, ShoppingCart, Store, Package, Users } from 'lucide-react';
import type { Metrics } from '../types';

interface Props {
  metrics: Metrics | null;
  loading: boolean;
}

const MetricsCards = ({ metrics, loading }: Props) => {
  if (loading) {
    return <div className="metrics-grid"><div>Loading...</div></div>;
  }

  if (!metrics) return null;

  const cards = [
    {
      title: 'Total Sales',
      value: metrics.totalSales.toLocaleString(),
      icon: ShoppingCart,
      color: '#3b82f6',
    },
    {
      title: 'Total Revenue',
      value: `R$ ${(metrics.totalRevenue / 1000000).toFixed(2)}M`,
      icon: DollarSign,
      color: '#10b981',
    },
    {
      title: 'Average Ticket',
      value: `R$ ${metrics.averageTicket.toFixed(2)}`,
      icon: TrendingUp,
      color: '#8b5cf6',
    },
    {
      title: 'Stores',
      value: metrics.totalStores.toString(),
      icon: Store,
      color: '#f59e0b',
    },
    {
      title: 'Products',
      value: metrics.totalProducts.toString(),
      icon: Package,
      color: '#ef4444',
    },
    {
      title: 'Customers',
      value: metrics.totalCustomers.toLocaleString(),
      icon: Users,
      color: '#06b6d4',
    },
  ];

  return (
    <div className="metrics-grid">
      {cards.map((card) => (
        <div key={card.title} className="metric-card">
          <div className="metric-icon" style={{ backgroundColor: `${card.color}20` }}>
            <card.icon size={24} color={card.color} />
          </div>
          <div className="metric-content">
            <div className="metric-title">{card.title}</div>
            <div className="metric-value">{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;
