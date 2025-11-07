import { OrderStatus } from './constants';

export interface User {
  id: number;
  username: string;
}

export interface LinkedInventoryItem {
    itemId: string;
    quantity: number;
}

export interface ServiceOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  equipment: string;
  brand: string;
  model: string;
  serialNumber: string;
  problemDescription: string;
  technicalReport?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  inventoryItems?: LinkedInventoryItem[];
}

export interface InventoryItem {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    price: number;
    supplier: string;
    location: string;
    lastUpdated: string;
}