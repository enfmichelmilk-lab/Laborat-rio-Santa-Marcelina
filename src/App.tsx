/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CollaboratorRequest from './components/CollaboratorRequest';
import InventoryControl from './components/InventoryControl';
import EquipmentControl from './components/EquipmentControl';
import DataAnalysis from './components/DataAnalysis';
import SettingsComponent from './components/Settings';

import { 
  Collaborator, 
  InventoryItem, 
  Equipment, 
  AdminUser, 
  SystemSettings,
  Branch
} from './types';

import { 
  INITIAL_COLLABORATORS, 
  INITIAL_INVENTORY, 
  INITIAL_EQUIPMENT, 
  INITIAL_ADMIN_USERS, 
  INITIAL_BRANCHES,
  DEFAULT_SETTINGS,
  DEFAULT_LOGO,
  DEFAULT_STAMP,
  DEFAULT_SIGNATURE
} from './data';

import { 
  db, 
  seedDatabaseIfEmpty, 
  subscribeToCollection, 
  subscribeToDoc 
} from './lib/firebase';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection 
} from 'firebase/firestore';

import { ShieldCheck, Beaker, LogIn, Lock, Users } from 'lucide-react';

export default function App() {
  // --- Theme State ---
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('labcontrol_dark_mode');
    return saved === 'true'; // Defaults to light mode if not set
  });

  // --- Session User State ---
  const [user, setUser] = useState<{ name: string; email: string; role: 'Gestor' | 'Analista' | 'Técnico'; filial?: string } | null>(() => {
    const saved = localStorage.getItem('labcontrol_session_user');
    return saved ? JSON.parse(saved) : null;
  });

  // --- Show Login Screen Gate ---
  const [showLoginScreen, setShowLoginScreen] = useState<boolean>(() => {
    const saved = localStorage.getItem('labcontrol_session_user');
    return saved ? false : true; // show login if no user session
  });

  // --- Tab/Routing State ---
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // --- Laboratory Core States (Synchronized with Firebase) ---
  const [collaborators, setCollaborators] = useState<Collaborator[]>(INITIAL_COLLABORATORS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [equipment, setEquipment] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [images, setImages] = useState<{ logo: string; stamp: string; signature: string }>({
    logo: DEFAULT_LOGO,
    stamp: DEFAULT_STAMP,
    signature: DEFAULT_SIGNATURE
  });

  // --- Theme and Local Storage Session Sync ---
  useEffect(() => {
    localStorage.setItem('labcontrol_dark_mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Firebase Real-time Synchronization ---
  useEffect(() => {
    // Seed standard mock database values on first boot if Firebase collections are empty
    seedDatabaseIfEmpty();

    // Listen to real-time updates from Firebase Online Database
    const unsubColab = subscribeToCollection<Collaborator>('collaborators', (data) => {
      const sorted = [...data].sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return b.requestedAt.localeCompare(a.requestedAt);
      });
      setCollaborators(sorted);
    });

    const unsubInventory = subscribeToCollection<InventoryItem>('inventory', (data) => {
      const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
      setInventory(sorted);
    });

    const unsubEquipment = subscribeToCollection<Equipment>('equipment', (data) => {
      const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
      setEquipment(sorted);
    });

    const unsubAdmins = subscribeToCollection<AdminUser>('admin_users', (data) => {
      const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
      setAdminUsers(sorted);
    });

    const unsubSettings = subscribeToDoc<SystemSettings>('settings', 'system_config', (data) => {
      if (data) setSettings(data);
    });

    const unsubImages = subscribeToDoc<{ logo: string; stamp: string; signature: string }>('settings', 'images', (data) => {
      if (data) setImages(data);
    });

    const unsubBranches = subscribeToCollection<Branch>('branches', (data) => {
      const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
      setBranches(sorted);
    });

    return () => {
      unsubColab();
      unsubInventory();
      unsubEquipment();
      unsubAdmins();
      unsubSettings();
      unsubImages();
      unsubBranches();
    };
  }, []);

  // --- Handlers ---
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLoginSuccess = (email: string, role: 'Gestor' | 'Analista' | 'Técnico', name: string, filial?: string) => {
    const sessionUser = { name, email, role, filial };
    setUser(sessionUser);
    localStorage.setItem('labcontrol_session_user', JSON.stringify(sessionUser));
    setShowLoginScreen(false);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('labcontrol_session_user');
    setShowLoginScreen(true);
  };

  const handleOpenPublicRequest = () => {
    setUser(null);
    localStorage.removeItem('labcontrol_session_user');
    setShowLoginScreen(false);
    setCurrentTab('collaborators');
  };

  // Collaborator Request Handlers
  const handleAddRequest = async (colabData: Omit<Collaborator, 'id' | 'requestedAt' | 'status'>) => {
    const today = new Date();
    const dateStr = today.toISOString().replace('T', ' ').substring(0, 16);
    const newId = `colab-${Date.now()}`;
    
    const newRequest: Collaborator = {
      id: newId,
      ...colabData,
      status: 'pending',
      requestedAt: dateStr
    };

    try {
      await setDoc(doc(db, 'collaborators', newId), newRequest);
    } catch (e) {
      console.error('Error adding collaborator request:', e);
    }
  };

  const handleApproveCollaborator = async (id: string) => {
    const today = new Date();
    const dateStr = today.toISOString().replace('T', ' ').substring(0, 16);

    try {
      await updateDoc(doc(db, 'collaborators', id), {
        status: 'approved',
        approvedAt: dateStr
      });
    } catch (e) {
      console.error('Error approving collaborator:', e);
    }
  };

  const handleRejectCollaborator = async (id: string) => {
    try {
      await updateDoc(doc(db, 'collaborators', id), {
        status: 'rejected'
      });
    } catch (e) {
      console.error('Error rejecting collaborator:', e);
    }
  };

  // Stock/Inventory Handlers
  const handleUpdateQuantity = async (id: string, delta: number) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(0, item.quantity + delta);

    try {
      await updateDoc(doc(db, 'inventory', id), {
        quantity: newQty
      });
    } catch (e) {
      console.error('Error updating stock quantity:', e);
    }
  };

  const handleAddItem = async (itemData: Omit<InventoryItem, 'id'>) => {
    const newId = `item-${Date.now()}`;
    const newItem: InventoryItem = {
      id: newId,
      ...itemData
    };

    try {
      await setDoc(doc(db, 'inventory', newId), newItem);
    } catch (e) {
      console.error('Error adding inventory item:', e);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'inventory', id));
    } catch (e) {
      console.error('Error deleting inventory item:', e);
    }
  };

  // Equipment Handlers
  const handleUpdateEquipmentStatus = async (id: string, status: Equipment['status']) => {
    try {
      await updateDoc(doc(db, 'equipment', id), {
        status
      });
    } catch (e) {
      console.error('Error updating equipment status:', e);
    }
  };

  const handleAddEquipment = async (equipData: Omit<Equipment, 'id'>) => {
    const newId = `equip-${Date.now()}`;
    const newEquip: Equipment = {
      id: newId,
      ...equipData
    };

    try {
      await setDoc(doc(db, 'equipment', newId), newEquip);
    } catch (e) {
      console.error('Error adding equipment:', e);
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'equipment', id));
    } catch (e) {
      console.error('Error deleting equipment:', e);
    }
  };

  // Settings Handlers
  const handleUpdateSettings = async (newSettings: SystemSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'system_config'), newSettings);
    } catch (e) {
      console.error('Error updating system settings:', e);
    }
  };

  const handleUpdateImage = async (id: 'logo' | 'stamp' | 'signature', base64: string) => {
    try {
      await updateDoc(doc(db, 'settings', 'images'), {
        [id]: base64
      });
    } catch (e) {
      console.error('Error updating image in settings:', e);
    }
  };

  const handleResetImages = async () => {
    if (confirm('Deseja resetar todas as assinaturas e logos para os padrões do sistema no banco online?')) {
      try {
        await setDoc(doc(db, 'settings', 'images'), {
          logo: DEFAULT_LOGO,
          stamp: DEFAULT_STAMP,
          signature: DEFAULT_SIGNATURE
        });
      } catch (e) {
        console.error('Error resetting images:', e);
      }
    }
  };

  const handleTogglePermission = async (userId: string, permissionId: string) => {
    const user = adminUsers.find(u => u.id === userId);
    if (!user) return;
    const newVal = !user.permissions[permissionId];

    try {
      await updateDoc(doc(db, 'admin_users', userId), {
        [`permissions.${permissionId}`]: newVal
      });
    } catch (e) {
      console.error('Error toggling permission:', e);
    }
  };

  const handleAddAdminUser = async (userData: Omit<AdminUser, 'id'>) => {
    const newId = `admin-${Date.now()}`;
    const newUser: AdminUser = {
      id: newId,
      ...userData
    };

    try {
      await setDoc(doc(db, 'admin_users', newId), newUser);
    } catch (e) {
      console.error('Error adding admin user:', e);
    }
  };

  const handleDeleteAdminUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'admin_users', id));
    } catch (e) {
      console.error('Error deleting admin user:', e);
    }
  };

  // Branches Handlers
  const handleAddBranch = async (branchData: Omit<Branch, 'id'>) => {
    const newId = `branch-${Date.now()}`;
    const newBranch: Branch = {
      id: newId,
      ...branchData
    };
    try {
      await setDoc(doc(db, 'branches', newId), newBranch);
    } catch (e) {
      console.error('Error adding branch:', e);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'branches', id));
    } catch (e) {
      console.error('Error deleting branch:', e);
    }
  };

  // --- Render logic ---
  
  if (showLoginScreen) {
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess}
        onOpenPublicRequest={handleOpenPublicRequest}
        isDarkMode={isDarkMode}
        adminUsers={adminUsers}
        branches={branches}
      />
    );
  }

  // Calculate quick metrics for general dashboard overview
  const lowStockCount = inventory.filter(i => i.quantity <= i.minQuantity).length;
  
  // Overdue or within 30 days
  const calibOverdueCount = equipment.filter(e => {
    const today = new Date();
    const nextCal = new Date(e.nextCalibration);
    const diffTime = nextCal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30; // overdue or within 30 days
  }).length;

  const pendingColabCount = collaborators.filter(c => c.status === 'pending').length;
  
  // simulated active critical logs from clinical analysis
  const criticalAlarmsCount = 3; 

  const activeRole = user?.role || 'Visitante';
  const isAdmin = activeRole === 'Gestor';

  return (
    <div className={`min-h-screen font-sans flex transition-colors duration-200
      ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Retractable Sidebar Component */}
      <Sidebar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isDarkMode={isDarkMode}
        toggleTheme={handleToggleTheme}
        user={user}
        logout={handleLogout}
      />

      {/* Main Container */}
      <main 
        id="main-content-layout"
        className={`flex-1 min-w-0 min-h-screen py-8 px-4 sm:px-6 md:px-8 transition-all duration-300
          ${isSidebarCollapsed ? 'ml-16 md:ml-20' : 'ml-0 md:ml-64'}`}
      >
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Top Header matching "Geometric Balance" */}
          <header className={`flex items-center justify-between p-5 rounded-2xl border mb-8 transition-all duration-200
            ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3 select-none">
              <div className={`p-2 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-indigo-950 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                <Beaker className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xs sm:text-sm font-bold uppercase tracking-wider leading-tight">Laboratório Hospital Santa Marcelina</h1>
                {user?.filial && (
                  <p className={`text-[10px] font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    Filial: {user.filial}
                  </p>
                )}
                <p className={`text-[9px] font-mono mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>CONTROLE DE LABORATÓRIO • V 2.4.0</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className={`text-[9px] uppercase font-bold tracking-wider leading-none ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {user ? 'Operador Ativo' : 'Acesso Visitante'}
                </p>
                <p className="text-xs font-semibold mt-0.5">{user ? user.name : 'Dr. Roberto Silva'}</p>
              </div>

              {user && (
                <div className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider font-mono
                  ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                  {activeRole}
                </div>
              )}
            </div>
          </header>

          {/* Render Tab Views */}
          {currentTab === 'dashboard' && (
            <Dashboard 
              user={user || { name: 'Visitante', email: '', role: 'Técnico' }}
              isDarkMode={isDarkMode}
              lowStockCount={lowStockCount}
              calibOverdueCount={calibOverdueCount}
              pendingColabCount={pendingColabCount}
              criticalAlarmsCount={criticalAlarmsCount}
              setCurrentTab={setCurrentTab}
            />
          )}

          {currentTab === 'collaborators' && (
            <CollaboratorRequest 
              collaborators={collaborators}
              onAddRequest={handleAddRequest}
              onApprove={handleApproveCollaborator}
              onReject={handleRejectCollaborator}
              isDarkMode={isDarkMode}
              isAdmin={isAdmin}
              onLoginPrompt={handleLogout}
              branches={branches}
            />
          )}

          {currentTab === 'inventory' && (
            <InventoryControl 
              inventory={inventory}
              onUpdateQuantity={handleUpdateQuantity}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              isDarkMode={isDarkMode}
              userRole={activeRole}
            />
          )}

          {currentTab === 'equipment' && (
            <EquipmentControl 
              equipment={equipment}
              onUpdateStatus={handleUpdateEquipmentStatus}
              onAddEquipment={handleAddEquipment}
              onDeleteEquipment={handleDeleteEquipment}
              isDarkMode={isDarkMode}
              userRole={activeRole}
            />
          )}

          {currentTab === 'analysis' && (
            <DataAnalysis 
              isDarkMode={isDarkMode}
              settings={settings}
              images={images}
            />
          )}

          {currentTab === 'settings' && isAdmin && (
            <SettingsComponent 
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              images={images}
              onUpdateImage={handleUpdateImage}
              onResetImages={handleResetImages}
              adminUsers={adminUsers}
              onTogglePermission={handleTogglePermission}
              onAddAdminUser={handleAddAdminUser}
              onDeleteAdminUser={handleDeleteAdminUser}
              isDarkMode={isDarkMode}
              branches={branches}
              onAddBranch={handleAddBranch}
              onDeleteBranch={handleDeleteBranch}
            />
          )}


          {/* Geometric Balance Footer */}
          <footer className={`flex flex-col sm:flex-row items-center justify-between pt-6 border-t mt-12 text-[10px] uppercase tracking-widest gap-4
            ${isDarkMode ? 'border-slate-900 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
            <span>© 2026 LabControl Systems • Todos os direitos reservados</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Servidor Online</span>
              </div>
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
}
