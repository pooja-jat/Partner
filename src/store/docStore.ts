import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DocState {
  aadhaarStatus: string;
  panStatus: string;
  policeClearanceStatus: string;
  drivingLicenseStatus: string;
  otherDocsStatus: string;
  businessVerificationStatus: string;
  updateDocStatus: (docName: string, status: string) => void;
  _persist: (state: DocState) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useDocStore = create<DocState>((set, get) => ({
  aadhaarStatus: 'Not uploaded',
  panStatus: 'Not uploaded',
  policeClearanceStatus: 'Not uploaded',
  drivingLicenseStatus: 'Not uploaded',
  otherDocsStatus: 'Not uploaded',
  businessVerificationStatus: 'Not uploaded',

  updateDocStatus: (docName: string, status: string) => {
    set({ [`${docName}Status`]: status } as any);
    get()._persist(get());
  },

  initialize: async () => {
    try {
      const json = await AsyncStorage.getItem('docState');
      if (json) {
        const persisted = JSON.parse(json);
        set({ ...persisted });
      }
    } catch (e) {
      console.error('Failed to load docState', e);
    }
  },

  _persist: async (state: DocState) => {
    try {
      await AsyncStorage.setItem(
        'docState',
        JSON.stringify({
          aadhaarStatus: state.aadhaarStatus,
          panStatus: state.panStatus,
          policeClearanceStatus: state.policeClearanceStatus,
          drivingLicenseStatus: state.drivingLicenseStatus,
          otherDocsStatus: state.otherDocsStatus,
          businessVerificationStatus: state.businessVerificationStatus,
        })
      );
    } catch (e) {
      console.error('Failed to persist docState', e);
    }
  },
}));
