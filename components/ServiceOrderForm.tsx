import React, { useState, FormEvent, useEffect, useMemo } from 'react';
import { ServiceOrder, InventoryItem, LinkedInventoryItem } from '../types';
import Modal from './Modal';
import { GoogleGenAI } from "@google/genai";
import { PlusIcon, XIcon } from './Icons';

const ServiceOrderForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  order: ServiceOrder | null;
  inventoryItems: InventoryItem[];
}> = ({ isOpen, onClose, onSave, order, inventoryItems }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [equipment, setEquipment] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [technicalReport, setTechnicalReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [linkedItems, setLinkedItems] = useState<LinkedInventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [itemQuantity, setItemQuantity] = useState<number>(1);

  useEffect(() => {
    if (order) {
      setCustomerName(order.customerName);
      setCustomerPhone(order.customerPhone);
      setEquipment(order.equipment);
      setBrand(order.brand);
      setModel(order.model);
      setSerialNumber(order.serialNumber);
      setProblemDescription(order.problemDescription);
      setTechnicalReport(order.technicalReport || '');
      setLinkedItems(order.inventoryItems || []);
    } else {
      // Reset form
      setCustomerName('');
      setCustomerPhone('');
      setEquipment('');
      setBrand('');
      setModel('');
      setSerialNumber('');
      setProblemDescription('');
      setTechnicalReport('');
      setLinkedItems([]);
    }
    setSelectedItem('');
    setItemQuantity(1);
  }, [order, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ 
        customerName, 
        customerPhone, 
        equipment, 
        brand, 
        model, 
        serialNumber, 
        problemDescription,
        technicalReport,
        inventoryItems: linkedItems,
    });
    onClose();
  };
  
  const handleGenerateReport = async () => {
    if (!problemDescription) {
      alert("Por favor, descreva o defeito reclamado primeiro.");
      return;
    }
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Com base na seguinte descrição de defeito de um equipamento eletrônico, gere um possível laudo técnico e os passos para o reparo em português. Seja técnico, mas claro. Defeito: "${problemDescription}"`,
      });
      const text = response.text;
      setTechnicalReport(text);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Falha ao gerar o laudo. Verifique o console para mais detalhes.");
    } finally {
      setIsGenerating(false);
    }
  };

  const availableInventoryItems = useMemo(() => {
    return inventoryItems.filter(item => !linkedItems.some(linked => linked.itemId === item.id));
  }, [inventoryItems, linkedItems]);
    
  const handleAddPart = () => {
    if (!selectedItem || itemQuantity <= 0) return;
    
    const itemInStock = inventoryItems.find(i => i.id === selectedItem);
    if (!itemInStock) return;
    
    if (itemQuantity > itemInStock.quantity) {
        alert(`Quantidade indisponível. Estoque atual: ${itemInStock.quantity}`);
        return;
    }

    setLinkedItems([...linkedItems, { itemId: selectedItem, quantity: itemQuantity }]);
    setSelectedItem('');
    setItemQuantity(1);
  };
    
  const handleRemovePart = (itemId: string) => {
    setLinkedItems(linkedItems.filter(item => item.itemId !== itemId));
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={order ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {/* Customer Info */}
          <div className="md:col-span-2">
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Informações do Cliente</h4>
          </div>
          <div>
            <label htmlFor="customerName" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
            <input type="text" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label htmlFor="customerPhone" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
            <input type="tel" id="customerPhone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>

          {/* Equipment Info */}
          <div className="md:col-span-2 mt-4">
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Informações do Equipamento</h4>
          </div>
          <div>
            <label htmlFor="equipment" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Equipamento</label>
            <input type="text" id="equipment" value={equipment} onChange={(e) => setEquipment(e.target.value)} required className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Marca</label>
            <input type="text" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label htmlFor="model" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Modelo</label>
            <input type="text" id="model" value={model} onChange={(e) => setModel(e.target.value)} className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label htmlFor="serialNumber" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Nº de Série</label>
            <input type="text" id="serialNumber" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>

          {/* Problem Description */}
          <div className="md:col-span-2 mt-4">
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Descrição do Defeito e Laudo Técnico</h4>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="problemDescription" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Defeito Reclamado</label>
            <textarea id="problemDescription" value={problemDescription} onChange={(e) => setProblemDescription(e.target.value)} required rows={3} className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div className="md:col-span-2">
             <div className="flex justify-between items-center mb-2">
                 <label htmlFor="technicalReport" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Laudo Técnico</label>
                 <button
                     type="button"
                     onClick={handleGenerateReport}
                     disabled={isGenerating}
                     className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-50 disabled:cursor-wait"
                 >
                     {isGenerating ? 'Gerando...' : 'Gerar com IA'}
                 </button>
             </div>
            <textarea id="technicalReport" value={technicalReport} onChange={(e) => setTechnicalReport(e.target.value)} rows={5} className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>

          {/* Inventory Linking */}
          <div className="md:col-span-2 mt-4">
            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">Peças e Componentes</h4>
            <div className="space-y-2">
                {linkedItems.map(linkedItem => {
                    const item = inventoryItems.find(i => i.id === linkedItem.itemId);
                    return (
                        <div key={linkedItem.itemId} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm text-gray-800 dark:text-gray-200">{item?.name}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Qtd: {linkedItem.quantity}</span>
                                <button type="button" onClick={() => handleRemovePart(linkedItem.itemId)} className="text-red-500 hover:text-red-700">
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex items-end gap-2 mt-4">
                <div className="flex-grow">
                    <label htmlFor="inventoryItem" className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">Adicionar Peça</label>
                    <select id="inventoryItem" value={selectedItem} onChange={e => setSelectedItem(e.target.value)} className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="" disabled>Selecione um item...</option>
                        {availableInventoryItems.map(item => (
                            <option key={item.id} value={item.id}>{item.name} ({item.quantity} em estoque)</option>
                        ))}
                    </select>
                </div>
                <div className="w-20">
                    <label htmlFor="itemQuantity" className="block mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">Qtd.</label>
                    <input type="number" id="itemQuantity" value={itemQuantity} onChange={e => setItemQuantity(Number(e.target.value))} min="1" className="w-full px-2 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <button type="button" onClick={handleAddPart} className="px-3 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50" disabled={!selectedItem}>
                    <PlusIcon className="w-5 h-5"/>
                </button>
            </div>
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

export default ServiceOrderForm;