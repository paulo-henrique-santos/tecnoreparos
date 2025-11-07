import React from 'react';
import { ServiceOrder } from '../types';
import ServiceOrderItem from './ServiceOrderItem';
import { OrderStatus } from '../constants';

interface ServiceOrderListProps {
  orders: ServiceOrder[];
  loading: boolean;
  onEdit: (order: ServiceOrder) => void;
  onDelete: (order: ServiceOrder) => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

const ServiceOrderList: React.FC<ServiceOrderListProps> = ({ orders, loading, onEdit, onDelete, onStatusChange }) => {
  if (loading) {
    return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Carregando ordens de serviço...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Nenhuma ordem de serviço encontrada.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Clique em "Nova O.S." para cadastrar a primeira.</p>
      </div>
    );
  }

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cliente / Equipamento</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Defeito / Peças</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Ações</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedOrders.map((order) => (
                        <ServiceOrderItem key={order.id} order={order} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default ServiceOrderList;