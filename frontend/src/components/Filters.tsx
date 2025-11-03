import { useState, useEffect } from 'react';

interface Store {
  id: number;
  name: string;
  city: string;
}

interface Channel {
  id: number;
  name: string;
}

interface FiltersProps {
  onApplyFilters: (filters: { storeId: string; channelId: string; days: string }) => void;
}

const Filters = ({ onApplyFilters }: FiltersProps) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [storeId, setStoreId] = useState('all');
  const [channelId, setChannelId] = useState('all');
  const [days, setDays] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [storesRes, channelsRes] = await Promise.all([
        fetch('http://localhost:3001/api/analysis/stores'),
        fetch('http://localhost:3001/api/analysis/channels')
      ]);

      const storesData = await storesRes.json();
      const channelsData = await channelsRes.json();

      console.log('Stores data:', storesData);
      console.log('Channels data:', channelsData);

      setStores(Array.isArray(storesData) ? storesData : []);
      setChannels(Array.isArray(channelsData) ? channelsData : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching filter options:', error);
      setLoading(false);
    }
  };

  const handleApply = () => {
    onApplyFilters({ storeId, channelId, days });
  };

  const handleReset = () => {
    setStoreId('all');
    setChannelId('all');
    setDays('all');
    onApplyFilters({ storeId: 'all', channelId: 'all', days: 'all' });
  };

  if (loading) return <div>Carregando filtros...</div>;

  return (
    <div style={{
      background: 'var(--color-surface)',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>🔍 Filtros</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
            Loja
          </label>
          <select 
            value={storeId} 
            onChange={(e) => setStoreId(e.target.value)}
            className="form-control"
          >
            <option value="all">Todas as lojas</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>
                {store.name} - {store.city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
            Canal
          </label>
          <select 
            value={channelId} 
            onChange={(e) => setChannelId(e.target.value)}
            className="form-control"
          >
            <option value="all">Todos os canais</option>
            {channels.map(channel => (
              <option key={channel.id} value={channel.id}>
                {channel.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
            Período
          </label>
          <select 
            value={days} 
            onChange={(e) => setDays(e.target.value)}
            className="form-control"
          >
            <option value="all">Todo o período</option>
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          onClick={handleApply}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          Aplicar Filtros
        </button>

        <button 
          onClick={handleReset}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  );
};

export default Filters;
