import { useState } from 'react';

export default function CalculatorSettings() {
  // Settings implementation will be placeholder for now
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const handleReset = () => {
    setShowConfirmation(true);
  };
  
  const handleConfirmReset = () => {
    // Would implement reset logic here
    setShowConfirmation(false);
    // Display success message, etc.
  };
  
  const handleCancelReset = () => {
    setShowConfirmation(false);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary-900">Calculator Settings</h1>
        <p className="mt-2 text-secondary-600">
          Configure global settings for price calculators.
        </p>
      </div>
      
      <div className="card space-y-6">
        <h2 className="text-lg font-medium text-secondary-800">Global Settings</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="form-group">
            <label htmlFor="currency" className="form-label">Currency</label>
            <select id="currency" className="select">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="vat" className="form-label">VAT/Tax Rate (%)</label>
            <div className="relative">
              <input 
                id="vat" 
                type="number" 
                min="0" 
                max="100" 
                className="input pr-7" 
                defaultValue="0"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-secondary-500">%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-md bg-secondary-50 p-4">
          <h3 className="text-sm font-medium text-secondary-700">Calculator Behavior</h3>
          <div className="mt-4 space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500" 
                defaultChecked
              />
              <span className="ml-2 text-sm text-secondary-700">Auto-calculate as inputs change</span>
            </label>
            
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500" 
                defaultChecked
              />
              <span className="ml-2 text-sm text-secondary-700">Apply volume discounts automatically</span>
            </label>
            
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500" 
                defaultChecked
              />
              <span className="ml-2 text-sm text-secondary-700">Show calculation breakdown</span>
            </label>
          </div>
        </div>
        
        <div className="border-t border-secondary-200 pt-6">
          <h3 className="mb-4 text-md font-medium text-secondary-800">Reset Settings</h3>
          <p className="mb-4 text-sm text-secondary-600">
            This will reset all calculator settings to their default values. Price configurations will not be affected.
          </p>
          <button 
            type="button" 
            className="btn btn-danger"
            onClick={handleReset}
          >
            Reset Settings
          </button>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-secondary-900 bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-medium text-secondary-900">Confirm Reset</h3>
            <p className="mt-2 text-sm text-secondary-600">
              Are you sure you want to reset all calculator settings to their default values? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={handleCancelReset}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={handleConfirmReset}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}