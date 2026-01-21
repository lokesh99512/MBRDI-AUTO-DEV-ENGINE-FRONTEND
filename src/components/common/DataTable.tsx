import { Table, Form, Pagination, Card } from 'react-bootstrap';
import { ReactNode, useState } from 'react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  actions?: (item: T) => ReactNode;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

function DataTable<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  pagination,
  actions,
  onRowClick,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const getValue = (item: T, key: string): any => {
    return key.split('.').reduce((obj: any, k) => obj?.[k], item);
  };

  const sortedData = sortConfig
    ? [...data].sort((a, b) => {
        const aVal = getValue(a, sortConfig.key);
        const bVal = getValue(b, sortConfig.key);
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : data;

  return (
    <Card className="shadow-sm border-0">
      <div className="table-responsive">
        <Table hover className="mb-0">
          <thead className="bg-light">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={col.sortable ? 'cursor-pointer user-select-none' : ''}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                  style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                >
                  {col.label}
                  {col.sortable && sortConfig?.key === col.key && (
                    <i
                      className={`bi bi-chevron-${
                        sortConfig.direction === 'asc' ? 'up' : 'down'
                      } ms-1`}
                    ></i>
                  )}
                </th>
              ))}
              {actions && <th className="text-end">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary me-2" />
                  Loading...
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-4 text-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)}>
                      {col.render ? col.render(item) : String(getValue(item, String(col.key)) ?? '')}
                    </td>
                  ))}
                  {actions && (
                    <td className="text-end" onClick={(e) => e.stopPropagation()}>
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <Card.Footer className="bg-white">
          <Pagination className="mb-0 justify-content-end">
            <Pagination.First
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            />
            {[...Array(pagination.totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={pagination.currentPage === i + 1}
                onClick={() => pagination.onPageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            />
            <Pagination.Last
              onClick={() => pagination.onPageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
            />
          </Pagination>
        </Card.Footer>
      )}
    </Card>
  );
}

export default DataTable;
