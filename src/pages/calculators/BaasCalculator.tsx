import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useCalculatorsStore } from '../../stores/calculatorsStore';

type BackupType = 'perGb' | 'perDevice';
type DeviceType = 'server' | 'workstation';

export default function BaasCalculator() {
  const { user } = useAuthStore();
  const { baasPricing, margins, currency } = useCalculatorsStore();
  
  const [backupType, setBackupType] = useState<BackupType>('perGb');
  const [gigabytes, setGigabytes] = useState(100);
  const [deviceType, setDeviceType] = useState<DeviceType>('server');
  const [deviceCount, setDeviceCount] = useState(1);
  
  const [calculatedCost, setCalculatedCost] = useState(0);
  const [finalCost, setFinalCost] = useState(0);
  
  // Get margin for the current user
  const userMargin = margins.find(m => m.resellerId === user?.id)?.baasMargin || 100; // Default 100% margin
  
  useEffect(() => {
    let cost = 0;
    
    if (backupType === 'perGb') {
      cost = gigabytes * baasPricing.perGbCost;
    } else if (backupType === 'perDevice') {
      if (deviceType === 'server') {
        cost = deviceCount * baasPricing.perServerCost;
      } else {
        cost = deviceCount * baasPricing.perWorkstationCost;
      }
    }
    
    setCalculatedCost(cost);
    setFinalCost(cost * (1 + userMargin / 100));
  }, [backupType, gigabytes, deviceType, deviceCount, baasPricing, userMargin]);
  
  const formatCurrency = (value: number) => {
    const formatter = new Intl.NumberFormat(
      currency === 'INR' ? 'en-IN' : 'en-US', 
      {
        style: 'currency',
        currency: currency || 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
    
    // Handle cases where the currency might not be available in the formatter
    try {
      return formatter.format(value);
    } catch (e) {
      // Fallback to basic formatting if the currency is not supported
      return `${currency || '₹'} ${value.toFixed(2)}`;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary-900">CX-BAAS Calculator</h1>
        <p className="mt-2 text-secondary-600">
          Calculate pricing for backup as a service solutions.
        </p>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-6">
          <h2 className="text-lg font-medium text-secondary-800">BAAS Configuration</h2>
          
          <div className="form-group">
            <label className="form-label">Backup Pricing Model</label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="backupType"
                  value="perGb"
                  checked={backupType === 'perGb'}
                  onChange={() => setBackupType('perGb')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-secondary-700">Per GB</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="backupType"
                  value="perDevice"
                  checked={backupType === 'perDevice'}
                  onChange={() => setBackupType('perDevice')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-secondary-700">Per Device</span>
              </label>
            </div>
          </div>
          
          {backupType === 'perGb' ? (
            <div className="form-group">
              <label htmlFor="gigabytes" className="form-label">Number of Gigabytes</label>
              <input
                id="gigabytes"
                type="number"
                min="1"
                className="input"
                value={gigabytes}
                onChange={(e) => setGigabytes(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <p className="mt-1 text-xs text-secondary-500">
                Price per GB: {formatCurrency(baasPricing.perGbCost)}
              </p>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Device Type</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deviceType"
                      value="server"
                      checked={deviceType === 'server'}
                      onChange={() => setDeviceType('server')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-secondary-700">Server</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deviceType"
                      value="workstation"
                      checked={deviceType === 'workstation'}
                      onChange={() => setDeviceType('workstation')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-secondary-700">Workstation</span>
                  </label>
                </div>
                <p className="mt-1 text-xs text-secondary-500">
                  Price per {deviceType === 'server' ? 'server' : 'workstation'}: 
                  {deviceType === 'server' 
                    ? formatCurrency(baasPricing.perServerCost)
                    : formatCurrency(baasPricing.perWorkstationCost)
                  }
                </p>
              </div>
              
              <div className="form-group">
                <label htmlFor="deviceCount" className="form-label">Number of Devices</label>
                <input
                  id="deviceCount"
                  type="number"
                  min="1"
                  className="input"
                  value={deviceCount}
                  onChange={(e) => setDeviceCount(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
            </>
          )}
        </div>
        
        <div className="card">
          <h2 className="mb-6 text-lg font-medium text-secondary-800">Pricing Summary</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 border-b border-secondary-100 pb-3">
              <span className="text-secondary-600">Base Cost:</span>
              <span className="text-right font-medium">{formatCurrency(calculatedCost)}</span>
              
              {backupType === 'perGb' ? (
                <span className="col-span-2 text-xs text-secondary-500">
                  {gigabytes} GB × {formatCurrency(baasPricing.perGbCost)}/GB
                </span>
              ) : (
                <span className="col-span-2 text-xs text-secondary-500">
                  {deviceCount} {deviceType === 'server' ? 'Server' : 'Workstation'}
                  {deviceCount !== 1 ? 's' : ''} × 
                  {deviceType === 'server' 
                    ? formatCurrency(baasPricing.perServerCost)
                    : formatCurrency(baasPricing.perWorkstationCost)
                  }
                  /{deviceType === 'server' ? 'Server' : 'Workstation'}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 border-b border-secondary-100 pb-3">
              <span className="text-secondary-600">Reseller Margin:</span>
              <span className="text-right font-medium">{userMargin}%</span>
            </div>
            
            <div className="grid grid-cols-2 pt-3">
              <span className="text-lg font-semibold text-secondary-900">Final Price:</span>
              <span className="text-right text-lg font-bold text-primary-700">
                {formatCurrency(finalCost)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}