/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Beaker, 
  ChevronLeft, 
  ChevronRight, 
  ClipboardCheck, 
  Database, 
  FileSpreadsheet, 
  LogOut, 
  Moon, 
  Settings, 
  Sun, 
  UserCheck, 
  UserPlus, 
  Users 
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  user: { name: string; email: string; role: string } | null;
  logout: () => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  isCollapsed,
  setIsCollapsed,
  isDarkMode,
  toggleTheme,
  user,
  logout
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Beaker, adminOnly: false },
    { id: 'collaborators', label: 'Aprovações & Cadastro', icon: UserCheck, adminOnly: false },
    { id: 'inventory', label: 'Controle de Estoque', icon: Database, adminOnly: false },
    { id: 'equipment', label: 'Equipamentos', icon: ClipboardCheck, adminOnly: false },
    { id: 'analysis', label: 'Análise Crítica', icon: FileSpreadsheet, adminOnly: false },
    { id: 'settings', label: 'Configurações', icon: Settings, adminOnly: true }
  ];

  return (
    <aside 
      id="sidebar-container"
      className={`fixed top-0 left-0 z-30 h-screen border-r transition-all duration-300 ease-in-out flex flex-col justify-between
        ${isCollapsed ? 'w-16 md:w-20' : 'w-64'} 
        ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}
    >
      {/* Upper Brand Section */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-inherit">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-indigo-950 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
              <Beaker className="w-6 h-6" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col select-none animate-fade-in">
                <span className="font-bold text-sm tracking-wide leading-tight">LABCONTROL</span>
                <span className="text-[10px] text-indigo-500 font-medium">LABORATORY SYSTEM</span>
              </div>
            )}
          </div>
          
          <button 
            id="sidebar-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:flex p-1 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer
              ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentTab === item.id;
            
            // If user is not manager, hide settings (simulate permission)
            if (item.adminOnly && user?.role !== 'Gestor') {
              return null;
            }

            return (
              <button
                id={`sidebar-tab-btn-${item.id}`}
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer group relative
                  ${isActive 
                    ? (isDarkMode ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30' : 'bg-indigo-600 text-white shadow-md shadow-indigo-100') 
                    : (isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900')}`}
              >
                <IconComponent className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-inherit'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-16 md:left-20 scale-0 group-hover:scale-100 group-hover:translate-x-1 transition-all duration-150 origin-left bg-slate-950 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl pointer-events-none z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Settings, Dark Mode and Identity */}
      <div className="border-t border-inherit p-3 space-y-2">
        {/* Theme Selector */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
            ${isDarkMode ? 'text-amber-400 hover:bg-slate-800' : 'text-indigo-600 hover:bg-slate-50'}`}
        >
          {isDarkMode ? (
            <>
              <Sun className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="text-slate-300">Modo Claro</span>}
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="text-slate-600">Modo Escuro</span>}
            </>
          )}
          {isCollapsed && (
            <div className="absolute left-16 md:left-20 scale-0 hover:scale-100 group-hover:scale-100 transition-all origin-left bg-slate-950 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl pointer-events-none z-50">
              Alternar Tema
            </div>
          )}
        </button>

        {/* User Identity Info */}
        {user ? (
          <div className="flex flex-col gap-2 pt-2">
            {!isCollapsed ? (
              <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold truncate leading-tight">{user.name}</span>
                  <span className="text-[10px] text-slate-400 truncate">{user.role}</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                  {user.name.charAt(0)}
                </div>
              </div>
            )}

            <button
              id="logout-btn"
              onClick={logout}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer
                ${isDarkMode ? 'text-rose-400 hover:bg-rose-950/20' : 'text-rose-600 hover:bg-rose-50'}`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Sair</span>}
            </button>
          </div>
        ) : (
          <div className="text-center p-2 text-xs text-slate-400">
            {!isCollapsed && 'Acesso Visitante'}
          </div>
        )}
      </div>
    </aside>
  );
}
