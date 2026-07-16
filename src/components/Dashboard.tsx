/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Beaker, 
  Database, 
  ClipboardCheck, 
  UserCheck, 
  BellRing, 
  CheckSquare, 
  Calendar, 
  HelpCircle,
  Thermometer,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  user: { name: string; email: string; role: string };
  isDarkMode: boolean;
  lowStockCount: number;
  calibOverdueCount: number;
  pendingColabCount: number;
  criticalAlarmsCount: number;
  setCurrentTab: (tab: string) => void;
}

interface RoutineTask {
  id: string;
  task: string;
  time: string;
  checked: boolean;
}

export default function Dashboard({
  user,
  isDarkMode,
  lowStockCount,
  calibOverdueCount,
  pendingColabCount,
  criticalAlarmsCount,
  setCurrentTab
}: DashboardProps) {
  // Routine daily tasks state
  const [tasks, setTasks] = useState<RoutineTask[]>([
    { id: 't-1', task: 'Registrar temperatura da geladeira de reagentes (Geladeira 01 & 02)', time: '08:00', checked: true },
    { id: 't-2', task: 'Realizar controle de qualidade diário (CQ) do analisador de hematologia', time: '08:30', checked: true },
    { id: 't-3', task: 'Verificar autoclave e calibragem dos banhos-maria', time: '09:00', checked: false },
    { id: 't-4', task: 'Limpeza de bancadas de trabalho e esterilização química', time: '12:00', checked: false },
    { id: 't-5', task: 'Triagem de novas amostras urgentes da UTI', time: '14:00', checked: false }
  ]);

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, checked: !t.checked };
      }
      return t;
    }));
  };

  const completedCount = tasks.filter(t => t.checked).length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-8">
      {/* Visual greeting card */}
      <div className={`p-6 md:p-8 rounded-3xl border shadow-xs relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6
        ${isDarkMode 
          ? 'bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border-slate-800' 
          : 'bg-gradient-to-r from-indigo-50 via-white to-white border-slate-200'}`}>
        
        {/* Background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-500">
            <Zap className="w-3.5 h-3.5 fill-indigo-500" />
            <span>SISTEMA ATIVO</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Olá, <span className="text-indigo-500">{user.name.split(' ')[0]}</span>!
          </h2>
          <p className={`text-xs md:text-sm max-w-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Seu perfil é <strong className="font-semibold">{user.role}</strong>. O painel está atualizado com as estatísticas em tempo real do laboratório para o dia de hoje.
          </p>
        </div>

        {/* Temperature Monitor Widget (Realistic element) */}
        <div className={`p-4 rounded-2xl border flex items-center gap-4 shrink-0 relative
          ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
            <Thermometer className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Sensores de Temp.</span>
            <strong className="text-sm font-mono block">Geladeira 1: +4.2 ºC</strong>
            <span className="text-[10px] text-emerald-500 font-bold block flex items-center gap-0.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Sob controle
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Alert Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Low Stock Tile */}
        <button
          id="dashboard-stock-tile"
          onClick={() => setCurrentTab('inventory')}
          className={`p-5 rounded-2xl border text-left flex justify-between items-start transition-all duration-150 hover:shadow-md cursor-pointer group
            ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200'}`}
        >
          <div className="space-y-3">
            <div className={`p-3 rounded-xl inline-block ${lowStockCount > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estoque Crítico</span>
              <strong className="text-xl font-bold">{lowStockCount} itens baixos</strong>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        </button>

        {/* Machinery calibration Tile */}
        <button
          id="dashboard-equip-tile"
          onClick={() => setCurrentTab('equipment')}
          className={`p-5 rounded-2xl border text-left flex justify-between items-start transition-all duration-150 hover:shadow-md cursor-pointer group
            ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200'}`}
        >
          <div className="space-y-3">
            <div className={`p-3 rounded-xl inline-block ${calibOverdueCount > 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Aparelhos / Calibrações</span>
              <strong className="text-xl font-bold">{calibOverdueCount} pendências</strong>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        </button>

        {/* Pending Collaborators request Tile */}
        <button
          id="dashboard-colab-tile"
          onClick={() => setCurrentTab('collaborators')}
          className={`p-5 rounded-2xl border text-left flex justify-between items-start transition-all duration-150 hover:shadow-md cursor-pointer group
            ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200'}`}
        >
          <div className="space-y-3">
            <div className={`p-3 rounded-xl inline-block ${pendingColabCount > 0 ? 'bg-amber-500/10 text-amber-500 animate-pulse' : 'bg-indigo-500/10 text-indigo-500'}`}>
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Novas Liberações</span>
              <strong className="text-xl font-bold">{pendingColabCount} solicitações</strong>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        </button>

        {/* Clinical Alarms Tile */}
        <button
          id="dashboard-analysis-tile"
          onClick={() => setCurrentTab('analysis')}
          className={`p-5 rounded-2xl border text-left flex justify-between items-start transition-all duration-150 hover:shadow-md cursor-pointer group
            ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200'}`}
        >
          <div className="space-y-3">
            <div className={`p-3 rounded-xl inline-block ${criticalAlarmsCount > 0 ? 'bg-rose-500/10 text-rose-500 animate-bounce' : 'bg-indigo-500/10 text-indigo-500'}`}>
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resultados Críticos</span>
              <strong className="text-xl font-bold">{criticalAlarmsCount} pendentes</strong>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        </button>
      </div>

      {/* Bento Grid: Daily Checklist & Short Tutorial/Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Daily Checklist Routine */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border shadow-sm transition-all duration-200
          ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-base">Checklist de Rotina do Laboratório</h3>
            </div>
            
            {/* Progress meter */}
            <div className="text-right">
              <span className="text-xs font-semibold text-indigo-500">{progressPct}% concluído</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
            <div 
              style={{ width: `${progressPct}%` }}
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            ></div>
          </div>

          {/* Checklist interactive list */}
          <div className="space-y-3">
            {tasks.map(t => (
              <button
                id={`routine-task-btn-${t.id}`}
                key={t.id}
                onClick={() => handleToggleTask(t.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer
                  ${t.checked 
                    ? (isDarkMode ? 'bg-slate-800/20 border-slate-800 text-slate-400 line-through' : 'bg-slate-50 border-slate-200 text-slate-400 line-through')
                    : (isDarkMode ? 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 text-slate-100' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800')}`}
              >
                <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 mt-0.5
                  ${t.checked 
                    ? 'bg-indigo-500 border-indigo-500 text-white' 
                    : (isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-slate-50')}`}>
                  {t.checked && <CheckSquare className="w-3.5 h-3.5 fill-indigo-500 text-white" />}
                </div>

                <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold truncate leading-tight pr-1">{t.task}</span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium shrink-0">{t.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lab System Quick Start Guide */}
        <div className={`lg:col-span-5 p-6 rounded-2xl border shadow-sm transition-all duration-200 flex flex-col justify-between gap-6
          ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          
          <div className="space-y-3">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Guia Rápido do Usuário
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              O LabControl é otimizado para o cotidiano do laboratório clínico. Veja as diretrizes operacionais rápidas:
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <p className="text-slate-500 dark:text-slate-400 leading-normal">
                  <strong className="text-slate-700 dark:text-slate-300">Novos Cadastros:</strong> Compartilhe o link de solicitação com colaboradores. Gestores aprovam na aba dedicada e notificam pelo botão verde de WhatsApp.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <p className="text-slate-500 dark:text-slate-400 leading-normal">
                  <strong className="text-slate-700 dark:text-slate-300">Calibragem Periódica:</strong> Mantenha o status dos aparelhos em dia. O sistema calcula automaticamente prazos inferiores a 30 dias.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                <p className="text-slate-500 dark:text-slate-400 leading-normal">
                  <strong className="text-slate-700 dark:text-slate-300">Resultados de Pânico:</strong> Todo valor crítico exige notificação imediata do plantão médico. Registre o contato na aba de Análise Crítica.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-[10px] text-indigo-600 dark:text-indigo-400 flex items-center gap-2 font-semibold">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Precisa de suporte ou auditoria? Contate o Gestor Geral.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
