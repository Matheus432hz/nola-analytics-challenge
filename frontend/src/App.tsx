import { useEffect, useState } from 'react';
import MetricsCards from './components/MetricsCards';
import TopProductsChart from './components/TopProductsChart';
import StoreTable from './components/StoreTable';
import InsightsCards from './components/InsightsCards';
import Filters from './components/Filters';
import { getMetrics, getTopProducts, getStorePerformance } from './services/api';
import type { Metrics, TopProduct, StorePerformance } from './types';
import './App.css';

function App() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [stores, setStores] = useState<StorePerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ storeId: 'all', channelId: 'all', days: 'all' });
  const [error, setError] = useState<string | null>(null);

  // Fetch inicial
  useEffect(() => {
    fetchData();
  }, []);

  // Refetch quando filtros mudarem
  useEffect(() => {
    if (filters.storeId !== 'all' || filters.channelId !== 'all' || filters.days !== 'all') {
      fetchData();
    }
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [metricsData, productsData, storesData] = await Promise.all([
        getMetrics(filters),
        getTopProducts(10),
        getStorePerformance(),
      ]);
      setMetrics(metricsData);
      setProducts(productsData);
      setStores(storesData);
    } catch (err) {
      setError('Failed to fetch data. Make sure the backend is running on port 3001.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (newFilters: { storeId: string; channelId: string; days: string }) => {
    setFilters(newFilters);
  };

  if (error) {
    return (
      <div className="error-container">
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍕 Nola Analytics Dashboard</h1>
        <p>Real-time sales insights and performance metrics</p>
      </header>

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '1rem 2rem 0',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem'
      }}>
        <button 
          onClick={() => window.location.reload()}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#2563eb')}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#3b82f6')}
        >
          🔄 {loading ? 'Atualizando...' : 'Atualizar Dados'}
        </button>
      </div>

      <main className="app-main">
        <Filters onApplyFilters={handleApplyFilters} />
        
        <MetricsCards metrics={metrics} loading={loading} />
  
        {!loading && stores.length > 0 && (
          <InsightsCards 
            metrics={metrics} 
            stores={stores} 
            products={products}
          />
        )}
  
        {!loading && products.length > 0 && (
          <TopProductsChart products={products} />
        )}

        {!loading && stores.length > 0 && (
          <StoreTable stores={stores} />
        )}
      </main>
    </div>
  );
}

export default App;
