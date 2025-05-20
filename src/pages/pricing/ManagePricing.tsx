import { useState } from 'react';
import { useCalculatorsStore, CpuType } from '../../stores/calculatorsStore';

interface CpuPricing {
  cpuCost: number;
  ramCost: number;
  additionalRamCost: number;
  storageCost: number;
}

export default function ManagePricing() {
  const { vpsPricing, updateVpsPricing, categories } = useCalculatorsStore();
  
  // Create editable states for CPU-specific pricing
  const [cpuPricing, setCpuPricing] = useState<Record<CpuType, CpuPricing>>({
    'V3': {
      cpuCost: vpsPricing.cpuCost['V3'],
      ramCost: vpsPricing.ramCostPerType['V3'],
      additionalRamCost: vpsPricing.additionalRamCostPerType['V3'],
      storageCost: vpsPricing.storageCost['V3'],
    },
    'V4': {
      cpuCost: vpsPricing.cpuCost['V4'],
      ramCost: vpsPricing.ramCostPerType['V4'],
      additionalRamCost: vpsPricing.additionalRamCostPerType['V4'],
      storageCost: vpsPricing.storageCost['V4'],
    },
    'Gold': {
      cpuCost: vpsPricing.cpuCost['Gold'],
      ramCost: vpsPricing.ramCostPerType['Gold'],
      additionalRamCost: vpsPricing.additionalRamCostPerType['Gold'],
      storageCost: vpsPricing.storageCost['Gold'],
    },
    'Gold NVME': {
      cpuCost: vpsPricing.cpuCost['Gold NVME'],
      ramCost: vpsPricing.ramCostPerType['Gold NVME'],
      additionalRamCost: vpsPricing.additionalRamCostPerType['Gold NVME'],
      storageCost: vpsPricing.storageCost['Gold NVME'],
    },
  });
  
  const [vmCost, setVmCost] = useState(vpsPricing.vmCost);
  const [backupCost, setBackupCost] = useState(vpsPricing.backupCost);
  const [baasCost, setBaasCost] = useState(vpsPricing.baasCost);
  const [dynamicHardwareMargin, setDynamicHardwareMargin] = useState(vpsPricing.dynamicHardwareMargin);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleCpuPricingChange = (
    cpuType: CpuType,
    field: keyof CpuPricing,
    value: number
  ) => {
    setCpuPricing(prev => ({
      ...prev,
      [cpuType]: {
        ...prev[cpuType],
        [field]: value,
      },
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Convert CPU-specific pricing back to the store format
    const newPricing = {
      cpuCost: {} as Record<CpuType, number>,
      ramCostPerType: {} as Record<CpuType, number>,
      additionalRamCostPerType: {} as Record<CpuType, number>,
      storageCost: {} as Record<CpuType, number>,
      vmCost,
      backupCost,
      baasCost,
      dynamicHardwareMargin,
    };
    
    Object.entries(cpuPricing).forEach(([type, pricing]) => {
      const cpuType = type as CpuType;
      newPricing.cpuCost[cpuType] = pricing.cpuCost;
      newPricing.ramCostPerType[cpuType] = pricing.ramCost;
      newPricing.additionalRamCostPerType[cpuType] = pricing.additionalRamCost;
      newPricing.storageCost[cpuType] = pricing.storageCost;
    });
    
    // Update the store with new values
    updateVpsPricing(newPricing);
    
    // Show success message
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 500);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary-900">Manage VPS Pricing</h1>
        <p className="mt-2 text-secondary-600">
          Configure pricing parameters for the VPS calculator.
        </p>
      </div>
      
      {isSuccess && (
        <div className="mb-6 rounded-md bg-success-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-success-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-success-800">
                Pricing settings updated successfully
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="card">
        <div className="grid gap-6">
          {categories.map((category) => (
            <section key={category.id} className="space-y-4 border-b border-secondary-200 pb-6">
              <h2 className="text-lg font-medium text-secondary-800">
                {category.name} Configuration
              </h2>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="form-group">
                  <label className="form-label">CPU Cost</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-secondary-500">₹</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="input pl-7"
                      value={cpuPricing[category.name as CpuType].cpuCost}
                      onChange={(e) => handleCpuPricingChange(
                        category.name as CpuType,
                        'cpuCost',
                        parseFloat(e.target.value) || 0
                      )}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">RAM Cost (per GB)</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-secondary-500">₹</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="input pl-7"
                      value={cpuPricing[category.name as CpuType].ramCost}
                      onChange={(e) => handleCpuPricingChange(
                        category.name as CpuType,
                        'ramCost',
                        parseFloat(e.target.value) || 0
                      )}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Additional RAM Cost (per GB)</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-secondary-500">₹</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="input pl-7"
                      value={cpuPricing[category.name as CpuType].additionalRamCost}
                      onChange={(e) => handleCpuPricingChange(
                        category.name as CpuType,
                        'additionalRamCost',
                        parseFloat(e.target.value) || 0
                      )}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Storage Cost (per GB)
                    <span className="ml-1 text-xs text-secondary-500">
                      ({category.name.includes('NVME') ? 'NVME' : 'SSD'})
                    </span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-secondary-500">₹</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="input pl-7"
                      value={cpuPricing[category.name as CpuType].storageCost}
                      onChange={(e) => handleCpuPricingChange(
                        category.name as CpuType,
                        'storageCost',
                        parseFloat(e.target.value) || 0
                      )}
                    />
                  </div>
                </div>
              </div>
            </section>
          ))}
          
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-secondary-800">Additional Costs</h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="form-group">
                <label htmlFor="vm-cost" className="form-label">VM Cost (per VM)</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-secondary-500">₹</span>
                  </div>
                  <input
                    id="vm-cost"
                    type="number"
                    min="0"
                    step="0.01"
                    className="input pl-7"
                    value={vmCost}
                    onChange={(e) => setVmCost(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="backup-cost" className="form-label">Backup Cost (per GB)</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-secondary-500">₹</span>
                  </div>
                  <input
                    id="backup-cost"
                    type="number"
                    min="0"
                    step="0.01"
                    className="input pl-7"
                    value={backupCost}
                    onChange={(e) => setBackupCost(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="baas-cost" className="form-label">BAAS Cost (per GB)</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-secondary-500">₹</span>
                  </div>
                  <input
                    id="baas-cost"
                    type="number"
                    min="0"
                    step="0.01"
                    className="input pl-7"
                    value={baasCost}
                    onChange={(e) => setBaasCost(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="hardware-margin" className="form-label">
                  Dynamic Hardware Margin (%)
                </label>
                <div className="relative">
                  <input
                    id="hardware-margin"
                    type="number"
                    min="0"
                    max="100"
                    className="input pr-7"
                    value={dynamicHardwareMargin}
                    onChange={(e) => setDynamicHardwareMargin(parseFloat(e.target.value) || 0)}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-secondary-500">%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}