import { useEffect, useState } from 'react';
import MetricsCards from './components/MetricsCards';
import TopProductsChart from './components/TopProductsChart';
import StoreTable from './components/StoreTable';
import { getMetrics, getTopProducts, getStorePerformance } from './services/api';
import type { Metrics, TopProduct, StorePerformance } from './types';
import './App.css';

function App() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [stores, setStores] = useState<StorePerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [metricsData, productsData, storesData] = await Promise.all([
          getMetrics(),
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

    fetchData();
  }, []);

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

      <main className="app-main">
        <MetricsCards metrics={metrics} loading={loading} />
        
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
