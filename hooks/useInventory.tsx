import { useState, useEffect, useCallback } from 'react';
import { InventoryItem } from '../types';

const MOCK_INVENTORY: InventoryItem[] = [
    { id: 'inv1', name: 'Tela Display iPhone 12', sku: 'IP12-DISP', quantity: 15, price: 450.00, supplier: 'Fornecedor Apple Parts', location: 'Prateleira A-1', lastUpdated: new Date('2023-10-27T10:00:00Z').toISOString() },
    { id: 'inv2', name: 'Bateria Samsung Galaxy S20', sku: 'SAM-S20-BAT', quantity: 8, price: 180.50, supplier: 'Cell Components', location: 'Gaveta B-3', lastUpdated: new Date('2023-10-26T11:00:00Z').toISOString() },
    { id: 'inv3', name: 'SSD 240GB Kingston', sku: 'KIN-SSD-240', quantity: 5, price: 150.00, supplier: 'Info Parts Distribuidora', location: 'Prateleira C-5', lastUpdated: new Date('2023-10-25T09:30:00Z').toISOString() },
    { id: 'inv4', name: 'Memória RAM 8GB DDR4', sku: 'CRU-DDR4-8GB', quantity: 22, price: 125.00, supplier: 'Info Parts Distribuidora', location: 'Prateleira C-5', lastUpdated: new Date('2023-10-25T09:30:00Z').toISOString() },
];

const STORAGE_KEY = 'tecnoreparos_inventoryItems';

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => { // Simulate API delay
        try {
            const storedItems = localStorage.getItem(STORAGE_KEY);
            if (storedItems) {
                setItems(JSON.parse(storedItems));
            } else {
                setItems(MOCK_INVENTORY);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INVENTORY));
            }
        } catch (error) {
            console.error("Failed to load inventory from local storage", error);
            setItems(MOCK_INVENTORY);
        } finally {
            setLoading(false);
        }
    }, 500);
  }, []);

  const saveItems = useCallback((newItems: InventoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.error("Failed to save inventory to local storage", error);
    }
  }, []);

  const addItem = (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: crypto.randomUUID(),
      lastUpdated: new Date().toISOString(),
    };
    saveItems([newItem, ...items]);
  };

  const updateItem = (itemId: string, itemData: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, ...itemData, lastUpdated: new Date().toISOString() } : item
    );
    saveItems(newItems);
  };

  const updateItemQuantity = (itemId: string, quantityChange: number) => {
    const newItems = items.map(item => {
        if (item.id === itemId) {
            return { ...item, quantity: item.quantity + quantityChange, lastUpdated: new Date().toISOString() };
        }
        return item;
    });
    saveItems(newItems);
  };

  const deleteItem = (id: string) => {
    const newItems = items.filter((item) => item.id !== id);
    saveItems(newItems);
  };

  return { items, loading, addItem, updateItem, deleteItem, updateItemQuantity };
};