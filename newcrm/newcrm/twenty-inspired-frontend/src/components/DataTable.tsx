import React from 'react';

interface DataTableProps {
  columns: { key: string; header: string; className?: string }[];
  data: Record<string, any>[];
  onRowClick?: (item: any) => void;
  actions?: (item: any) => React.ReactNode;
}

const DataTable = ({ columns, data, onRowClick, actions }: DataTableProps) => {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-slate-700 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-slate-700">
        <thead className="bg-gray-50 dark:bg-slate-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6 ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
            {actions && (
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
          {data.map((item, index) => (
            <tr
              key={index}
              className={`hover:bg-gray-50 dark:hover:bg-slate-700 ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-3 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
                >
                  {item[column.key]}
                </td>
              ))}
              {actions && (
                <td className="relative py-4 pl-3 pr-4 text-sm font-medium whitespace-nowrap sm:pr-6">
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;