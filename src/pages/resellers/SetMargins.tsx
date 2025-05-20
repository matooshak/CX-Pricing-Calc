import { useState } from 'react';
import { useUsersStore } from '../../stores/usersStore';
import { useCalculatorsStore } from '../../stores/calculatorsStore';

export default function SetMargins() {
  const { users } = useUsersStore();
  const { margins, setMargin } = useCalculatorsStore();
  
  const resellers = users.filter(user => user.role === 'reseller' || user.role === 'sub-reseller');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resellerMargins, setResellerMargins] = useState(
    resellers.map(reseller => {
      const existingMargin = margins.find(m => m.resellerId === reseller.id);
      return {
        resellerId: reseller.id,
        name: reseller.name,
        vpsMargin: existingMargin?.vpsMargin ?? 100, // Default 100% margin
      };
    })
  );
  
  const handleMarginChange = (resellerId: string, vpsMargin: number) => {
    setResellerMargins(prev => 
      prev.map(item => 
        item.resellerId === resellerId 
          ? { ...item, vpsMargin } 
          : item
      )
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Update all margins
    resellerMargins.forEach(({ resellerId, vpsMargin }) => {
      const existingMargin = margins.find(m => m.resellerId === resellerId);
      setMargin(
        resellerId, 
        vpsMargin, 
        existingMargin?.baasMargin ?? 100
      );
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
        <h1 className="text-2xl font-semibold text-secondary-900">Set VPS Margins</h1>
        <p className="mt-2 text-secondary-600">
          Set profit margins for each reseller and sub-reseller for VPS calculations.
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
                Margins updated successfully
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="card">
        <div className="border-b border-secondary-200 pb-5">
          <h2 className="text-lg font-medium text-secondary-800">VPS Margins by Reseller</h2>
          <p className="mt-1 text-sm text-secondary-500">
            Set the profit margin percentage for each reseller. This affects the final price shown to customers.
          </p>
        </div>
        
        <div className="mt-6">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                  Reseller Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                  Margin (%)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200 bg-white">
              {resellerMargins.map((item) => {
                const user = users.find(u => u.id === item.resellerId);
                return (
                  <tr key={item.resellerId}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-700">
                      {item.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-700">
                      <span 
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user?.role === 'reseller' 
                            ? 'bg-primary-100 text-primary-800' 
                            : 'bg-secondary-100 text-secondary-800'
                        }`}
                      >
                        {user?.role === 'reseller' ? 'Reseller' : 'Sub-Reseller'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="w-32">
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="500"
                            className="input pr-7"
                            value={item.vpsMargin}
                            onChange={(e) => handleMarginChange(
                              item.resellerId, 
                              Math.max(0, Math.min(500, parseInt(e.target.value) || 0))
                            )}
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-secondary-500">%</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {resellerMargins.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-secondary-500">
                    No resellers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
            ) : 'Save Margins'}
          </button>
        </div>
      </form>
    </div>
  );
}