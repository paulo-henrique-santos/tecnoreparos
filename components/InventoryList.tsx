import React from 'react';
import { InventoryItem } from '../types';
import InventoryItemComponent from './InventoryItem';

interface InventoryListProps {
  items: InventoryItem[];
  loading: boolean;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ items, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Carregando itens do estoque...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Nenhum item encontrado no estoque.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Clique em "Novo Item" para cadastrar o primeiro.</p>
      </div>
    );
  }
  
  const sortedItems = [...items].sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item / SKU</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantidade</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Preço (R$)</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Localização</th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Ações</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedItems.map((item) => (
                        <InventoryItemComponent key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default InventoryList;
