import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useCalculatorsStore } from '../../stores/calculatorsStore';

type CpuType = 'V3' | 'V4' | 'Gold' | 'Gold NVME';

export default function VPSCalculator() {
  const { user } = useAuthStore();
  const { categories, vpsPricing, discountTiers, margins } = useCalculatorsStore();
  
  const [cpuType, setCpuType] = useState<CpuType>('V3');
  const [cpuCount, setCpuCount] = useState(1);
  const [ramGB, setRamGB] = useState(4);
  const [storageGB, setStorageGB] = useState(50);
  const [vmCount, setVmCount] = useState(1);
  const [baasBackupGB, setBaasBackupGB] = useState(0);
  
  const [calculations, setCalculations] = useState({
    serverCost: 0,
    hardwareCost: 0,
    infraCost: 0,
    totalCost: 0,
    finalCost: 0,
    discount: 0,
    discountedCost: 0,
  });
  
  // Find the appropriate category for the selected CPU type
  const selectedCategory = categories.find(cat => cat.name === cpuType);
  const ramPerCpu = selectedCategory?.ramPerCpu || 0;
  
  // Calculate additional RAM
  const includedRam = cpuCount * ramPerCpu;
  const additionalRam = Math.max(0, ramGB - includedRam);
  
  // Get margin for the current user
  const userMargin = margins.find(m => m.resellerId === user?.id)?.vpsMargin || 100; // Default 100% margin
  
  // Get discount based on VM count
  const applicableDiscount = discountTiers
    .filter(tier => vmCount >= tier.minVms)
    .sort((a, b) => b.minVms - a.minVms)[0]?.discountPercentage || 0;
  
  // Calculate pricing
  useEffect(() => {
    if (selectedCategory) {
      // Server cost calculation
      const cpuCost = vpsPricing.cpuCost[cpuType] * cpuCount;
      const includedRamCost = includedRam * vpsPricing.ramCostPerType[cpuType];
      const additionalRamCost = additionalRam * vpsPricing.additionalRamCostPerType[cpuType];
      const storageCost = storageGB * vpsPricing.storageCost[cpuType];
      
      const serverCost = cpuCost + includedRamCost + additionalRamCost + storageCost;
      
      // Hardware cost with hosting and dynamic margin
      const hostingCost = vpsPricing.hostingCost;
      const hardwareMargin = (serverCost + hostingCost) * (vpsPricing.dynamicHardwareMargin / 100);
      const hardwareCost = serverCost + hostingCost + hardwareMargin;
      
      // Infrastructure cost with backup
      const backupCost = storageGB * vpsPricing.backupCost;
      const infraCost = hardwareCost + backupCost;
      
      // Total cost with VM cost and optional BAAS
      const vmCost = vmCount * vpsPricing.vmCost;
      const optionalBaas = baasBackupGB * vpsPricing.baasCost;
      const totalCost = infraCost + vmCost + optionalBaas;
      
      // Apply reseller margin
      const finalCost = totalCost * (1 + userMargin / 100);
      
      // Apply volume discount if applicable
      const discountAmount = finalCost * (applicableDiscount / 100);
      const discountedCost = finalCost - discountAmount;
      
      setCalculations({
        serverCost,
        hardwareCost,
        infraCost,
        totalCost,
        finalCost,
        discount: applicableDiscount,
        discountedCost,
      });
    }
  }, [cpuType, cpuCount, ramGB, storageGB, vmCount, baasBackupGB, vpsPricing, selectedCategory, userMargin, applicableDiscount, additionalRam, includedRam]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary-900">VPS Calculator</h1>
        <p className="mt-2 text-secondary-600">
          Calculate pricing for virtual private server configurations.
        </p>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-6">
          <h2 className="text-lg font-medium text-secondary-800">VPS Configuration</h2>
          
          <div className="form-group">
            <label htmlFor="cpuType" className="form-label">CPU Type</label>
            <select
              id="cpuType"
              className="select"
              value={cpuType}
              onChange={(e) => setCpuType(e.target.value as CpuType)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="cpuCount" className="form-label">Number of CPUs</label>
            <input
              id="cpuCount"
              type="number"
              min="1"
              className="input"
              value={cpuCount}
              onChange={(e) => setCpuCount(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="ramGB" className="form-label">
              RAM (GB) - {ramPerCpu} GB per CPU included
            </label>
            <input
              id="ramGB"
              type="number"
              min={cpuCount}
              className="input"
              value={ramGB}
              onChange={(e) => setRamGB(Math.max(cpuCount, parseInt(e.target.value) || cpuCount))}
            />
            {additionalRam > 0 && (
              <p className="mt-1 text-xs text-secondary-500">
                Includes {includedRam} GB standard RAM + {additionalRam} GB additional RAM
              </p>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="storageGB" className="form-label">
              Storage (GB) - {cpuType.includes('NVME') ? 'NVME' : 'SSD'}
            </label>
            <input
              id="storageGB"
              type="number"
              min="10"
              className="input"
              value={storageGB}
              onChange={(e) => setStorageGB(Math.max(10, parseInt(e.target.value) || 10))}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="vmCount" className="form-label">Number of VMs</label>
            <input
              id="vmCount"
              type="number"
              min="1"
              className="input"
              value={vmCount}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (isNaN(value)) {
                  setVmCount(0);
                } else {
                  setVmCount(Math.max(0, value));
                }
              }}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="baasBackupGB" className="form-label">Optional BAAS Backup (GB)</label>
            <input
              id="baasBackupGB"
              type="number"
              min="0"
              className="input"
              value={baasBackupGB}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (isNaN(value)) {
                  setBaasBackupGB(0);
                } else {
                  setBaasBackupGB(Math.max(0, value));
                }
              }}
            />
          </div>
        </div>
        
        <div className="card">
          <h2 className="mb-6 text-lg font-medium text-secondary-800">Pricing Summary</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 border-b border-secondary-100 pb-3">
              <span className="text-secondary-600">Server Cost:</span>
              <span className="text-right font-medium">{formatCurrency(calculations.serverCost)}</span>
            </div>
            
            <div className="grid grid-cols-2 border-b border-secondary-100 pb-3">
              <span className="text-secondary-600">Hardware Cost:</span>
              <span className="text-right font-medium">{formatCurrency(calculations.hardwareCost)}</span>
              <span className="col-span-2 text-xs text-secondary-500">
                Includes {vpsPricing.dynamicHardwareMargin}% hardware margin
              </span>
            </div>
            
            <div className="grid grid-cols-2 border-b border-secondary-100 pb-3">
              <span className="text-secondary-600">Infrastructure Cost:</span>
              <span className="text-right font-medium">{formatCurrency(calculations.infraCost)}</span>
            </div>
            
            <div className="grid grid-cols-2 border-b border-secondary-100 pb-3">
              <span className="text-secondary-600">VM Cost:</span>
              <span className="text-right font-medium">
                {formatCurrency(vmCount * vpsPricing.vmCost)}
              </span>
              <span className="col-span-2 text-xs text-secondary-500">
                {vmCount} VM{vmCount !== 1 ? 's' : ''} × {formatCurrency(vpsPricing.vmCost)}/VM
              </span>
            </div>
            
            {baasBackupGB > 0 && (
              <div className="grid grid-cols-2 border-b border-secondary-100 pb-3">
                <span className="text-secondary-600">BAAS Backup Cost:</span>
                <span className="text-right font-medium">
                  {formatCurrency(baasBackupGB * vpsPricing.baasCost)}
                </span>
                <span className="col-span-2 text-xs text-secondary-500">
                  {baasBackupGB} GB × {formatCurrency(vpsPricing.baasCost)}/GB
                </span>
              </div>
            )}
            
            <div className="grid grid-cols-2 border-b border-secondary-100 pb-3">
              <span className="text-secondary-600">Total Base Cost:</span>
              <span className="text-right font-medium">{formatCurrency(calculations.totalCost)}</span>
            </div>
            
            <div className="grid grid-cols-2 border-b border-secondary-100 pb-3">
              <span className="text-secondary-600">Reseller Margin:</span>
              <span className="text-right font-medium">{userMargin}%</span>
            </div>
            
            <div className="grid grid-cols-2 border-b border-secondary-100 pb-3">
              <span className="text-secondary-600">Volume Discount:</span>
              <span className="text-right font-medium text-success-600">
                {applicableDiscount > 0 ? `-${applicableDiscount}%` : 'No discount'}
              </span>
              {applicableDiscount > 0 && (
                <span className="col-span-2 text-xs text-secondary-500">
                  {vmCount} VMs qualifies for {applicableDiscount}% discount
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 pt-3">
              <span className="text-lg font-semibold text-secondary-900">Final Price:</span>
              <span className="text-right text-lg font-bold text-primary-700">
                {formatCurrency(calculations.discountedCost)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}