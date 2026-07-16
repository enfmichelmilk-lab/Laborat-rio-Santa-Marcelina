/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Collaborator, Branch } from '../types';
import { 
  UserPlus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  Phone, 
  User, 
  Users, 
  Mail, 
  Hash, 
  FolderGit, 
  AlertCircle,
  Check,
  Search,
  MessageSquare
} from 'lucide-react';

interface CollaboratorRequestProps {
  collaborators: Collaborator[];
  onAddRequest: (colab: Omit<Collaborator, 'id' | 'requestedAt' | 'status'>) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isDarkMode: boolean;
  isAdmin: boolean;
  onLoginPrompt: () => void;
  branches?: Branch[];
}

export default function CollaboratorRequest({
  collaborators,
  onAddRequest,
  onApprove,
  onReject,
  isDarkMode,
  isAdmin,
  onLoginPrompt,
  branches = []
}: CollaboratorRequestProps) {
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sector, setSector] = useState('Bioquímica');
  const [registrationId, setRegistrationId] = useState('');
  const [filial, setFilial] = useState(branches.length > 0 ? branches[0].name : 'Itaquera (Sede)');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  // Manager Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // WhatsApp Send Modal State
  const [showWaModal, setShowWaModal] = useState(false);
  const [selectedColab, setSelectedColab] = useState<Collaborator | null>(null);
  const [waCustomMessage, setWaCustomMessage] = useState('');

  const sectors = [
    'Bioquímica',
    'Microbiologia',
    'Hematologia',
    'Imunologia',
    'Urinálise',
    'Parasitologia',
    'Controle de Qualidade',
    'Recepção & Triagem'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !whatsapp.trim() || !registrationId.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Basic WhatsApp validation
    const digitsOnly = whatsapp.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setError('Por favor, insira um número de WhatsApp válido com DDD (ex: 11999999999).');
      return;
    }

    onAddRequest({
      fullName,
      email,
      whatsapp: digitsOnly.startsWith('55') ? digitsOnly : `55${digitsOnly}`,
      sector,
      registrationId,
      filial
    });

    setSubmitSuccess(true);
    // Reset form
    setFullName('');
    setEmail('');
    setWhatsapp('');
    setRegistrationId('');

    // Clear success message after 5 seconds
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 5000);
  };

  const handleOpenWaModal = (colab: Collaborator) => {
    setSelectedColab(colab);
    const msg = `Olá *${colab.fullName}*! Seu cadastro no sistema *LabControl* foi aprovado com sucesso pelo Gestor. 🎉\n\n📌 *Setor:* ${colab.sector}\n🔑 *Matrícula:* ${colab.registrationId}\n\nAgora você já pode acessar o laboratório e registrar suas atividades no sistema. Seja bem-vindo(a) à nossa equipe!`;
    setWaCustomMessage(msg);
    setShowWaModal(true);
  };

  const handleSendWhatsApp = () => {
    if (!selectedColab) return;
    const phone = selectedColab.whatsapp;
    const encodedText = encodeURIComponent(waCustomMessage);
    const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
    window.open(waUrl, '_blank');
    setShowWaModal(false);
  };

  // Filtered Collaborators
  const filteredCollaborators = collaborators.filter(colab => {
    const matchesSearch = colab.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          colab.registrationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          colab.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || colab.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = collaborators.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Aprovações & Cadastro</h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Gerenciamento de solicitações de colaboradores e liberação de acessos do laboratório.
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-semibold
            ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{pendingCount} Pendentes</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Register Request Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-6 rounded-2xl border shadow-sm transition-all duration-200
            ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-indigo-500 text-white">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Solicitar Cadastro</h2>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Insira seus dados para aprovação do gestor
                </p>
              </div>
            </div>

            {submitSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-semibold block">Solicitação Enviada!</span>
                  Seus dados foram cadastrados e estão aguardando aprovação do gestor.
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                  Nome Completo <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Dra. Helena Martins"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all
                      ${isDarkMode ? 'bg-slate-800/40 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                  E-mail Funcional <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome.sobrenome@hospital.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all
                      ${isDarkMode ? 'bg-slate-800/40 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  />
                </div>
              </div>

              {/* WhatsApp & ID Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Whatsapp */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                    WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="DDD + Número"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all
                        ${isDarkMode ? 'bg-slate-800/40 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                    />
                  </div>
                </div>

                {/* Registry ID */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                    Matrícula <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={registrationId}
                      onChange={(e) => setRegistrationId(e.target.value)}
                      placeholder="Ex: MT-2026"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all
                        ${isDarkMode ? 'bg-slate-800/40 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                    />
                  </div>
                </div>
              </div>

              {/* Sector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                  Setor do Laboratório
                </label>
                <div className="relative">
                  <FolderGit className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer
                      ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                  >
                    {sectors.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filial */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                  Filial do Laboratório <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-mono">F</span>
                  <select
                    value={filial}
                    onChange={(e) => setFilial(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer
                      ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
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

              {/* Submit Button */}
              <button
                type="submit"
                id="submit-registration-request-btn"
                className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Solicitar Acesso</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Manager List and Approvals */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`p-6 rounded-2xl border shadow-sm transition-all duration-200
            ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  Painel do Gestor
                </h2>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Aprove cadastros e envie a confirmação por WhatsApp
                </p>
              </div>

              {!isAdmin && (
                <button
                  id="manager-panel-unlock-btn"
                  onClick={onLoginPrompt}
                  className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:hover:bg-indigo-950 dark:text-indigo-400 font-semibold px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
                >
                  Liberar Painel (Login)
                </button>
              )}
            </div>

            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome, matrícula, email..."
                  className={`w-full pl-9 pr-4 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all
                    ${isDarkMode ? 'bg-slate-800/40 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                  <button
                    id={`filter-btn-${status}`}
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all shrink-0 capitalize cursor-pointer
                      ${statusFilter === status 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : (isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-600 hover:text-slate-900')}`}
                  >
                    {status === 'all' && 'Todos'}
                    {status === 'pending' && 'Pendentes'}
                    {status === 'approved' && 'Aprovados'}
                    {status === 'rejected' && 'Recusados'}
                  </button>
                ))}
              </div>
            </div>

            {/* Collaborators List */}
            {!isAdmin ? (
              <div className={`p-8 rounded-xl border text-center space-y-3
                ${isDarkMode ? 'bg-slate-800/20 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <AlertCircle className="w-10 h-10 text-indigo-500 mx-auto opacity-75" />
                <div className="max-w-md mx-auto">
                  <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Acesso Restrito ao Gestor</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Como você está navegando no modo público, as ações de aprovação e envio de WhatsApp estão bloqueadas. Clique no botão de login para liberar como Gestor.
                  </p>
                  <button
                    id="manager-login-now-btn"
                    onClick={onLoginPrompt}
                    className="mt-4 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Fazer Login de Gestor
                  </button>
                </div>
              </div>
            ) : filteredCollaborators.length === 0 ? (
              <div className="p-12 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-slate-400">
                <Users className="w-8 h-8 mx-auto opacity-50 mb-2" />
                <p className="text-xs">Nenhuma solicitação encontrada para o filtro selecionado.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCollaborators.map((colab) => (
                  <div
                    id={`colab-card-${colab.id}`}
                    key={colab.id}
                    className={`p-4 rounded-xl border transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4
                      ${isDarkMode ? 'bg-slate-800/40 border-slate-800/80 hover:bg-slate-800/70' : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'}`}
                  >
                    {/* Collaborator Details */}
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 uppercase
                        ${colab.status === 'approved' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : colab.status === 'rejected'
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-amber-500/10 text-amber-500'}`}>
                        {colab.fullName.charAt(0)}
                      </div>
                      
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{colab.fullName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase
                            ${colab.status === 'approved' 
                              ? 'bg-emerald-500/15 text-emerald-500 dark:bg-emerald-500/10' 
                              : colab.status === 'rejected'
                                ? 'bg-rose-500/15 text-rose-500 dark:bg-rose-500/10'
                                : 'bg-amber-500/15 text-amber-500 dark:bg-amber-500/10'}`}>
                            {colab.status === 'approved' && 'Aprovado'}
                            {colab.status === 'rejected' && 'Recusado'}
                            {colab.status === 'pending' && 'Pendente'}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-medium text-slate-700 dark:text-slate-300">Setor: {colab.sector}</span>
                          {colab.filial && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Filial: {colab.filial}</span>
                            </>
                          )}
                          <span className="hidden sm:inline">•</span>
                          <span>Matrícula: <strong className="font-mono">{colab.registrationId}</strong></span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-400">
                          <span>{colab.email}</span>
                          <span>•</span>
                          <span>WhatsApp: {colab.whatsapp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                      {colab.status === 'pending' && (
                        <>
                          <button
                            id={`approve-btn-${colab.id}`}
                            onClick={() => onApprove(colab.id)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 transition-colors cursor-pointer"
                            title="Aprovar Cadastro"
                          >
                            <Check className="w-4.5 h-4.5" />
                          </button>
                          <button
                            id={`reject-btn-${colab.id}`}
                            onClick={() => onReject(colab.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                            title="Recusar Cadastro"
                          >
                            <XCircle className="w-4.5 h-4.5" />
                          </button>
                        </>
                      )}

                      {colab.status === 'approved' && (
                        <button
                          id={`whatsapp-send-btn-${colab.id}`}
                          onClick={() => handleOpenWaModal(colab)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Enviar WhatsApp</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Modal Dialog (Simulated UI pop-up before actual window.open) */}
      {showWaModal && selectedColab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative animate-fade-in
            ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
            
            <button
              onClick={() => setShowWaModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500 text-white">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Enviar Notificação de Cadastro</h3>
                <p className="text-xs text-slate-500">Confirmando matrícula e liberação de acessos</p>
              </div>
            </div>

            <div className="space-y-3 my-4">
              <div className="text-xs font-medium">
                <span className="text-slate-500">Destinatário:</span>{' '}
                <strong className="text-slate-800 dark:text-slate-200">
                  {selectedColab.fullName} ({selectedColab.whatsapp})
                </strong>
              </div>

              {/* Message edit area */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Mensagem Formatada (Suporta Negrito com *)
                </label>
                <textarea
                  value={waCustomMessage}
                  onChange={(e) => setWaCustomMessage(e.target.value)}
                  rows={6}
                  className={`w-full p-3 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-sans leading-relaxed
                    ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-600 dark:text-emerald-400 flex items-start gap-2 leading-tight">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>
                  Isso abrirá a API oficial do WhatsApp Web ou WhatsApp App pré-carregada com essa mensagem para o destinatário selecionado. Você só precisará clicar em enviar no WhatsApp.
                </span>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-3 border-t border-inherit">
              <button
                onClick={() => setShowWaModal(false)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer
                  ${isDarkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}
              >
                Cancelar
              </button>
              
              <button
                onClick={handleSendWhatsApp}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirmar e Abrir WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
