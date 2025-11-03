import type { StorePerformance } from '../types';

interface Props {
  stores: StorePerformance[];
}

const StoreTable = ({ stores }: Props) => {
  const topStores = stores.slice(0, 10);

  return (
    <div className="table-container">
      <h2>Top 10 Stores Performance</h2>
      <table className="performance-table">
        <thead>
          <tr>
            <th>Store</th>
            <th>City</th>
            <th>Sales</th>
            <th>Revenue</th>
            <th>Avg Ticket</th>
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
