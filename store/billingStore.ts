import { create } from 'zustand';

interface BillingState {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
}

interface BillingActions {
  setBillingDetails: (details: Partial<BillingState>) => void;
}

type BillingStore = BillingState & BillingActions;

export const useBillingStore = create<BillingStore>((set) => ({
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zipCode: '',
  setBillingDetails: (details) => set((state) => ({ ...state, ...details })),
}));