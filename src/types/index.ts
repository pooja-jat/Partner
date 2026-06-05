export type PartnerRole = 'ISP' | 'BSP' | 'BS' | 'BranchManager' | 'Professional' | null;

export interface User {
  mobileNumber: string;
  name?: string;
  role?: PartnerRole;
}

export interface AuthState {
  isAuthenticated: boolean;
  mobileNumber: string;
  otpSent: boolean;
  isLoading: boolean;
  error: string | null;
  role: PartnerRole;
  initialize: () => Promise<void>;
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  setRole: (role: PartnerRole) => void;
  logout: () => void;
  clearError: () => void;
  _persist: (state: AuthState) => Promise<void>;
}


export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export * from './branch';
export * from './employee';
