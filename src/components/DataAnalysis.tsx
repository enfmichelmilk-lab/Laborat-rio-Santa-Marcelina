/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  TrendingUp, 
  Activity, 
  BellRing, 
  PhoneCall, 
  Printer, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight, 
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { SystemSettings } from '../types';

interface DataAnalysisProps {
  isDarkMode: boolean;
  settings: SystemSettings;
  images: { logo: string; stamp: string; signature: string };
}

interface CriticalLog {
  id: string;
  patientName: string;
  exam: string;
  value: string;
  reference: string;
  alertType: 'critical_high' | 'critical_low';
  requestedBy: string;
  status: 'pending' | 'notified';
  notifiedAt?: string;
  notifiedWho?: string;
}

export default function DataAnalysis({
  isDarkMode,
  settings,
  images
}: DataAnalysisProps) {
  // Critical alerts state
  const [criticalLogs, setCriticalLogs] = useState<CriticalLog[]>([
    {
      id: 'log-1',
      patientName: 'Sebastião Carlos Pereira',
      exam: 'Potássio Sérico',
      value: '7.2 mEq/L',
      reference: '3.5 - 5.1 mEq/L',
      alertType: 'critical_high',
      requestedBy: 'Dra. Helena Martins',
      status: 'pending'
    },
    {
      id: 'log-2',
      patientName: 'Maria Eduarda Menezes',
      exam: 'Hemoglobina',
      value: '5.8 g/dL',
      reference: '12.0 - 15.5 g/dL',
      alertType: 'critical_low',
      requestedBy: 'Dr. Roberto Santos',
      status: 'notified',
      notifiedAt: '2026-07-16 10:15',
      notifiedWho: 'Enf. Joana - UTI 03'
    },
    {
      id: 'log-3',
      patientName: 'Geraldo Alencar',
      exam: 'Glicemia de Jejum',
      value: '42 mg/dL',
      reference: '70 - 99 mg/dL',
      alertType: 'critical_low',
      requestedBy: 'Dra. Helena Martins',
      status: 'pending'
    },
    {
      id: 'log-4',
      patientName: 'Amanda Regina Souza',
      exam: 'Plaquetas',
      value: '22.000 /mm³',
      reference: '150.000 - 450.000 /mm³',
      alertType: 'critical_low',
      requestedBy: 'Dr. Roberto Santos',
      status: 'notified',
      notifiedAt: '2026-07-15 14:40',
      notifiedWho: 'Dr. Lucas (Plantão Pronto Socorro)'
    },
    {
      id: 'log-5',
      patientName: 'Carlos Henrique Filho',
      exam: 'Troponina T',
      value: '1.45 ng/mL',
      reference: '&lt; 0.014 ng/mL',
      alertType: 'critical_high',
      requestedBy: 'Dr. Roberto Santos',
      status: 'pending'
    }
  ]);

  const [notificationWho, setNotificationWho] = useState('');
  const [activeLogId, setActiveLogId] = useState<string | null>(null);

  // Statistics
  const examVolumeData = [
    { month: 'Jan', count: 1200 },
    { month: 'Fev', count: 1350 },
    { month: 'Mar', count: 1580 },
    { month: 'Abr', count: 1420 },
    { month: 'Mai', count: 1690 },
    { month: 'Jun', count: 1850 },
    { month: 'Jul', count: 1980 }
  ];

  const sectorMetrics = [
    { name: 'Bioquímica', count: 850, pct: '43%' },
    { name: 'Hematologia', count: 520, pct: '26%' },
    { name: 'Microbiologia', count: 310, pct: '16%' },
    { name: 'Imunologia', count: 300, pct: '15%' }
  ];

  const handleNotifyDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLogId || !notificationWho.trim()) return;

    const todayStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toLocaleDateString('pt-BR') + ' ' + todayStr;

    setCriticalLogs(prev => prev.map(log => {
      if (log.id === activeLogId) {
        return {
          ...log,
          status: 'notified',
          notifiedAt: dateStr,
          notifiedWho: notificationWho
        };
      }
      return log;
    }));

    setNotificationWho('');
    setActiveLogId(null);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const pendingNotifs = criticalLogs.filter(l => l.status === 'pending').length;

  return (
    <div className="space-y-8">
      {/* Print-only template (hidden in screen, shown on print via @media print in global css or styles) */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-document, #print-document * {
            visibility: visible;
          }
          #print-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {/* Screen Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Análise Crítica de Dados</h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Indicadores de controle de qualidade, log de valores críticos de pacientes e emissão de impressos.
          </p>
        </div>

        <button
          id="print-qc-report-btn"
          onClick={handlePrintReport}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Relatório Mensal</span>
        </button>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Volume de Exames (Julho)</span>
            <strong className="text-xl font-bold">1.980 exames</strong>
            <span className="text-[10px] text-emerald-500 font-semibold block flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +7.02% vs mês anterior
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className={`p-3 rounded-lg ${pendingNotifs > 0 ? 'bg-rose-500/10 text-rose-500 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Valores de Pânico Pendentes</span>
            <strong className="text-xl font-bold text-rose-500">{pendingNotifs} Alertas</strong>
            <span className="text-[10px] text-slate-400 block font-medium">Contatar médico solicitante imediatamente</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Meta de Qualidade (TAT)</span>
            <strong className="text-xl font-bold text-emerald-500">98.4%</strong>
            <span className="text-[10px] text-slate-400 block font-medium">Tempo de retorno dentro da meta</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Exam Volume Chart */}
        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            Volumetria Mensal de Exames (2026)
          </h3>
          
          {/* Custom SVG Line and Bar Chart */}
          <div className="relative h-64 w-full flex items-end justify-between px-4 pt-8">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10 py-8">
              <div className="border-b border-slate-500 w-full"></div>
              <div className="border-b border-slate-500 w-full"></div>
              <div className="border-b border-slate-500 w-full"></div>
              <div className="border-b border-slate-500 w-full"></div>
            </div>

            {examVolumeData.map((data, idx) => {
              const heightPct = (data.count / 2000) * 100;
              return (
                <div key={data.month} className="flex flex-col items-center gap-2 flex-1 group">
                  {/* Tooltip value */}
                  <span className="opacity-0 group-hover:opacity-100 bg-slate-950 text-white font-mono text-[10px] px-1.5 py-0.5 rounded absolute -translate-y-8 transition-opacity z-10">
                    {data.count}
                  </span>
                  
                  {/* Bar */}
                  <div 
                    style={{ height: `${heightPct}%` }}
                    className="w-8 sm:w-12 bg-indigo-500/20 hover:bg-indigo-500 rounded-t-lg transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"></div>
                  </div>
                  
                  <span className="text-xs font-semibold text-slate-400">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sector distribution */}
        <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            Distribuição de Produtividade por Setor
          </h3>

          <div className="space-y-4 pt-2">
            {sectorMetrics.map(sector => (
              <div key={sector.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{sector.name}</span>
                  <span className="text-indigo-500">{sector.count} exames ({sector.pct})</span>
                </div>
                
                {/* Custom Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    style={{ width: sector.pct }}
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Alarms Log (Valores de Alerta) */}
      <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500 animate-bounce" />
              Notificação de Valores Críticos (Resultado de Pânico)
            </h3>
            <p className="text-xs text-slate-400">
              Controle obrigatório de notificação imediata do corpo clínico para segurança do paciente.
            </p>
          </div>
        </div>

        {/* Alerts table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">Exame</th>
                <th className="py-3 px-4 text-right">Resultado Crítico</th>
                <th className="py-3 px-4">Valores Referência</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {criticalLogs.map((log) => {
                const isHigh = log.alertType === 'critical_high';
                return (
                  <tr 
                    id={`critical-row-${log.id}`}
                    key={log.id} 
                    className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                  >
                    <td className="py-4 px-4">
                      <div className="font-bold">{log.patientName}</div>
                      <div className="text-[10px] text-slate-400">Solicitado por: {log.requestedBy}</div>
                    </td>
                    <td className="py-4 px-4 font-medium">{log.exam}</td>
                    <td className="py-4 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 font-bold font-mono px-2 py-0.5 rounded-lg text-xs
                        ${isHigh 
                          ? 'bg-rose-500/10 text-rose-500' 
                          : 'bg-orange-500/10 text-orange-500'}`}>
                        {isHigh ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {log.value}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-400" dangerouslySetInnerHTML={{ __html: log.reference }}></td>
                    <td className="py-4 px-4">
                      {log.status === 'notified' ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" /> Notificado
                          </span>
                          <div className="text-[9px] text-slate-400">{log.notifiedWho}</div>
                          <div className="text-[9px] text-slate-400">{log.notifiedAt}</div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-500/15 text-rose-500 px-2 py-0.5 rounded-full animate-pulse">
                          <AlertCircle className="w-3 h-3" /> Pendente
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {log.status === 'pending' ? (
                        <button
                          id={`notify-btn-${log.id}`}
                          onClick={() => {
                            setActiveLogId(log.id);
                          }}
                          className="flex items-center gap-1 text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold px-2.5 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer ml-auto"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Notificar</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[10px] font-medium block">Concluído</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notify Doctor Form Modal (Active only when activeLogId is set) */}
      {activeLogId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl relative
            ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
            
            <button
              onClick={() => setActiveLogId(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <AlertCircle className="w-5 h-5 text-slate-400" />
            </button>

            <h3 className="font-bold text-base mb-2 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-indigo-500" />
              Registrar Notificação de Pânico
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Ao avisar o médico ou enfermeiro responsável por telefone ou crachá, registre os dados abaixo para auditoria.
            </p>

            <form onSubmit={handleNotifyDoctorSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase mb-1.5 text-slate-500">Quem recebeu a notificação? *</label>
                <input
                  type="text"
                  required
                  value={notificationWho}
                  onChange={(e) => setNotificationWho(e.target.value)}
                  placeholder="Ex: Enf. Cláudia - 4º Andar Quarto 402"
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                    ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveLogId(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer
                    ${isDarkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="confirm-notification-btn"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Confirmar Notificação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Elegant, printable certificate layout container (hidden on screen, visible on window.print()) */}
      <div 
        id="print-document" 
        className="hidden p-12 bg-white text-slate-900 border-[12px] border-slate-100 max-w-4xl mx-auto space-y-8 font-sans"
      >
        {/* Document Header with custom or default loaded images */}
        <div className="flex justify-between items-center border-b pb-6 border-slate-300">
          <div className="flex items-center gap-4">
            {settings.showLogoOnReports && images.logo && (
              <img 
                src={images.logo} 
                alt="Logo do Laboratório" 
                className="w-16 h-16 object-contain"
                referrerPolicy="no-referrer"
              />
            )}
            <div>
              <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{settings.labName}</h1>
              <p className="text-xs text-slate-500">{settings.address}</p>
              <p className="text-xs text-slate-500 font-mono">CNPJ: {settings.cnpj}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-md uppercase tracking-wider">
              Laudo de Controle
            </span>
            <p className="text-[10px] text-slate-400 mt-1">Data: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center space-y-2 py-4">
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-widest">Relatório Mensal de Controle de Qualidade</h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Este impresso documenta a produtividade mensal e as notificações de segurança críticas efetuadas pelo nosso laboratório, em conformidade com as diretrizes do Programa de Controle de Qualidade.
          </p>
        </div>

        {/* Quality Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 border p-4 rounded-xl bg-slate-50/50">
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Exames Realizados</span>
            <strong className="text-base text-slate-800">{examVolumeData.reduce((acc, curr) => acc + curr.count, 0)} exames totais</strong>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Taxa de Resolução de Alertas Críticos</span>
            <strong className="text-base text-emerald-600">100% de contato efetuado</strong>
          </div>
        </div>

        {/* Quality signatures row */}
        <div className="flex justify-between items-end pt-12">
          {/* Left signature/stamp */}
          <div className="text-center space-y-2">
            {settings.showStampOnReports && images.stamp && (
              <img 
                src={images.stamp} 
                alt="Carimbo de Aprovação" 
                className="w-20 h-20 mx-auto object-contain"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="border-t border-slate-300 w-44 pt-1.5 mx-auto">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Carimbo Oficial</span>
            </div>
          </div>

          {/* Right signature */}
          <div className="text-center space-y-2">
            {images.signature && (
              <img 
                src={images.signature} 
                alt="Assinatura Digital" 
                className="w-28 h-10 mx-auto object-contain"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="border-t border-slate-300 w-44 pt-1.5 mx-auto">
              <span className="text-[9px] text-slate-700 block font-semibold leading-none">Dr. Michel Leite</span>
              <span className="text-[8px] text-slate-400 block uppercase">Diretor Gestor do Laboratório</span>
            </div>
          </div>
        </div>

        {/* Footer print note */}
        <div className="text-center text-[9px] text-slate-400 border-t pt-4">
          Gerado eletronicamente em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}
