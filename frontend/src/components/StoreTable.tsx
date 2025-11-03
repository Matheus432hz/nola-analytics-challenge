import { useState } from 'react';
import type { StorePerformance } from '../types';

interface Props {
  stores: StorePerformance[];
}

type SortField = 'store_name' | 'total_sales' | 'total_revenue' | 'average_ticket';
type SortDirection = 'asc' | 'desc';

const StoreTable = ({ stores }: Props) => {
  const [sortField, setSortField] = useState<SortField>('total_revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedStores = [...stores].sort((a, b) => {
    let aVal: number | string = 0;
    let bVal: number | string = 0;

    switch (sortField) {
      case 'store_name':
        aVal = a.store_name;
        bVal = b.store_name;
        break;
      case 'total_sales':
        aVal = parseInt(a.total_sales);
        bVal = parseInt(b.total_sales);
        break;
      case 'total_revenue':
        aVal = parseFloat(a.total_revenue);
        bVal = parseFloat(b.total_revenue);
        break;
      case 'average_ticket':
        aVal = parseFloat(a.average_ticket);
        bVal = parseFloat(b.average_ticket);
        break;
    }

    if (typeof aVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal);
    }

    return sortDirection === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
  });

  const topStores = sortedStores.slice(0, 10);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return ' ↕️';
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="table-container">
      <h2>Top 10 Stores Performance</h2>
      <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
        Clique nos cabeçalhos para ordenar
      </p>
      <table className="performance-table">
        <thead>
          <tr>
            <th 
              onClick={() => handleSort('store_name')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              Store{getSortIcon('store_name')}
            </th>
            <th>City</th>
            <th 
              onClick={() => handleSort('total_sales')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              Sales{getSortIcon('total_sales')}
            </th>
            <th 
              onClick={() => handleSort('total_revenue')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              Revenue{getSortIcon('total_revenue')}
            </th>
            <th 
              onClick={() => handleSort('average_ticket')}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              Avg Ticket{getSortIcon('average_ticket')}
            </th>
            <th>Customers</th>
          </tr>
        </thead>
        <tbody>
          {topStores.map((store) => (
            <tr key={store.store_id}>
              <td>{store.store_name}</td>
              <td>{store.city}</td>
              <td>{parseInt(store.total_sales).toLocaleString()}</td>
              <td>R$ {parseFloat(store.total_revenue).toLocaleString()}</td>
              <td>R$ {parseFloat(store.average_ticket).toFixed(2)}</td>
              <td>{store.unique_customers}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreTable;
