import { useState } from 'react';
import { useCalculatorsStore } from '../../stores/calculatorsStore';

export default function ManageBaasPricing() {
  const { baasPricing, updateBaasPricing } = useCalculatorsStore();
  
  const [perGbCost, setPerGbCost] = useState(baasPricing.perGbCost);
  const [perServerCost, setPerServerCost] = useState(baasPricing.perServerCost);
  const [perWorkstationCost, setPerWorkstationCost] = useState(baasPricing.perWorkstationCost);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Update the store with new values
    updateBaasPricing({
      perGbCost,
      perServerCost,
      perWorkstationCost,
    });
    
    // Show success message
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 500);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary-900">Manage CX-BAAS Pricing</h1>
        <p className="mt-2 text-secondary-600">
          Configure pricing parameters for the BAAS calculator.
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
                BAAS pricing settings updated successfully
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="card">
        <h2 className="mb-6 text-lg font-medium text-secondary-800">BAAS Pricing Options</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="form-group">
            <label htmlFor="per-gb-cost" className="form-label">Per GB Cost</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-secondary-500">$</span>
              </div>
              <input
                id="per-gb-cost"
                type="number"
                min="0"
                step="0.01"
                className="input pl-7"
                value={perGbCost}
                onChange={(e) => setPerGbCost(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="per-server-cost" className="form-label">Per Server Cost</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-secondary-500">$</span>
              </div>
              <input
                id="per-server-cost"
                type="number"
                min="0"
                step="0.01"
                className="input pl-7"
                value={perServerCost}
                onChange={(e) => setPerServerCost(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="per-workstation-cost" className="form-label">Per Workstation Cost</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-secondary-500">$</span>
              </div>
              <input
                id="per-workstation-cost"
                type="number"
                min="0"
                step="0.01"
                className="input pl-7"
                value={perWorkstationCost}
                onChange={(e) => setPerWorkstationCost(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
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