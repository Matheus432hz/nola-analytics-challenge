import pool from '../config/database';

export interface QueryFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'between';
  value: any;
}

export interface QueryRequest {
  table: string;
  fields?: string[];
  filters?: QueryFilter[];
  groupBy?: string[];
  orderBy?: { field: string; direction: 'ASC' | 'DESC' }[];
  limit?: number;
  offset?: number;
}

const allowedTables = [
  'sales', 'stores', 'products', 'customers', 'channels',
  'product_sales', 'brands', 'sub_brands', 'categories'
];

const buildWhereClause = (filters: QueryFilter[]): { sql: string; values: any[] } => {
  if (!filters || filters.length === 0) {
    return { sql: '', values: [] };
  }

  const conditions: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  filters.forEach((filter) => {
    const { field, operator, value } = filter;

    switch (operator) {
      case 'eq':
        conditions.push(`${field} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
        break;
      case 'ne':
        conditions.push(`${field} != $${paramIndex}`);
        values.push(value);
        paramIndex++;
        break;
      case 'gt':
        conditions.push(`${field} > $${paramIndex}`);
        values.push(value);
        paramIndex++;
        break;
      case 'gte':
        conditions.push(`${field} >= $${paramIndex}`);
        values.push(value);
        paramIndex++;
        break;
      case 'lt':
        conditions.push(`${field} < $${paramIndex}`);
        values.push(value);
        paramIndex++;
        break;
      case 'lte':
        conditions.push(`${field} <= $${paramIndex}`);
        values.push(value);
        paramIndex++;
        break;
      case 'like':
        conditions.push(`${field} ILIKE $${paramIndex}`);
        values.push(`%${value}%`);
        paramIndex++;
        break;
      case 'in':
        if (Array.isArray(value)) {
          const placeholders = value.map((_, i) => `$${paramIndex + i}`).join(', ');
          conditions.push(`${field} IN (${placeholders})`);
          values.push(...value);
          paramIndex += value.length;
        }
        break;
      case 'between':
        if (Array.isArray(value) && value.length === 2) {
          conditions.push(`${field} BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
          values.push(value[0], value[1]);
          paramIndex += 2;
        }
        break;
    }
  });

  return {
    sql: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    values,
  };
};

export const executeQuery = async (queryReq: QueryRequest) => {
  // Validação de segurança
  if (!allowedTables.includes(queryReq.table)) {
    throw new Error(`Table '${queryReq.table}' is not allowed`);
  }

  // SELECT clause
  const fields = queryReq.fields && queryReq.fields.length > 0
    ? queryReq.fields.join(', ')
    : '*';

  // WHERE clause
  const { sql: whereClause, values } = buildWhereClause(queryReq.filters || []);

  // GROUP BY clause
  const groupByClause = queryReq.groupBy && queryReq.groupBy.length > 0
    ? `GROUP BY ${queryReq.groupBy.join(', ')}`
    : '';

  // ORDER BY clause
  const orderByClause = queryReq.orderBy && queryReq.orderBy.length > 0
    ? `ORDER BY ${queryReq.orderBy.map(o => `${o.field} ${o.direction}`).join(', ')}`
    : '';

  // LIMIT/OFFSET
  const limit = queryReq.limit || 100;
  const offset = queryReq.offset || 0;
  const limitClause = `LIMIT ${limit} OFFSET ${offset}`;

  // Construir query final
  const query = `
    SELECT ${fields}
    FROM ${queryReq.table}
    ${whereClause}
    ${groupByClause}
    ${orderByClause}
    ${limitClause}
  `.trim();

  console.log('Executing query:', query);
  console.log('With values:', values);

  const result = await pool.query(query, values);

  return {
    data: result.rows,
    count: result.rowCount,
    query: query, // Para debug
  };
};
