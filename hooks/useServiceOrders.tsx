import { useState, useEffect, useCallback } from 'react';
import { ServiceOrder } from '../types';
import { OrderStatus } from '../constants';

const MOCK_ORDERS: ServiceOrder[] = [
  {
    id: 'os-1',
    customerName: 'João Silva',
    customerPhone: '11987654321',
    equipment: 'Notebook',
    brand: 'Dell',
    model: 'Inspiron 15',
    serialNumber: 'ABC123XYZ',
    problemDescription: 'Não liga, sem sinal de energia.',
    technicalReport: 'Placa-mãe em curto. Necessário substituir.',
    status: OrderStatus.AwaitingApproval,
    createdAt: new Date('2023-10-28T14:00:00Z').toISOString(),
    updatedAt: new Date('2023-10-28T16:30:00Z').toISOString(),
    inventoryItems: [
        { itemId: 'inv3', quantity: 1 }
    ]
  },
  {
    id: 'os-2',
    customerName: 'Maria Oliveira',
    customerPhone: '21912345678',
    equipment: 'Smartphone',
    brand: 'Samsung',
    model: 'Galaxy S21',
    serialNumber: 'DEF456ABC',
    problemDescription: 'Tela quebrada após queda.',
    status: OrderStatus.InProgress,
    createdAt: new Date('2023-10-27T10:00:00Z').toISOString(),
    updatedAt: new Date('2023-10-27T11:00:00Z').toISOString(),
    inventoryItems: [
        { itemId: 'inv2', quantity: 1 }
    ]
  },
  {
    id: 'os-3',
    customerName: 'Carlos Pereira',
    customerPhone: '31999998888',
    equipment: 'Desktop',
    brand: 'Custom',
    model: 'Gamer Rig',
    serialNumber: 'GHI789DEF',
    problemDescription: 'Superaquecendo e desligando sozinho durante jogos.',
    technicalReport: 'Limpeza interna e troca da pasta térmica do processador realizada.',
    status: OrderStatus.Completed,
    createdAt: new Date('2023-10-25T09:00:00Z').toISOString(),
    updatedAt: new Date('2023-10-26T18:00:00Z').toISOString(),
  },
   {
    id: 'os-4',
    customerName: 'Ana Souza',
    customerPhone: '41988776655',
    equipment: 'Notebook',
    brand: 'HP',
    model: 'Pavilion',
    serialNumber: 'JKL101MNO',
    problemDescription: 'Upgrade de memória e armazenamento.',
    status: OrderStatus.Pending,
    createdAt: new Date('2023-10-29T11:00:00Z').toISOString(),
    updatedAt: new Date('2023-10-29T11:00:00Z').toISOString(),
    inventoryItems: [
      { itemId: 'inv3', quantity: 1 },
      { itemId: 'inv4', quantity: 2 }
    ]
  },
];

const STORAGE_KEY = 'tecnoreparos_serviceOrders';

export const useServiceOrders = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => { // Simulate API delay
      try {
        const storedOrders = localStorage.getItem(STORAGE_KEY);
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        } else {
          setOrders(MOCK_ORDERS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ORDERS));
        }
      } catch (error) {
        console.error("Failed to load service orders from local storage", error);
        setOrders(MOCK_ORDERS);
      } finally {
        setLoading(false);
      }
    }, 1000);
  }, []);

  const saveOrders = useCallback((newOrders: ServiceOrder[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrders));
      setOrders(newOrders);
    } catch (error) {
      console.error("Failed to save service orders to local storage", error);
    }
  }, []);

  const addOrder = (order: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newOrder: ServiceOrder = {
      ...order,
      id: crypto.randomUUID(),
      status: OrderStatus.Pending,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveOrders([newOrder, ...orders]);
  };

  const updateOrder = (orderId: string, orderData: Omit<ServiceOrder, 'id' | 'createdAt'>) => {
    const newOrders = orders.map((order) =>
      order.id === orderId ? { ...order, ...orderData, updatedAt: new Date().toISOString() } : order
    );
    saveOrders(newOrders);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const newOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
    );
    saveOrders(newOrders);
  };
  
  const deleteOrder = (id: string) => {
    const newOrders = orders.filter((order) => order.id !== id);
    saveOrders(newOrders);
  };

  return { orders, loading, addOrder, updateOrder, deleteOrder, updateOrderStatus };
};