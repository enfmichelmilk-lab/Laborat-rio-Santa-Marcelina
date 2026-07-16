/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Equipment } from '../types';
import { 
  ClipboardCheck, 
  Plus, 
  Search, 
  Calendar, 
  ShieldAlert, 
  User, 
  Wrench, 
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  Hash, 
  Building,
  Settings,
  XCircle,
  PlusCircle
} from 'lucide-react';

interface EquipmentControlProps {
  equipment: Equipment[];
  onUpdateStatus: (id: string, status: Equipment['status']) => void;
  onAddEquipment: (equip: Omit<Equipment, 'id'>) => void;
  onDeleteEquipment: (id: string) => void;
  isDarkMode: boolean;
  userRole: string;
}

export default function EquipmentControl({
  equipment,
  onUpdateStatus,
  onAddEquipment,
  onDeleteEquipment,
  isDarkMode,
  userRole
}: EquipmentControlProps) {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [sector, setSector] = useState('Bioquímica');
  const [status, setStatus] = useState<'active' | 'calibration' | 'maintenance'>('active');
  const [lastCalibration, setLastCalibration] = useState('');
  const [nextCalibration, setNextCalibration] = useState('');
  const [responsible, setResponsible] = useState('');

  const sectors = [
    'Bioquímica',
    'Microbiologia',
    'Hematologia',
    'Imunologia',
    'Urinálise',
    'Parasitologia',
    'Controle de Qualidade',
    'Triagem'
  ];

  const handleAddEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !model.trim() || !serialNumber.trim() || !lastCalibration || !nextCalibration || !responsible.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onAddEquipment({
      name,
      model,
      serialNumber,
      sector,
      status,
      lastCalibration,
      nextCalibration,
      responsible
    });

    // Reset Form
    setName('');
    setModel('');
    setSerialNumber('');
    setSector('Bioquímica');
    setStatus('active');
    setLastCalibration('');
    setNextCalibration('');
    setResponsible('');
    setShowAddForm(false);
  };

  // Helper function to check if next calibration is overdue or near (less than 30 days)
  const getCalibrationStatus = (nextCalStr: string) => {
    const today = new Date();
    const nextCal = new Date(nextCalStr);
    const diffTime = nextCal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Calibração Vencida', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', isUrgent: true };
    } else if (diffDays <= 30) {
      return { label: `Vence em ${diffDays} dias`, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', isUrgent: true };
    }
    return { label: 'Calibração em Dia', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', isUrgent: false };
  };

  const filteredEquipment = equipment.filter(equip => {
    const matchesSearch = equip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          equip.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          equip.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          equip.responsible.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || equip.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const activeCount = equipment.filter(e => e.status === 'active').length;
  const calibrationCount = equipment.filter(e => e.status === 'calibration').length;
  const maintenanceCount = equipment.filter(e => e.status === 'maintenance').length;

  const canModify = userRole === 'Gestor' || userRole === 'Técnico';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Controle de Equipamentos</h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Monitoramento de calibragem, manutenção preditiva e responsáveis técnicos das máquinas do laboratório.
          </p>
        </div>

        {canModify && (
          <button
            id="toggle-add-equip-form-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Equipamento</span>
          </button>
        )}
      </div>

      {/* Quick counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Ativos */}
        <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Equipamentos Ativos</span>
            <strong className="text-lg font-bold">{activeCount} / {equipment.length}</strong>
          </div>
        </div>

        {/* Calibração */}
        <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Em Calibração</span>
            <strong className="text-lg font-bold">{calibrationCount} máquinas</strong>
          </div>
        </div>

        {/* Manutenção */}
        <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-3 rounded-lg bg-rose-500/10 text-rose-500">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Em Manutenção</span>
            <strong className="text-lg font-bold">{maintenanceCount} máquinas</strong>
          </div>
        </div>
      </div>

      {/* Main Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Add equipment sidebar */}
        {showAddForm && (
          <div className="lg:col-span-4">
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
                <h3 className="font-bold text-base">Cadastrar Equipamento</h3>
              </div>

              <form onSubmit={handleAddEquipmentSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1 opacity-85">Nome do Aparelho *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Banho Maria Digital"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                      ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>

                {/* Model and SN */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1 opacity-85">Modelo *</label>
                    <input
                      type="text"
                      required
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Ex: SL-150"
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                        ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1 opacity-85">Nº de Série *</label>
                    <input
                      type="text"
                      required
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      placeholder="Ex: SN-92318"
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                        ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>
                </div>

                {/* Sector & Responsible */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1 opacity-85">Setor</label>
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                        ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    >
                      {sectors.map(sec => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1 opacity-85">Status Inicial</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                        ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <option value="active">Ativo / Liberado</option>
                      <option value="calibration">Em Calibração</option>
                      <option value="maintenance">Em Manutenção</option>
                    </select>
                  </div>
                </div>

                {/* Responsible */}
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1 opacity-85">Responsável Técnico *</label>
                  <input
                    type="text"
                    required
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    placeholder="Ex: Dr. Roberto Santos"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                      ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>

                {/* Calibration Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1 opacity-85">Última Calibração *</label>
                    <input
                      type="date"
                      required
                      value={lastCalibration}
                      onChange={(e) => setLastCalibration(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                        ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-1 opacity-85">Próxima Calibração *</label>
                    <input
                      type="date"
                      required
                      value={nextCalibration}
                      onChange={(e) => setNextCalibration(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                        ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    />
                  </div>
                </div>

                {/* Submit Panel */}
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
                    id="submit-new-equipment-btn"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Equipment Table Grid List */}
        <div className={showAddForm ? 'lg:col-span-8 space-y-4' : 'lg:col-span-12 space-y-4'}>
          {/* Filters Bar */}
          <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 items-center justify-between
            ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por equipamento, marca, SN ou responsável..."
                className={`w-full pl-9 pr-4 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all
                  ${isDarkMode ? 'bg-slate-800/40 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
              />
            </div>

            {/* Status Select Toggles */}
            <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <button
                id="filter-status-all"
                onClick={() => setSelectedStatus('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer
                  ${selectedStatus === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : (isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900')}`}
              >
                Todos
              </button>
              <button
                id="filter-status-active"
                onClick={() => setSelectedStatus('active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer
                  ${selectedStatus === 'active'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : (isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900')}`}
              >
                Liberados
              </button>
              <button
                id="filter-status-calibration"
                onClick={() => setSelectedStatus('calibration')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer
                  ${selectedStatus === 'calibration'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : (isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900')}`}
              >
                Em Calibração
              </button>
              <button
                id="filter-status-maintenance"
                onClick={() => setSelectedStatus('maintenance')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer
                  ${selectedStatus === 'maintenance'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : (isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900')}`}
              >
                Manutenção
              </button>
            </div>
          </div>

          {/* Cards Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEquipment.length === 0 ? (
              <div className="col-span-full p-12 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <ClipboardCheck className="w-8 h-8 mx-auto opacity-50 mb-2" />
                <p className="text-xs">Nenhum equipamento cadastrado ou correspondente aos filtros.</p>
              </div>
            ) : (
              filteredEquipment.map(equip => {
                const calStatus = getCalibrationStatus(equip.nextCalibration);
                return (
                  <div
                    id={`equip-card-${equip.id}`}
                    key={equip.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between gap-5 transition-all duration-150
                      ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:shadow-md'}`}
                  >
                    {/* Upper identity */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-sm tracking-tight">{equip.name}</h4>
                          <p className="text-xs text-slate-400">{equip.model}</p>
                        </div>

                        {/* Status badge dropdown or static indicator */}
                        {canModify ? (
                          <select
                            id={`status-select-${equip.id}`}
                            value={equip.status}
                            onChange={(e) => onUpdateStatus(equip.id, e.target.value as any)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-xl border appearance-none focus:outline-none cursor-pointer text-center
                              ${equip.status === 'active' 
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                : equip.status === 'calibration'
                                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                  : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}
                          >
                            <option value="active" className="bg-slate-900 text-slate-300">🟢 Ativo</option>
                            <option value="calibration" className="bg-slate-900 text-slate-300">🟡 Calibração</option>
                            <option value="maintenance" className="bg-slate-900 text-slate-300">🔴 Manutenção</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-xl tracking-wider uppercase
                            ${equip.status === 'active' 
                              ? 'bg-emerald-500/10 text-emerald-500' 
                              : equip.status === 'calibration'
                                ? 'bg-amber-500/10 text-amber-500'
                                : 'bg-rose-500/10 text-rose-500'}`}>
                            {equip.status === 'active' && 'Ativo'}
                            {equip.status === 'calibration' && 'Em Calibração'}
                            {equip.status === 'maintenance' && 'Manutenção'}
                          </span>
                        )}
                      </div>

                      {/* Technical specifications list */}
                      <div className="space-y-2 mt-4 text-xs">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Hash className="w-3.5 h-3.5 text-indigo-400" />
                          <span>SN: <strong className="font-mono">{equip.serialNumber}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <Building className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Setor: <strong>{equip.sector}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <User className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Responsável: <strong>{equip.responsible}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Calibration bottom status footer */}
                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Calibrações</span>
                        <div className="flex flex-col gap-0.5 text-[11px]">
                          <span>Última: <strong>{equip.lastCalibration}</strong></span>
                          <span>Próxima: <strong className={calStatus.isUrgent ? 'text-rose-500' : ''}>{equip.nextCalibration}</strong></span>
                        </div>
                      </div>

                      {/* Alert indicator */}
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border ${calStatus.color} flex items-center gap-1 shrink-0`}>
                          {calStatus.isUrgent && <AlertTriangle className="w-3.5 h-3.5" />}
                          {calStatus.label}
                        </span>

                        {userRole === 'Gestor' && (
                          <button
                            id={`delete-equip-btn-${equip.id}`}
                            onClick={() => {
                              if (confirm(`Tem certeza que deseja excluir o equipamento "${equip.name}"?`)) {
                                onDeleteEquipment(equip.id);
                              }
                            }}
                            className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 transition-colors cursor-pointer"
                            title="Remover máquina"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
