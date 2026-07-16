/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Branch {
  id: string;
  name: string;
  cnpj?: string;
  address?: string;
}

export interface Collaborator {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  sector: string;
  registrationId: string; // matrícula
  filial?: string; // name or ID of the filial
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  approvedAt?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string; // e.g., Reagente, Vidraria, Consumível, Meio de Cultura
  quantity: number;
  minQuantity: number;
  unit: string; // e.g., ml, un, frasco, caixa
  location: string;
  expiryDate?: string;
  batch?: string;
}

export interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  sector: string;
  status: 'active' | 'calibration' | 'maintenance';
  lastCalibration: string;
  nextCalibration: string;
  responsible: string;
}

export interface AdminPermission {
  id: string;
  label: string;
  description: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Gestor' | 'Analista' | 'Técnico';
  filial?: string; // name or ID of the filial
  permissions: {
    [key: string]: boolean; // permissionId -> boolean
  };
}

export interface LabImage {
  id: 'logo' | 'stamp' | 'signature';
  name: string;
  dataUrl: string; // base64
  updatedAt: string;
}

export interface SystemSettings {
  labName: string;
  cnpj: string;
  address: string;
  showLogoOnReports: boolean;
  showStampOnReports: boolean;
}
