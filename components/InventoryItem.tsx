import React from 'react';
import { InventoryItem } from '../types';
import { EditIcon, TrashIcon } from './Icons';

interface InventoryItemProps {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

const InventoryItemComponent: React.FC<InventoryItemProps> = ({ item, onEdit, onDelete }) => {
    const quantityColor = item.quantity <= 5 ? 'text-red-500' : item.quantity <= 10 ? 'text-yellow-500' : 'text-green-500';

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">SKU: {item.sku}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-sm font-bold ${quantityColor}`}>{item.quantity}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400"> unid.</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {item.location}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEdit(item)} className="p-2 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200 transition-colors" aria-label="Edit item">
                        <EditIcon className="w-5 h-5"/>
                    </button>
                    <button onClick={() => onDelete(item.id)} className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 transition-colors" aria-label="Delete item">
                        <TrashIcon className="w-5 h-5"/>
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default InventoryItemComponent;
