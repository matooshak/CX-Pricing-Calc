import { create } from 'zustand';

export type CpuType = 'V3' | 'V4' | 'Gold' | 'Gold NVME';

export interface Category {
  id: string;
  name: string;
  ramPerCpu: number;
}

export interface VpsPricing {
  cpuCost: Record<CpuType, number>;
  ramCostPerType: Record<CpuType, number>;
  additionalRamCostPerType: Record<CpuType, number>;
  storageCost: Record<CpuType, number>;
  vmCost: number;
  backupCost: number;
  baasCost: number;
  dynamicHardwareMargin: number;
}

export interface BaasPricing {
  perGbCost: number;
  perServerCost: number;
  perWorkstationCost: number;
}

export interface DiscountTier {
  id: string;
  minVms: number;
  discountPercentage: number;
}

export interface Margin {
  resellerId: string;
  vpsMargin: number;
  baasMargin: number;
}

interface CalculatorsState {
  categories: Category[];
  vpsPricing: VpsPricing;
  baasPricing: BaasPricing;
  discountTiers: DiscountTier[];
  margins: Margin[];
  
  updateCategories: (categories: Category[]) => void;
  updateVpsPricing: (pricing: Partial<VpsPricing>) => void;
  updateBaasPricing: (pricing: Partial<BaasPricing>) => void;
  updateDiscountTiers: (tiers: DiscountTier[]) => void;
  updateMargins: (margins: Margin[]) => void;
  setMargin: (resellerId: string, vpsMargin: number, baasMargin: number) => void;
}

const initialCategories: Category[] = [
  { id: '1', name: 'V3', ramPerCpu: 3 },
  { id: '2', name: 'V4', ramPerCpu: 4 },
  { id: '3', name: 'Gold', ramPerCpu: 6 },
  { id: '4', name: 'Gold NVME', ramPerCpu: 6 },
];

const initialVpsPricing: VpsPricing = {
  cpuCost: {
    'V3': 3000,
    'V4': 4500,
    'Gold': 6000,
    'Gold NVME': 7500,
  },
  ramCostPerType: {
    'V3': 1500,
    'V4': 2000,
    'Gold': 2500,
    'Gold NVME': 2500,
  },
  additionalRamCostPerType: {
    'V3': 2000,
    'V4': 2500,
    'Gold': 3000,
    'Gold NVME': 3000,
  },
  storageCost: {
    'V3': 15,
    'V4': 20,
    'Gold': 25,
    'Gold NVME': 40,
  },
  vmCost: 1500,
  backupCost: 8,
  baasCost: 12,
  dynamicHardwareMargin: 15,
};

const initialBaasPricing: BaasPricing = {
  perGbCost: 35,
  perServerCost: 2250,
  perWorkstationCost: 1125,
};

const initialDiscountTiers: DiscountTier[] = [
  { id: '1', minVms: 5, discountPercentage: 5 },
  { id: '2', minVms: 10, discountPercentage: 10 },
  { id: '3', minVms: 25, discountPercentage: 15 },
];

export const useCalculatorsStore = create<CalculatorsState>((set) => ({
  categories: initialCategories,
  vpsPricing: initialVpsPricing,
  baasPricing: initialBaasPricing,
  discountTiers: initialDiscountTiers,
  margins: [
    { resellerId: '2', vpsMargin: 70, baasMargin: 50 },
    { resellerId: '3', vpsMargin: 60, baasMargin: 40 },
  ],
  
  updateCategories: (categories) => set({ categories }),
  updateVpsPricing: (pricing) => set((state) => ({ 
    vpsPricing: { ...state.vpsPricing, ...pricing } 
  })),
  updateBaasPricing: (pricing) => set((state) => ({ 
    baasPricing: { ...state.baasPricing, ...pricing } 
  })),
  updateDiscountTiers: (tiers) => set({ discountTiers: tiers }),
  updateMargins: (margins) => set({ margins }),
  setMargin: (resellerId, vpsMargin, baasMargin) => set((state) => {
    const existingIndex = state.margins.findIndex(m => m.resellerId === resellerId);
    if (existingIndex >= 0) {
      const newMargins = [...state.margins];
      newMargins[existingIndex] = { resellerId, vpsMargin, baasMargin };
      return { margins: newMargins };
    } else {
      return { 
        margins: [...state.margins, { resellerId, vpsMargin, baasMargin }] 
      };
    }
  }),
}));