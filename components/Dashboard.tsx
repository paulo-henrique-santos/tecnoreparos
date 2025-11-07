import React, { useState, useMemo } from 'react';
import { ServiceOrder, InventoryItem, LinkedInventoryItem } from '../types';
import { useServiceOrders } from '../hooks/useServiceOrders';
import { useInventory } from '../hooks/useInventory';
import { useDebounce } from '../hooks/useDebounce';
import Header from './Header';
import ServiceOrderList from './ServiceOrderList';
import ServiceOrderForm from './ServiceOrderForm';
import InventoryList from './InventoryList';
import InventoryForm from './InventoryForm';
import ConfirmationModal from './ConfirmationModal';
import { PlusIcon, SearchIcon, ClipboardListIcon, BoxIcon } from './Icons';
import { OrderStatus } from '../constants';

type Tab = 'orders' | 'inventory';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  
  // Service Order State
  const { orders, loading: ordersLoading, addOrder, updateOrder, deleteOrder, updateOrderStatus } = useServiceOrders();
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<ServiceOrder | null>(null);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  // Inventory State
  const { items, loading: inventoryLoading, addItem, updateItem, deleteItem, updateItemQuantity } = useInventory();
  const [isInventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [inventorySearchTerm, setInventorySearchTerm] = useState('');

  const debouncedOrderSearch = useDebounce(orderSearchTerm, 300);
  const debouncedInventorySearch = useDebounce(inventorySearchTerm, 300);

  const handleOpenNewOrderModal = () => {
    setEditingOrder(null);
    setOrderModalOpen(true);
  };

  const handleEditOrder = (order: ServiceOrder) => {
    setEditingOrder(order);
    setOrderModalOpen(true);
  };

  const handleSaveOrder = (orderData: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const originalItems = editingOrder?.inventoryItems || [];
    const newItems = orderData.inventoryItems || [];

    const itemChanges = new Map<string, number>();

    // Calculate new usage
    newItems.forEach(item => {
        itemChanges.set(item.itemId, (itemChanges.get(item.itemId) || 0) + item.quantity);
    });

    // Factor in original usage (to find the difference)
    originalItems.forEach(item => {
        itemChanges.set(item.itemId, (itemChanges.get(item.itemId) || 0) - item.quantity);
    });

    // Apply changes to inventory
    itemChanges.forEach((quantityChange, itemId) => {
        if (quantityChange !== 0) {
            updateItemQuantity(itemId, -quantityChange); // Negative because we are consuming from stock
        }
    });

    if (editingOrder) {
      updateOrder(editingOrder.id, {...editingOrder, ...orderData});
    } else {
      addOrder(orderData);
    }
  };

  const handleConfirmDeleteOrder = () => {
    if (!orderToDelete) return;

    // Return parts to inventory
    if (orderToDelete.inventoryItems) {
        orderToDelete.inventoryItems.forEach(linkedItem => {
            updateItemQuantity(linkedItem.itemId, linkedItem.quantity); // Positive to return to stock
        });
    }
    
    deleteOrder(orderToDelete.id);
    setOrderToDelete(null);
  };

  const handleOpenNewItemModal = () => {
    setEditingItem(null);
    setInventoryModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setInventoryModalOpen(true);
  };

  const handleSaveItem = (itemData: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    if (editingItem) {
      updateItem(editingItem.id, itemData);
    } else {
      addItem(itemData);
    }
  };
  
  const filteredOrders = useMemo(() => {
    return orders
        .filter(order => statusFilter === 'all' || order.status === statusFilter)
        .filter(order => {
            const search = debouncedOrderSearch.toLowerCase();
            return (
                order.customerName.toLowerCase().includes(search) ||
                order.equipment.toLowerCase().includes(search) ||
                order.brand.toLowerCase().includes(search) ||
                order.model.toLowerCase().includes(search) ||
                order.problemDescription.toLowerCase().includes(search)
            );
        }
    );
  }, [orders, debouncedOrderSearch, statusFilter]);

  const filteredInventory = useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(debouncedInventorySearch.toLowerCase()) ||
      item.sku.toLowerCase().includes(debouncedInventorySearch.toLowerCase()) ||
      item.location.toLowerCase().includes(debouncedInventorySearch.toLowerCase())
    );
  }, [items, debouncedInventorySearch]);

  const renderContent = () => {
    if (activeTab === 'orders') {
      return (
        <ServiceOrderList 
          orders={filteredOrders}
          loading={ordersLoading}
          onEdit={handleEditOrder}
          onDelete={(order) => setOrderToDelete(order)}
          onStatusChange={updateOrderStatus}
        />
      );
    }
    if (activeTab === 'inventory') {
      return (
        <InventoryList 
          items={filteredInventory}
          loading={inventoryLoading}
          onEdit={handleEditItem}
          onDelete={(id) => setItemToDelete(id)}
        />
      );
    }
    return null;
  };

  const renderHeaderActions = () => {
      const isOrders = activeTab === 'orders';
      const searchTerm = isOrders ? orderSearchTerm : inventorySearchTerm;
      const setSearchTerm = isOrders ? setOrderSearchTerm : setInventorySearchTerm;
      const openModal = isOrders ? handleOpenNewOrderModal : handleOpenNewItemModal;
      const buttonText = isOrders ? "Nova O.S." : "Novo Item";
      const placeholder = isOrders ? "Buscar por cliente, equipamento..." : "Buscar por nome, SKU, localização...";

      return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-auto flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input 
                    type="text" 
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-gray-900 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:text-white"
                />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
                {isOrders && (
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                        className="w-full md:w-auto px-4 py-2 text-gray-900 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:text-white"
                    >
                        <option value="all">Todos os Status</option>
                        {Object.values(OrderStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                )}
                <button
                    onClick={openModal}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900 transition-colors"
                >
                    <PlusIcon className="w-5 h-5"/>
                    {buttonText}
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Gerencie suas ordens de serviço e estoque.</p>
        </div>
        
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`${activeTab === 'orders' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'} flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                    <ClipboardListIcon className="w-5 h-5"/>
                    Ordens de Serviço
                </button>
                <button
                    onClick={() => setActiveTab('inventory')}
                    className={`${activeTab === 'inventory' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'} flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                    <BoxIcon className="w-5 h-5" />
                    Estoque
                </button>
            </nav>
        </div>
        
        <div className="mb-6">
            {renderHeaderActions()}
        </div>

        {renderContent()}

      </main>
      
      <ServiceOrderForm
        isOpen={isOrderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        onSave={handleSaveOrder}
        order={editingOrder}
        inventoryItems={items}
      />
      
      <InventoryForm 
        isOpen={isInventoryModalOpen}
        onClose={() => setInventoryModalOpen(false)}
        onSave={handleSaveItem}
        item={editingItem}
      />

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleConfirmDeleteOrder}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta ordem de serviço? As peças utilizadas serão retornadas ao estoque. Esta ação não pode ser desfeita."
      />
      <ConfirmationModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            deleteItem(itemToDelete);
          }
          setItemToDelete(null);
        }}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este item do estoque? Esta ação não pode ser desfeita."
      />

    </div>
  );
};

export default Dashboard;