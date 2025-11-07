
import React, { useState, useEffect, FormEvent } from 'react';
import { InventoryItem } from '../types';
import Modal from './Modal';

interface InventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  item: InventoryItem | null;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ isOpen, onClose, onSave, item }) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [supplier, setSupplier] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setSku(item.sku);
      setQuantity(item.quantity);
      setPrice(item.price);
      setSupplier(item.supplier);
      setLocation(item.location);
    } else {
      // Reset form for new item
      setName('');
      setSku('');
      setQuantity(0);
      setPrice(0);
      setSupplier('');
      setLocation('');
    }
  }, [item, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      sku,
      quantity,
      price,
      supplier,
      location,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Editar Item do Estoque' : 'Novo Item no Estoque'}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Item</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label htmlFor="sku" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">SKU</label>
            <input type="text" id="sku" value={sku} onChange={(e) => setSku(e.target.value)} required className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Localização</label>
            <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quantidade</label>
            <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required min="0" className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Preço (R$)</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(Number(e.target.value))} required min="0" step="0.01" className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="supplier" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Fornecedor</label>
            <input type="text" id="supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
        </div>
        <div className="flex items-center justify-end p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500 dark:focus:ring-offset-gray-800">Cancelar</button>
          <button type="submit" className="ml-3 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800">Salvar</button>
        </div>
      </form>
    </Modal>
  );
};

export default InventoryForm;
