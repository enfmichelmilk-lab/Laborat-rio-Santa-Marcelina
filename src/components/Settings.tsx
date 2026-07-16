/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AdminUser, SystemSettings, Branch } from '../types';
import { 
  Settings, 
  UploadCloud, 
  UserCheck, 
  ShieldAlert, 
  Building, 
  MapPin, 
  FileText, 
  Check, 
  X, 
  Plus, 
  Users, 
  Trash2,
  Mail,
  FolderGit,
  AlertCircle
} from 'lucide-react';
import { ADMIN_PERMISSIONS_LIST } from '../data';

interface SettingsProps {
  settings: SystemSettings;
  onUpdateSettings: (settings: SystemSettings) => void;
  images: { logo: string; stamp: string; signature: string };
  onUpdateImage: (id: 'logo' | 'stamp' | 'signature', base64: string) => void;
  onResetImages: () => void;
  adminUsers: AdminUser[];
  onTogglePermission: (userId: string, permissionId: string) => void;
  onAddAdminUser: (user: Omit<AdminUser, 'id'>) => void;
  onDeleteAdminUser: (id: string) => void;
  isDarkMode: boolean;
  branches?: Branch[];
  onAddBranch?: (branch: Omit<Branch, 'id'>) => void;
  onDeleteBranch?: (id: string) => void;
}

export default function SettingsComponent({
  settings,
  onUpdateSettings,
  images,
  onUpdateImage,
  onResetImages,
  adminUsers,
  onTogglePermission,
  onAddAdminUser,
  onDeleteAdminUser,
  isDarkMode,
  branches = [],
  onAddBranch,
  onDeleteBranch
}: SettingsProps) {
  // Institution Info Form
  const [labName, setLabName] = useState(settings.labName);
  const [cnpj, setCnpj] = useState(settings.cnpj);
  const [address, setAddress] = useState(settings.address);
  const [showLogoOnReports, setShowLogoOnReports] = useState(settings.showLogoOnReports);
  const [showStampOnReports, setShowStampOnReports] = useState(settings.showStampOnReports);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  // New Admin Form State
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'Gestor' | 'Analista' | 'Técnico'>('Analista');
  const [newAdminFilial, setNewAdminFilial] = useState(branches.length > 0 ? branches[0].name : 'Itaquera (Sede)');

  // New Branch Form State
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCnpj, setNewBranchCnpj] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [saveBranchSuccess, setSaveBranchSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      labName,
      cnpj,
      address,
      showLogoOnReports,
      showStampOnReports
    });
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 4000);
  };

  const handleImageUpload = (id: 'logo' | 'stamp' | 'signature', file: File) => {
    if (!file) return;
    
    // File size check (keep base64 small for localStorage limits, e.g., max 500KB)
    if (file.size > 512000) {
      alert('A imagem é muito grande! Por favor, escolha uma imagem de até 500KB para garantir o armazenamento local.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        onUpdateImage(id, e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim()) {
      alert('Por favor, preencha todos os campos do formulário.');
      return;
    }

    // Default permissions based on role
    const initialPermissions: { [key: string]: boolean } = {};
    ADMIN_PERMISSIONS_LIST.forEach(perm => {
      if (newAdminRole === 'Gestor') {
        initialPermissions[perm.id] = true;
      } else if (newAdminRole === 'Analista') {
        initialPermissions[perm.id] = ['view_dashboard', 'manage_inventory', 'critical_analysis'].includes(perm.id);
      } else { // Técnico
        initialPermissions[perm.id] = ['view_dashboard', 'manage_inventory', 'manage_equipment'].includes(perm.id);
      }
    });

    onAddAdminUser({
      name: newAdminName,
      email: newAdminEmail,
      role: newAdminRole,
      permissions: initialPermissions,
      filial: newAdminFilial
    });

    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminRole('Analista');
    setNewAdminFilial(branches.length > 0 ? branches[0].name : 'Itaquera (Sede)');
    setShowAddAdmin(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Configurações Gerais</h1>
        <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Controle de imagens do sistema, dados institucionais impressos e permissões administrativas de usuários.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Images, Lab Info & Documents Config */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Section: Upload Imagens do Laboratório */}
          <div className={`p-5 rounded-2xl border shadow-sm transition-all duration-200
            ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-500" />
                Imagens para Impressos e Laudos
              </h2>
              <button 
                onClick={onResetImages}
                className="text-[10px] text-rose-500 hover:underline font-bold tracking-wider uppercase cursor-pointer"
              >
                Resetar para Padrões
              </button>
            </div>
            
            <p className="text-xs text-slate-400 mb-6">
              Carregue as imagens oficiais que aparecerão nos cabeçalhos dos exames e no fechamento dos relatórios oficiais.
            </p>

            <div className="space-y-6">
              {/* Image box generator */}
              {([
                { id: 'logo', label: 'Logo do Laboratório (Laudos)', desc: 'Recomendado: Fundo transparente, proporção 1:1.' },
                { id: 'stamp', label: 'Carimbo de Aprovação Digital', desc: 'Recomendado: SVG ou PNG de carimbo circular.' },
                { id: 'signature', label: 'Assinatura Digital (Resp. Técnico)', desc: 'Recomendado: Traço azul escuro em fundo transparente.' }
              ] as const).map((imgConf) => (
                <div key={imgConf.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  
                  {/* Preview Container */}
                  <div className="sm:col-span-3 flex justify-center">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800/60 border flex items-center justify-center p-1.5 overflow-hidden">
                      <img 
                        src={images[imgConf.id]} 
                        alt={imgConf.label} 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Upload details & control */}
                  <div className="sm:col-span-9 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold">{imgConf.label}</span>
                      <label className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:hover:bg-indigo-950 dark:text-indigo-400 font-bold px-2 py-1 rounded-md border border-indigo-200 dark:border-indigo-800 cursor-pointer transition-colors shrink-0">
                        Selecionar
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleImageUpload(imgConf.id, e.target.files[0]);
                          }}
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{imgConf.desc}</p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Section: Dados Institucionais */}
          <div className={`p-5 rounded-2xl border shadow-sm transition-all duration-200
            ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            
            <h2 className="font-bold text-base flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-indigo-500" />
              Dados Gerais do Laboratório
            </h2>

            {saveSettingsSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Dados atualizados com sucesso no sistema!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              {/* Lab Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase mb-1 opacity-80">Nome Fantasia do Laboratório</label>
                <input
                  type="text"
                  required
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                    ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>

              {/* CNPJ */}
              <div>
                <label className="block text-[10px] font-bold uppercase mb-1 opacity-80">CNPJ</label>
                <input
                  type="text"
                  required
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                    ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-[10px] font-bold uppercase mb-1 opacity-80">Endereço Completo</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                    ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>

              {/* Toggle print switches */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-300">Exibir Logo nos Cabeçalhos de Relatórios</span>
                  <input
                    type="checkbox"
                    checked={showLogoOnReports}
                    onChange={(e) => setShowLogoOnReports(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-300">Exibir Carimbo de Aprovação no Laudo</span>
                  <input
                    type="checkbox"
                    checked={showStampOnReports}
                    onChange={(e) => setShowStampOnReports(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                id="save-instit-settings-btn"
                className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Salvar Dados Institucionais
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Administrative Permissions Management */}
        <div className="lg:col-span-6 space-y-6">
          <div className={`p-5 rounded-2xl border shadow-sm transition-all duration-200
            ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-500" />
                Permissões Administrativas
              </h2>
              
              <button
                id="toggle-add-admin-btn"
                onClick={() => setShowAddAdmin(!showAddAdmin)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Usuário</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-6">
              Selecione o usuário administrativo para habilitar ou revogar permissões de acesso às abas do laboratório em tempo real.
            </p>

            {/* Quick add admin user form */}
            {showAddAdmin && (
              <div className="mb-6 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/10 dark:bg-indigo-950/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500">Cadastrar Usuário Administrativo</h4>
                  <button onClick={() => setShowAddAdmin(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddAdminSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-0.5">Nome Completo</label>
                      <input
                        type="text"
                        required
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        placeholder="Ex: Dra. Marta Leão"
                        className={`w-full px-2.5 py-1.5 rounded-lg text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                          ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-0.5">E-mail</label>
                      <input
                        type="email"
                        required
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="marta.leao@labmail.com"
                        className={`w-full px-2.5 py-1.5 rounded-lg text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                          ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-0.5">Cargo / Perfil</label>
                      <select
                        value={newAdminRole}
                        onChange={(e) => setNewAdminRole(e.target.value as any)}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                          ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                      >
                        <option value="Gestor">Gestor Geral (Acesso Total)</option>
                        <option value="Analista">Analista Clínico (Acesso Parcial)</option>
                        <option value="Técnico">Técnico de Lab (Acesso Técnico)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-400 mb-0.5">Filial Atribuída</label>
                      <select
                        value={newAdminFilial}
                        onChange={(e) => setNewAdminFilial(e.target.value)}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                          ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                      >
                        {branches && branches.length > 0 ? (
                          branches.map(b => (
                            <option key={b.id} value={b.name}>{b.name}</option>
                          ))
                        ) : (
                          <option value="Itaquera (Sede)">Itaquera (Sede)</option>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      id="save-new-admin-btn"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                    >
                      Cadastrar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Users permissions expansion panel */}
            <div className="space-y-4">
              {adminUsers.map((u) => (
                <div 
                  id={`admin-user-permissions-row-${u.id}`}
                  key={u.id}
                  className={`p-4 rounded-xl border transition-all duration-150
                    ${isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}
                >
                  {/* Identity row */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs uppercase">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs">{u.name}</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold tracking-wide uppercase
                            ${u.role === 'Gestor' 
                              ? 'bg-purple-500/10 text-purple-500' 
                              : u.role === 'Analista'
                                ? 'bg-indigo-500/10 text-indigo-500'
                                : 'bg-blue-500/10 text-blue-500'}`}>
                            {u.role}
                          </span>
                          {u.filial && (
                            <span className="px-1.5 py-0.5 rounded-full text-[8px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-500">
                              {u.filial}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block">{u.email}</span>
                      </div>
                    </div>

                    {/* Excluir admin, prevent deleting primary gestor */}
                    {u.id !== 'admin-1' && (
                      <button
                        onClick={() => {
                          if (confirm(`Tem certeza que deseja remover o usuário administrativo "${u.name}"?`)) {
                            onDeleteAdminUser(u.id);
                          }
                        }}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                        title="Remover usuário"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Permissions matrix (Toggles) */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-100 dark:border-slate-800/50 pt-3">
                    {ADMIN_PERMISSIONS_LIST.map((perm) => {
                      const hasPerm = u.permissions[perm.id] || u.role === 'Gestor'; // Gestor is hard-allowed by role for demo convenience
                      return (
                        <button
                          id={`toggle-perm-${u.id}-${perm.id}`}
                          key={perm.id}
                          disabled={u.role === 'Gestor'} // Gestor has full rights
                          onClick={() => onTogglePermission(u.id, perm.id)}
                          className={`flex items-center justify-between gap-2 p-2 rounded-lg border text-left transition-colors
                            ${u.role === 'Gestor' ? 'opacity-80 pointer-events-none' : 'cursor-pointer'}
                            ${hasPerm
                              ? (isDarkMode ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-700')
                              : (isDarkMode ? 'bg-slate-800/40 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400')}`}
                        >
                          <span className="truncate pr-1 font-semibold">{perm.label}</span>
                          
                          {/* Checkbox state */}
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0
                            ${hasPerm 
                              ? 'bg-indigo-500 border-indigo-500 text-white' 
                              : (isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-slate-50')}`}>
                            {hasPerm && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO: GERENCIAMENTO DE FILIAIS (Hospital Santa Marcelina) */}
      <div className={`p-6 rounded-2xl border shadow-sm transition-all duration-200 mt-8
        ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-500" />
              Módulo de Filiais (Santa Marcelina)
            </h2>
            <p className="text-xs text-slate-400">
              Cadastre e gerencie as filiais ativas do complexo de laboratórios do Hospital Santa Marcelina.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cadastro de nova filial */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500">Cadastrar Nova Filial</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newBranchName.trim() || !newBranchCnpj.trim() || !newBranchAddress.trim()) {
                alert('Por favor, preencha todos os campos da filial.');
                return;
              }
              if (onAddBranch) {
                onAddBranch({
                  name: newBranchName.trim(),
                  cnpj: newBranchCnpj.trim(),
                  address: newBranchAddress.trim()
                });
                setNewBranchName('');
                setNewBranchCnpj('');
                setNewBranchAddress('');
                setSaveBranchSuccess(true);
                setTimeout(() => setSaveBranchSuccess(false), 4000);
              }
            }} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase mb-1 opacity-80">Nome da Filial</label>
                <input
                  type="text"
                  required
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="Ex: São Miguel"
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                    ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase mb-1 opacity-80">CNPJ</label>
                <input
                  type="text"
                  required
                  value={newBranchCnpj}
                  onChange={(e) => setNewBranchCnpj(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                    ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase mb-1 opacity-80">Endereço</label>
                <input
                  type="text"
                  required
                  value={newBranchAddress}
                  onChange={(e) => setNewBranchAddress(e.target.value)}
                  placeholder="Ex: Av. Pires do Rio, 123 - São Miguel Paulista"
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                    ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>

              {saveBranchSuccess && (
                <div className="p-2 text-xs rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-1.5 font-semibold">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Filial cadastrada com sucesso!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Adicionar Filial
              </button>
            </form>
          </div>

          {/* Lista de filiais */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Filiais Ativas</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {branches.map(branch => (
                <div 
                  key={branch.id} 
                  className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition-all
                    ${isDarkMode ? 'bg-slate-800/20 border-slate-800' : 'bg-white border-slate-200'}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-xs">{branch.name}</h4>
                      {branch.id !== 'branch-1' && onDeleteBranch && (
                        <button
                          onClick={() => {
                            if (confirm(`Tem certeza que deseja remover a filial "${branch.name}"? Todos os usuários associados precisarão ser realocados.`)) {
                              onDeleteBranch(branch.id);
                            }
                          }}
                          className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
                          title="Remover filial"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">CNPJ: {branch.cnpj}</p>
                  </div>
                  <div className="flex items-start gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                    <span className="line-clamp-2">{branch.address}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
