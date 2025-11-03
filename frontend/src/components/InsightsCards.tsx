import type { Metrics, StorePerformance, TopProduct } from '../types';

interface Props {
  metrics: Metrics | null;
  stores: StorePerformance[];
  products: TopProduct[];
}

const InsightsCards = ({ metrics, stores, products }: Props) => {
  if (!metrics || stores.length === 0) return null;

  const avgStoreRevenue = stores.reduce((sum, s) => sum + parseFloat(s.total_revenue), 0) / stores.length;
  const topStore = stores[0];
  const lowPerformingStores = stores.filter(s => parseFloat(s.total_revenue) < avgStoreRevenue * 0.7);
  const topProduct = products[0];

  const insights = [
    {
      icon: '🏆',
      title: 'Loja Destaque',
      message: `${topStore.store_name} lidera com R$ ${parseFloat(topStore.total_revenue).toLocaleString('pt-BR')}`,
      action: 'Analisar estratégia desta loja',
      type: 'success'
    },
    {
      icon: '⚠️',
      title: 'Atenção Necessária',
      message: `${lowPerformingStores.length} lojas estão abaixo de 70% da média`,
      action: 'Investigar motivos e planos de ação',
      type: 'warning'
    },
    {
      icon: '📈',
      title: 'Produto Campeão',
      message: `${topProduct.product_name} gerou R$ ${parseFloat(topProduct.total_revenue).toLocaleString('pt-BR')}`,
      action: 'Considerar destaque no cardápio',
      type: 'info'
    },
    {
      icon: '💰',
      title: 'Ticket Médio',
      message: `R$ ${metrics.averageTicket.toFixed(2)} por venda`,
      action: metrics.averageTicket < 100 ? 'Estratégias de upsell recomendadas' : 'Ticket acima da média do setor',
      type: metrics.averageTicket < 100 ? 'warning' : 'success'
    }
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>💡 Insights Acionáveis</h2>
      <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
        Análises automáticas para tomada de decisão
      </p>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {insights.map((insight, idx) => (
          <div 
            key={idx}
            style={{
              background: 'var(--color-surface)',
              padding: '1.5rem',
              borderRadius: '12px',
              borderLeft: `4px solid ${
                insight.type === 'success' ? 'var(--color-success)' :
                insight.type === 'warning' ? 'var(--color-warning)' :
                'var(--color-info)'
              }`,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              cursor: 'default'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{insight.icon}</div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>
              {insight.title}
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
              {insight.message}
            </p>
            <div style={{ 
              fontSize: '0.85rem', 
              color: 'var(--color-primary)',
              fontWeight: '500'
            }}>
              ▸ {insight.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsCards;
