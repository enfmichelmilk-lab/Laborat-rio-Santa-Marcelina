/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { 
  Database, 
  Plus, 
  Minus, 
  Search, 
  AlertTriangle, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Boxes, 
  Bookmark, 
  MapPin, 
  Calendar,
  Layers,
  XCircle
} from 'lucide-react';

interface InventoryControlProps {
  inventory: InventoryItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  onDeleteItem: (id: string) => void;
  isDarkMode: boolean;
  userRole: string; // permissions check
}

export default function InventoryControl({
  inventory,
  onUpdateQuantity,
  onAddItem,
  onDeleteItem,
  isDarkMode,
  userRole
}: InventoryControlProps) {
  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Reagente');
  const [quantity, setQuantity] = useState<number>(10);
  const [minQuantity, setMinQuantity] = useState<number>(5);
  const [unit, setUnit] = useState('frasco 500ml');
  const [location, setLocation] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [batch, setBatch] = useState('');

  const categories = ['Reagente', 'Consumível', 'Vidraria', 'Meio de Cultura'];

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !unit.trim() || !location.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onAddItem({
      name,
      category,
      quantity: Number(quantity),
      minQuantity: Number(minQuantity),
      unit,
      location,
      expiryDate: expiryDate || undefined,
      batch: batch || undefined
    });

    // Reset Form
    setName('');
    setCategory('Reagente');
    setQuantity(10);
    setMinQuantity(5);
    setUnit('frasco 500ml');
    setLocation('');
    setExpiryDate('');
    setBatch('');
    setShowAddForm(false);
  };

  // Filter logic
  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.batch && item.batch.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity);
  const isTechnicianOrManager = userRole === 'Gestor' || userRole === 'Técnico' || userRole === 'Analista';
  const canModify = userRole === 'Gestor' || userRole === 'Técnico'; // simulate permissions

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Controle de Estoque</h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Controle de reagentes, meios de cultura, vidrarias e insumos com alertas automáticos de reposição.
          </p>
        </div>

        {canModify && (
          <button
            id="toggle-add-item-form-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Insumo</span>
          </button>
        )}
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total items type */}
        <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total de Insumos</span>
            <strong className="text-xl font-bold">{inventory.length} itens</strong>
          </div>
        </div>

        {/* Low Stock count */}
        <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className={`p-3 rounded-lg ${lowStockItems.length > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-100 text-slate-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reposição Crítica</span>
            <strong className={`text-xl font-bold ${lowStockItems.length > 0 ? 'text-amber-500' : ''}`}>
              {lowStockItems.length} insumos
            </strong>
          </div>
        </div>

        {/* Reagents count */}
        <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reagentes Cadastrados</span>
            <strong className="text-xl font-bold">{inventory.filter(i => i.category === 'Reagente').length} itens</strong>
          </div>
        </div>

        {/* Consumables count */}
        <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-500">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consumíveis</span>
            <strong className="text-xl font-bold">{inventory.filter(i => i.category === 'Consumível').length} itens</strong>
          </div>
        </div>
      </div>

      {/* Stock warning Banner if active */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex gap-3 items-center">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <span className="font-semibold block">Insumos Abaixo do Estoque Mínimo!</span>
            Os itens <strong className="underline">{lowStockItems.map(i => i.name).join(', ')}</strong> precisam de reposição imediata de fornecedores.
          </div>
        </div>
      )}

      {/* Main Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side Add form (conditional sidebar pop or direct render) */}
        {showAddForm && (
          <div className="lg:col-span-4 space-y-4">
            <div className={`p-5 rounded-2xl border shadow-sm relative
              ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              
              <button
                onClick={() => setShowAddForm(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <PlusCircle className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-base">Cadastrar Novo Insumo</h3>
              </div>

              <form onSubmit={handleAddItemSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1 opacity-85">Nome do Insumo *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Reagente de Benedict"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                      ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>

                {/* Category & Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1 opacity-85">Categoria</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                        ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1 opacity-85">Unidade *</label>
                    <input
                      type="text"
                      required
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="Ex: Frasco 500ml, un"
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                        ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>
                </div>

                {/* Quantities */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1 opacity-85">Qtd Atual *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                        ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1 opacity-85">Estoque Mínimo *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={minQuantity}
                      onChange={(e) => setMinQuantity(Number(e.target.value))}
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                        ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1 opacity-85">Local de Armazenamento *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Geladeira 03 - Prateleira B"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                      ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>

                {/* Batch & Expiry Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1 opacity-85">Lote</label>
                    <input
                      type="text"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      placeholder="Ex: BT-991"
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                        ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1 opacity-85">Validade</label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                        ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border cursor-pointer
                      ${isDarkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    id="submit-new-item-btn"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Adicionar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Right Side Inventory Table/List */}
        <div className={showAddForm ? 'lg:col-span-8 space-y-4' : 'lg:col-span-12 space-y-4'}>
          {/* Filtering Header */}
          <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 items-center justify-between
            ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar insumo, lote ou localização..."
                className={`w-full pl-9 pr-4 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all
                  ${isDarkMode ? 'bg-slate-800/40 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
              />
            </div>

            {/* Categories Toggles */}
            <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <button
                id="filter-cat-all"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer
                  ${selectedCategory === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : (isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900')}`}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button
                  id={`filter-cat-${cat}`}
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer
                    ${selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : (isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900')}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List display */}
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="p-12 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Database className="w-8 h-8 mx-auto opacity-50 mb-2" />
                <p className="text-xs">Nenhum insumo encontrado para a busca ou filtro selecionado.</p>
              </div>
            ) : (
              filteredItems.map(item => {
                const isLowStock = item.quantity <= item.minQuantity;
                return (
                  <div
                    id={`inventory-item-${item.id}`}
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4
                      ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800/50' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                  >
                    {/* Item identity */}
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0
                        ${isLowStock 
                          ? 'bg-amber-500/10 text-amber-500' 
                          : 'bg-indigo-500/10 text-indigo-500'}`}>
                        <Database className="w-5 h-5" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm tracking-tight">{item.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase
                            ${isLowStock
                              ? 'bg-amber-500/15 text-amber-500'
                              : 'bg-emerald-500/15 text-emerald-500'}`}>
                            {isLowStock ? 'Estoque Baixo' : 'Normal'}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <Bookmark className="w-3.5 h-3.5" /> {item.category}
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {item.location}
                          </span>
                        </div>

                        {/* Batch and Expiry */}
                        <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-slate-400">
                          {item.batch && <span>Lote: <strong className="font-mono">{item.batch}</strong></span>}
                          {item.batch && item.expiryDate && <span>•</span>}
                          {item.expiryDate && (
                            <span className="flex items-center gap-0.5">
                              <Calendar className="w-3 h-3" /> Validade: {item.expiryDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity control Panel */}
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                      {/* Current Quantity display */}
                      <div className="text-right flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Quantidade</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">
                          {item.quantity} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">Mínimo: {item.minQuantity}</span>
                      </div>

                      {/* Interactive adjust controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {canModify ? (
                          <>
                            <button
                              id={`qty-minus-${item.id}`}
                              disabled={item.quantity === 0}
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className={`p-1.5 rounded-lg border text-slate-500 hover:text-slate-900 transition-colors cursor-pointer
                                ${isDarkMode 
                                  ? 'border-slate-800 hover:bg-slate-800 disabled:opacity-30' 
                                  : 'border-slate-200 hover:bg-slate-100 disabled:opacity-30'}`}
                              title="Retirar 1 unidade"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <button
                              id={`qty-plus-${item.id}`}
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className={`p-1.5 rounded-lg border text-slate-500 hover:text-slate-900 transition-colors cursor-pointer
                                ${isDarkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}
                              title="Adicionar 1 unidade"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            {userRole === 'Gestor' && (
                              <button
                                id={`delete-item-btn-${item.id}`}
                                onClick={() => {
                                  if (confirm(`Tem certeza que deseja excluir o insumo "${item.name}" do estoque?`)) {
                                    onDeleteItem(item.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg border border-rose-200/50 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-950/20 text-rose-500 hover:text-rose-600 transition-all cursor-pointer ml-1"
                                title="Excluir item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
                            Somente Leitura
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
