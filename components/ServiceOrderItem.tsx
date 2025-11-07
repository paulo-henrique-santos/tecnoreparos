import React, { useState, useRef, useEffect } from 'react';
import { ServiceOrder } from '../types';
import { OrderStatus, STATUS_COLORS } from '../constants';
import { EditIcon, TrashIcon, WrenchScrewdriverIcon } from './Icons';

interface ServiceOrderItemProps {
  order: ServiceOrder;
  onEdit: (order: ServiceOrder) => void;
  onDelete: (order: ServiceOrder) => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

const ServiceOrderItem: React.FC<ServiceOrderItemProps> = ({ order, onEdit, onDelete, onStatusChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusChange = (newStatus: OrderStatus) => {
    onStatusChange(order.id, newStatus);
    setIsMenuOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const totalItemsUsed = order.inventoryItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">{order.customerName}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{order.equipment} - {order.brand} {order.model}</div>
      </td>
      <td className="px-6 py-4 max-w-xs">
        <p className="text-sm text-gray-700 dark:text-gray-300 truncate" title={order.problemDescription}>
            {order.problemDescription}
        </p>
        {totalItemsUsed > 0 && (
            <div className="mt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 dark:bg-teal-900 px-2 py-1 text-xs font-medium text-teal-700 dark:text-teal-200">
                    <WrenchScrewdriverIcon className="w-3 h-3" />
                    {totalItemsUsed} peça(s)
                </span>
            </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="relative inline-block text-left" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`inline-flex justify-center w-full rounded-full px-3 py-1 text-sm font-medium focus:outline-none ${STATUS_COLORS[order.status]}`}
          >
            {order.status}
          </button>
          {isMenuOpen && (
            <div className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-20 focus:outline-none">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {Object.values(OrderStatus).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    role="menuitem"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatDate(order.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2">
            <button onClick={() => onEdit(order)} className="p-2 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200 transition-colors" aria-label="Edit order">
                <EditIcon className="w-5 h-5"/>
            </button>
            <button onClick={() => onDelete(order)} className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 transition-colors" aria-label="Delete order">
                <TrashIcon className="w-5 h-5"/>
            </button>
        </div>
      </td>
    </tr>
  );
};

export default ServiceOrderItem;