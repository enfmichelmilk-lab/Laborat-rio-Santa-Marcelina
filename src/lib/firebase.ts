/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  getDoc 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
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
} from '../data';
import { Collaborator, InventoryItem, Equipment, AdminUser, SystemSettings, Branch } from '../types';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Seed helper function
export async function seedDatabaseIfEmpty() {
  try {
    // 1. Settings
    const settingsRef = doc(db, 'settings', 'system_config');
    const settingsSnap = await getDoc(settingsRef);
    if (!settingsSnap.exists()) {
      await setDoc(settingsRef, DEFAULT_SETTINGS);
      // Save default images
      await setDoc(doc(db, 'settings', 'images'), {
        logo: DEFAULT_LOGO,
        stamp: DEFAULT_STAMP,
        signature: DEFAULT_SIGNATURE
      });
      console.log('Seeded settings and images.');
    }

    // 2. Collaborators
    const colabsRef = collection(db, 'collaborators');
    const colabsSnap = await getDocs(colabsRef);
    if (colabsSnap.empty) {
      for (const colab of INITIAL_COLLABORATORS) {
        await setDoc(doc(colabsRef, colab.id), colab);
      }
      console.log('Seeded collaborators.');
    }

    // 3. Inventory
    const inventoryRef = collection(db, 'inventory');
    const inventorySnap = await getDocs(inventoryRef);
    if (inventorySnap.empty) {
      for (const item of INITIAL_INVENTORY) {
        await setDoc(doc(inventoryRef, item.id), item);
      }
      console.log('Seeded inventory.');
    }

    // 4. Equipment
    const equipRef = collection(db, 'equipment');
    const equipSnap = await getDocs(equipRef);
    if (equipSnap.empty) {
      for (const eq of INITIAL_EQUIPMENT) {
        await setDoc(doc(equipRef, eq.id), eq);
      }
      console.log('Seeded equipment.');
    }

    // 5. Admin Users
    const adminsRef = collection(db, 'admin_users');
    const adminsSnap = await getDocs(adminsRef);
    if (adminsSnap.empty) {
      for (const ad of INITIAL_ADMIN_USERS) {
        await setDoc(doc(adminsRef, ad.id), ad);
      }
      console.log('Seeded admin users.');
    }

    // 6. Branches
    const branchesRef = collection(db, 'branches');
    const branchesSnap = await getDocs(branchesRef);
    if (branchesSnap.empty) {
      for (const br of INITIAL_BRANCHES) {
        await setDoc(doc(branchesRef, br.id), br);
      }
      console.log('Seeded branches.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Subscribe helper function for Real-time state synchronization
export function subscribeToCollection<T>(
  collectionName: string, 
  onUpdate: (data: T[]) => void
) {
  return onSnapshot(collection(db, collectionName), (snapshot) => {
    const list: T[] = [];
    snapshot.forEach((doc) => {
      list.push({ ...doc.data() } as T);
    });
    onUpdate(list);
  }, (err) => {
    console.error(`Subscription error for ${collectionName}:`, err);
  });
}

// Single document subscriber (e.g. settings)
export function subscribeToDoc<T>(
  collectionName: string,
  docId: string,
  onUpdate: (data: T) => void
) {
  return onSnapshot(doc(db, collectionName, docId), (snapshot) => {
    if (snapshot.exists()) {
      onUpdate(snapshot.data() as T);
    }
  }, (err) => {
    console.error(`Doc subscription error for ${collectionName}/${docId}:`, err);
  });
}
