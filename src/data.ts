/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Collaborator, InventoryItem, Equipment, AdminUser, AdminPermission, LabImage, SystemSettings, Branch } from './types';

// Default base64/SVG placeholders for logo, stamp, and signature
export const DEFAULT_LOGO = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' fill='none'><rect width='120' height='120' rx='24' fill='%23ffffff' stroke='%23e2e8f0' stroke-width='2'/><rect x='35' y='45' width='12' height='12' fill='%238fa9c4' opacity='0.7'/><rect x='73' y='45' width='12' height='12' fill='%238fa9c4' opacity='0.7'/><rect x='54' y='26' width='12' height='12' fill='%238fa9c4' opacity='0.7'/><rect x='54' y='64' width='12' height='12' fill='%238fa9c4' opacity='0.7'/><path d='M41 33 H31 V57 H41 M79 33 H89 V57 H79 M41 69 V81 H79 V69' stroke='%23003b73' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/><path d='M60 81 L60 41 M60 41 L50 49 L53 54 L60 48 L67 54 L70 49 Z' fill='%23003b73'/><path d='M60 38 L54 44 M60 38 L66 44 M60 34 V38' stroke='%23003b73' stroke-width='2' stroke-linecap='round'/><circle cx='54' cy='44' r='1.5' fill='%23003b73'/><circle cx='66' cy='44' r='1.5' fill='%23003b73'/><circle cx='60' cy='34' r='1.5' fill='%23003b73'/></svg>";

export const DEFAULT_STAMP = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'><circle cx='50' cy='50' r='42' stroke='%23dc2626' stroke-width='4' stroke-dasharray='4 2'/><text x='50' y='45' fill='%23dc2626' font-size='10' font-family='sans-serif' text-anchor='middle' font-weight='bold'>LABORATÓRIO</text><text x='50' y='58' fill='%23dc2626' font-size='9' font-family='sans-serif' text-anchor='middle' font-weight='bold'>APROVADO</text><text x='50' y='70' fill='%23dc2626' font-size='7' font-family='sans-serif' text-anchor='middle'>SISTEMA CONTROL</text></svg>";

export const DEFAULT_SIGNATURE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 50' fill='none'><path d='M10 30 C 40 10, 60 45, 80 20 C 100 5, 110 35, 140 25' stroke='%232563eb' stroke-width='3' stroke-linecap='round'/></svg>";

export const INITIAL_COLLABORATORS: Collaborator[] = [
  {
    id: 'colab-1',
    fullName: 'Ana Beatriz Souza',
    email: 'ana.souza@labmail.com',
    whatsapp: '+5511999991111',
    sector: 'Bioquímica',
    registrationId: 'MT-2026-08',
    status: 'approved',
    requestedAt: '2026-07-10 09:30',
    approvedAt: '2026-07-10 14:15'
  },
  {
    id: 'colab-2',
    fullName: 'Carlos Eduardo Ramos',
    email: 'carlos.ramos@labmail.com',
    whatsapp: '+5521988882222',
    sector: 'Microbiologia',
    registrationId: 'MT-2026-15',
    status: 'pending',
    requestedAt: '2026-07-15 11:20'
  },
  {
    id: 'colab-3',
    fullName: 'Mariana Costa Pinheiro',
    email: 'mariana.costa@labmail.com',
    whatsapp: '+5511977773333',
    sector: 'Hematologia',
    registrationId: 'MT-2026-02',
    status: 'pending',
    requestedAt: '2026-07-16 08:45'
  },
  {
    id: 'colab-4',
    fullName: 'Rodrigo Lima Silva',
    email: 'rodrigo.silva@labmail.com',
    whatsapp: '+5531966664444',
    sector: 'Imunologia',
    registrationId: 'MT-2026-44',
    status: 'rejected',
    requestedAt: '2026-07-12 15:10'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'item-1',
    name: 'Reagente de Biureto',
    category: 'Reagente',
    quantity: 12,
    minQuantity: 5,
    unit: 'frasco 500ml',
    location: 'Geladeira 02 - Prateleira A',
    expiryDate: '2027-03-15',
    batch: 'BTR-8821'
  },
  {
    id: 'item-2',
    name: 'Placas de Petri Estéreis',
    category: 'Consumível',
    quantity: 150,
    minQuantity: 200, // Trigger low stock warning!
    unit: 'unidades',
    location: 'Armário B - Setor Micro',
    expiryDate: '2028-12-01',
    batch: 'PET-2026-01'
  },
  {
    id: 'item-3',
    name: 'Ácido Clorídrico PA 37%',
    category: 'Reagente',
    quantity: 4,
    minQuantity: 2,
    unit: 'litro',
    location: 'Cabine de Exaustão de Gases',
    expiryDate: '2029-06-20',
    batch: 'HCL-409'
  },
  {
    id: 'item-4',
    name: 'Tubos de Coleta Vácuo EDTA (Roxo)',
    category: 'Consumível',
    quantity: 1000,
    minQuantity: 300,
    unit: 'unidades',
    location: 'Armário de Coleta - Gaveta 1',
    expiryDate: '2027-01-10',
    batch: 'VAC-992'
  },
  {
    id: 'item-5',
    name: 'Ágar Sangue de Carneiro 5%',
    category: 'Meio de Cultura',
    quantity: 15,
    minQuantity: 20, // Trigger low stock
    unit: 'placas prontas',
    location: 'Geladeira 01 - Prateleira B',
    expiryDate: '2026-08-30',
    batch: 'AGS-332'
  }
];

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'equip-1',
    name: 'Espectrofotômetro UV-VIS',
    model: 'Genesys 150',
    serialNumber: 'SN-SPEC-884920',
    sector: 'Bioquímica',
    status: 'active',
    lastCalibration: '2026-05-12',
    nextCalibration: '2026-11-12',
    responsible: 'Dra. Helena Martins'
  },
  {
    id: 'equip-2',
    name: 'Centrífuga Refrigerada de Bancada',
    model: 'Excelsa 4 Flex',
    serialNumber: 'SN-CENT-102932',
    sector: 'Hematologia',
    status: 'active',
    lastCalibration: '2026-02-14',
    nextCalibration: '2026-08-14', // Warning: Calibration coming up!
    responsible: 'Dr. Roberto Santos'
  },
  {
    id: 'equip-3',
    name: 'Autoclave Vertical Digital',
    model: 'Phoenix Luferco 75L',
    serialNumber: 'SN-AUTO-553920',
    sector: 'Microbiologia',
    status: 'calibration',
    lastCalibration: '2025-07-20',
    nextCalibration: '2026-07-20', // Overdue or under active calibration!
    responsible: 'Ana Beatriz Souza'
  },
  {
    id: 'equip-4',
    name: 'Analisador de Hematologia Automático',
    model: 'Sysmex XN-350',
    serialNumber: 'SN-SYSM-004921',
    sector: 'Hematologia',
    status: 'maintenance',
    lastCalibration: '2026-01-10',
    nextCalibration: '2026-07-10',
    responsible: 'Dr. Roberto Santos'
  }
];

export const ADMIN_PERMISSIONS_LIST: AdminPermission[] = [
  { id: 'view_dashboard', label: 'Visualizar Dashboard', description: 'Permite ver os resumos e estatísticas gerais do laboratório.' },
  { id: 'approve_collaborators', label: 'Aprovar Colaboradores', description: 'Permite aprovar/rejeitar novas solicitações de acesso.' },
  { id: 'manage_inventory', label: 'Gerenciar Estoque', description: 'Permite adicionar, editar e dar baixa em itens do estoque.' },
  { id: 'manage_equipment', label: 'Gerenciar Equipamentos', description: 'Permite editar status e agendar calibrações de equipamentos.' },
  { id: 'critical_analysis', label: 'Acessar Análise Crítica', description: 'Visualizar e exportar relatórios de controle de qualidade e estatísticas.' },
  { id: 'manage_settings', label: 'Alterar Configurações', description: 'Alterar imagens de impressos, dados institucionais e permissões.' }
];

export const INITIAL_BRANCHES: Branch[] = [
  { id: 'branch-1', name: 'Itaquera (Sede)', cnpj: '60.581.215/0001-04', address: 'Rua Santa Marcelina, 177 - Itaquera, São Paulo - SP' },
  { id: 'branch-2', name: 'Cachoeirinha', cnpj: '60.581.215/0002-87', address: 'Av. Deputado Emílio Carlos, 3100 - Vila Nova Cachoeirinha, São Paulo - SP' },
  { id: 'branch-3', name: 'São Miguel', cnpj: '60.581.215/0003-68', address: 'Rua Pedro Soares de Andrade, 120 - Vila Americana, São Paulo - SP' }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Dr. Michel Leite (Gestor)',
    email: 'admin@laboratorio.com',
    role: 'Gestor',
    filial: 'Itaquera (Sede)',
    permissions: {
      view_dashboard: true,
      approve_collaborators: true,
      manage_inventory: true,
      manage_equipment: true,
      critical_analysis: true,
      manage_settings: true
    }
  },
  {
    id: 'admin-2',
    name: 'Beatriz Vasconcelos',
    email: 'beatriz@laboratorio.com',
    role: 'Analista',
    filial: 'Cachoeirinha',
    permissions: {
      view_dashboard: true,
      approve_collaborators: false,
      manage_inventory: true,
      manage_equipment: false,
      critical_analysis: true,
      manage_settings: false
    }
  },
  {
    id: 'admin-3',
    name: 'Lucas Guedes',
    email: 'lucas@laboratorio.com',
    role: 'Técnico',
    filial: 'São Miguel',
    permissions: {
      view_dashboard: true,
      approve_collaborators: false,
      manage_inventory: true,
      manage_equipment: true,
      critical_analysis: false,
      manage_settings: false
    }
  }
];

export const DEFAULT_SETTINGS: SystemSettings = {
  labName: 'Laboratório Hospital Santa Marcelina',
  cnpj: '60.581.215/0001-04',
  address: 'Rua Santa Marcelina, 177 - Itaquera, São Paulo - SP',
  showLogoOnReports: true,
  showStampOnReports: true
};
