/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Beaker, Mail, Lock, ShieldAlert, ArrowRight, UserPlus, AlertCircle } from 'lucide-react';

import { AdminUser, Branch } from '../types';

interface LoginProps {
  onLoginSuccess: (email: string, role: 'Gestor' | 'Analista' | 'Técnico', name: string, filial?: string) => void;
  onOpenPublicRequest: () => void;
  isDarkMode: boolean;
  adminUsers?: AdminUser[];
  branches?: Branch[];
}

export default function Login({
  onLoginSuccess,
  onOpenPublicRequest,
  isDarkMode,
  adminUsers = [],
  branches = []
}: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Lookup user in the adminUsers list (Firebase synchronized state)
    const foundUser = adminUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (foundUser) {
      onLoginSuccess(foundUser.email, foundUser.role, foundUser.name, foundUser.filial || 'Itaquera (Sede)');
      return;
    }

    // Default fallback credential validation for demo
    if (email === 'admin@laboratorio.com') {
      onLoginSuccess('admin@laboratorio.com', 'Gestor', 'Dr. Michel Leite (Gestor)', 'Itaquera (Sede)');
    } else if (email === 'beatriz@laboratorio.com') {
      onLoginSuccess('beatriz@laboratorio.com', 'Analista', 'Beatriz Vasconcelos', 'Cachoeirinha');
    } else if (email === 'lucas@laboratorio.com') {
      onLoginSuccess('lucas@laboratorio.com', 'Técnico', 'Lucas Guedes', 'São Miguel');
    } else {
      setError('Usuário não cadastrado ou senha incorreta. Use os botões de atalho rápido de teste abaixo!');
    }
  };

  const handleShortcutLogin = (shortcutEmail: string, role: 'Gestor' | 'Analista' | 'Técnico', name: string) => {
    setEmail(shortcutEmail);
    setPassword('••••••••');
    
    // Find registered filial in adminUsers if exists, else fall back to a default
    const foundUser = adminUsers.find(u => u.email.toLowerCase() === shortcutEmail.toLowerCase());
    const filial = foundUser?.filial || (shortcutEmail === 'admin@laboratorio.com' ? 'Itaquera (Sede)' : shortcutEmail === 'beatriz@laboratorio.com' ? 'Cachoeirinha' : 'São Miguel');
    
    onLoginSuccess(shortcutEmail, role, name, filial);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-300
      ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      <div className="w-full max-w-md space-y-6">
        
        {/* Logo and Greeting Header */}
        <div className="text-center space-y-2 select-none">
          <div className="inline-flex p-4 rounded-3xl bg-white shadow-xl border border-slate-200/80 mb-3 justify-center items-center">
            <svg className="w-16 h-16" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' fill='none'>
              <rect x='35' y='45' width='12' height='12' fill='#8fa9c4' opacity='0.7'/>
              <rect x='73' y='45' width='12' height='12' fill='#8fa9c4' opacity='0.7'/>
              <rect x='54' y='26' width='12' height='12' fill='#8fa9c4' opacity='0.7'/>
              <rect x='54' y='64' width='12' height='12' fill='#8fa9c4' opacity='0.7'/>
              <path d='M41 33 H31 V57 H41 M79 33 H89 V57 H79 M41 69 V81 H79 V69' stroke='#003b73' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/>
              <path d='M60 81 L60 41 M60 41 L50 49 L53 54 L60 48 L67 54 L70 49 Z' fill='#003b73'/>
              <path d='M60 38 L54 44 M60 38 L66 44 M60 34 V38' stroke='#003b73' stroke-width='2' stroke-linecap='round'/>
              <circle cx='54' cy='44' r='1.5' fill='#003b73'/>
              <circle cx='66' cy='44' r='1.5' fill='#003b73'/>
              <circle cx='60' cy='34' r='1.5' fill='#003b73'/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Laboratório Hospital Santa Marcelina</h1>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Sistema Integrado para Controle e Análise de Laboratórios Clínicos
          </p>
        </div>

        {/* Login Form Box */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all duration-200
          ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          
          <h2 className="font-bold text-lg mb-1">Acesso Administrativo</h2>
          <p className={`text-xs mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Acesse para gerenciar estoque, calibrar equipamentos e analisar dados.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 opacity-80">
                E-mail Administrativo
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@laboratorio.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all
                    ${isDarkMode ? 'bg-slate-800/40 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider opacity-80">
                  Senha de Acesso
                </label>
                <span className="text-[10px] text-indigo-500 hover:underline cursor-pointer">Esqueceu?</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all
                    ${isDarkMode ? 'bg-slate-800/40 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="admin-login-submit-btn"
              className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-md cursor-pointer"
            >
              <span>Acessar Painel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Public register form shortcut link */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
            <span className="text-[11px] text-slate-400 block">Não tem acesso como colaborador ainda?</span>
            <button
              id="login-request-access-shortcut-btn"
              onClick={onOpenPublicRequest}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Solicitar Cadastro de Colaborador</span>
            </button>
          </div>
        </div>

        {/* Premium feature: Interactive shortcut logins for demo simplicity */}
        <div className={`p-5 rounded-2xl border text-center space-y-3 shadow-md
          ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <ShieldAlert className="w-4 h-4 text-indigo-500" />
            <span>Atalhos Rápidos de Teste (Clique para Entrar)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              id="shortcut-login-gestor"
              onClick={() => handleShortcutLogin('admin@laboratorio.com', 'Gestor', 'Dr. Michel Leite (Gestor)')}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center
                ${isDarkMode ? 'bg-slate-800/40 border-slate-700 hover:bg-slate-800' : 'bg-indigo-50/50 border-indigo-100 hover:bg-indigo-50'}`}
            >
              <span className="block text-[9px] text-indigo-500 uppercase tracking-widest font-bold">Gestor</span>
              <span className="truncate block font-semibold">Dr. Michel</span>
            </button>

            <button
              id="shortcut-login-analista"
              onClick={() => handleShortcutLogin('beatriz@laboratorio.com', 'Analista', 'Beatriz Vasconcelos')}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center
                ${isDarkMode ? 'bg-slate-800/40 border-slate-700 hover:bg-slate-800' : 'bg-indigo-50/50 border-indigo-100 hover:bg-indigo-50'}`}
            >
              <span className="block text-[9px] text-indigo-500 uppercase tracking-widest font-bold">Analista</span>
              <span className="truncate block font-semibold">Beatriz V.</span>
            </button>

            <button
              id="shortcut-login-tecnico"
              onClick={() => handleShortcutLogin('lucas@laboratorio.com', 'Técnico', 'Lucas Guedes')}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center
                ${isDarkMode ? 'bg-slate-800/40 border-slate-700 hover:bg-slate-800' : 'bg-indigo-50/50 border-indigo-100 hover:bg-indigo-50'}`}
            >
              <span className="block text-[9px] text-indigo-500 uppercase tracking-widest font-bold">Técnico</span>
              <span className="truncate block font-semibold">Lucas G.</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
