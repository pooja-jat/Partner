import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DocState {
  aadhaarStatus: string;
  panStatus: string;
  policeClearanceStatus: string;
  drivingLicenseStatus: string;
  otherDocsStatus: string;
  businessVerificationStatus: string;
  selfieStatus: string;
  videoKycStatus: string;
  aadhaarUri: string | null;
  panUri: string | null;
  policeClearanceUri: string | null;
  drivingLicenseUri: string | null;
  otherDocsUri: string | null;
  selfieUri: string | null;
  videoKycUri: string | null;
  updateDocStatus: (docName: string, status: string) => void;
  updateDocUri: (docName: string, uri: string) => void;
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
  selfieStatus: 'Not uploaded',
  videoKycStatus: 'Not uploaded',
  aadhaarUri: null,
  panUri: null,
  policeClearanceUri: null,
  drivingLicenseUri: null,
  otherDocsUri: null,
  selfieUri: null,
  videoKycUri: null,

  updateDocStatus: (docName: string, status: string) => {
    set({ [`${docName}Status`]: status } as any);
    get()._persist(get());
  },

  updateDocUri: (docName: string, uri: string) => {
    set({ [`${docName}Uri`]: uri } as any);
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
          selfieStatus: state.selfieStatus,
          videoKycStatus: state.videoKycStatus,
          aadhaarUri: state.aadhaarUri,
          panUri: state.panUri,
          policeClearanceUri: state.policeClearanceUri,
          drivingLicenseUri: state.drivingLicenseUri,
          otherDocsUri: state.otherDocsUri,
          selfieUri: state.selfieUri,
          videoKycUri: state.videoKycUri,
        })
      );
    } catch (e) {
      console.error('Failed to persist docState', e);
    }
  },
}));
