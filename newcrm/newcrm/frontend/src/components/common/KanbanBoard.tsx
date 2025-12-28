import React, { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';

interface KanbanColumn {
  id: string;
  title: string;
  items: any[];
}

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  status: string;
  amount?: number;
  probability?: number;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onAddItem?: (columnId: string) => void;
  onMoveItem?: (itemId: string, fromColumn: string, toColumn: string) => void;
  onEditItem?: (item: KanbanCard) => void;
  onDeleteItem?: (itemId: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  columns, 
  onAddItem,
  onMoveItem,
  onEditItem,
  onDeleteItem
}) => {
  const [draggedItem, setDraggedItem] = useState<{ itemId: string; fromColumn: string } | null>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string, columnId: string) => {
    setDraggedItem({ itemId, fromColumn: columnId });
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toColumnId: string) => {
    e.preventDefault();
    if (draggedItem && onMoveItem) {
      onMoveItem(draggedItem.itemId, draggedItem.fromColumn, toColumnId);
    }
    setDraggedItem(null);
  };

  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">{column.title}</h3>
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
                {column.items.length}
              </span>
            </div>
          </div>
          
          <div className="p-4 min-h-[500px]">
            <div className="space-y-3">
              {column.items.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id, column.id)}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 cursor-move hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{item.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center mt-3">
                    {item.amount && (
                      <span className="text-sm font-medium text-gray-900 dark:text-white">${item.amount.toLocaleString()}</span>
                    )}
                    {item.probability && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                        {item.probability}% chance
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center mt-3">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                      {item.owner?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{item.owner || 'Unassigned'}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => onAddItem && onAddItem(column.id)}
              className="w-full mt-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center"
            >
              <Plus size={16} className="mr-1" />
              Add new
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;