import { useState } from 'react';
import { useCalculatorsStore, DiscountTier } from '../../stores/calculatorsStore';
import { Trash2 } from 'lucide-react';

export default function ManageDiscounts() {
  const { discountTiers, updateDiscountTiers } = useCalculatorsStore();
  const [editedTiers, setEditedTiers] = useState<DiscountTier[]>([...discountTiers]);
  const [newTier, setNewTier] = useState({ minVms: 1, discountPercentage: 1 });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleUpdateTier = (index: number, field: keyof Omit<DiscountTier, 'id'>, value: number) => {
    const updated = [...editedTiers];
    updated[index] = { ...updated[index], [field]: value };
    setEditedTiers(updated);
  };
  
  const handleRemoveTier = (index: number) => {
    const updated = [...editedTiers];
    updated.splice(index, 1);
    setEditedTiers(updated);
  };
  
  const handleAddTier = () => {
    const newId = `${Date.now()}`;
    setEditedTiers([
      ...editedTiers,
      { id: newId, minVms: newTier.minVms, discountPercentage: newTier.discountPercentage }
    ]);
    setNewTier({ minVms: 1, discountPercentage: 1 });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Sort tiers by minVms in descending order to ensure the highest tier is applied
    const sortedTiers = [...editedTiers].sort((a, b) => b.minVms - a.minVms);
    
    // Update the store with new values
    updateDiscountTiers(sortedTiers);
    
    // Update local state with sorted tiers
    setEditedTiers(sortedTiers);
    
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
        <h1 className="text-2xl font-semibold text-secondary-900">Manage Discounts</h1>
        <p className="mt-2 text-secondary-600">
          Configure volume discounts based on the number of VMs.
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
                Discount tiers updated successfully
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="card">
        <h2 className="mb-6 text-lg font-medium text-secondary-800">Volume Discount Tiers</h2>
        
        <div className="mb-6 overflow-hidden rounded-lg border border-secondary-200">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                  Minimum VMs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                  Discount Percentage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200 bg-white">
              {editedTiers.map((tier, index) => (
                <tr key={tier.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <input
                      type="number"
                      min="1"
                      className="w-20 border-0 bg-transparent p-0 focus:outline-none focus:ring-0"
                      value={tier.minVms}
                      onChange={(e) => handleUpdateTier(index, 'minVms', parseInt(e.target.value) || 1)}
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        className="w-16 border-0 bg-transparent p-0 focus:outline-none focus:ring-0"
                        value={tier.discountPercentage}
                        onChange={(e) => handleUpdateTier(index, 'discountPercentage', parseInt(e.target.value) || 1)}
                      />
                      <span className="ml-1 text-secondary-500">%</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button
                      type="button"
                      className="text-error-500 hover:text-error-700"
                      onClick={() => handleRemoveTier(index)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {editedTiers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-secondary-500">
                    No discount tiers. Add a tier below.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mb-6">
          <h3 className="mb-3 text-md font-medium text-secondary-800">Add New Discount Tier</h3>
          <div className="flex flex-wrap gap-4">
            <div>
              <label htmlFor="minVms" className="form-label">Minimum VMs</label>
              <input
                id="minVms"
                type="number"
                min="1"
                className="input w-32"
                value={newTier.minVms}
                onChange={(e) => setNewTier({ ...newTier, minVms: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <label htmlFor="discountPercentage" className="form-label">Discount Percentage</label>
              <div className="relative">
                <input
                  id="discountPercentage"
                  type="number"
                  min="1"
                  max="100"
                  className="input w-32 pr-7"
                  value={newTier.discountPercentage}
                  onChange={(e) => setNewTier({ ...newTier, discountPercentage: parseInt(e.target.value) || 1 })}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-secondary-500">%</span>
                </div>
              </div>
            </div>
            <div className="flex items-end">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleAddTier}
              >
                Add Tier
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 rounded-md bg-secondary-50 p-4">
          <h3 className="text-sm font-medium text-secondary-700">How Discounts Work</h3>
          <p className="mt-1 text-sm text-secondary-600">
            Discounts are applied based on the number of VMs in a configuration. When multiple tiers 
            qualify for a customer, the highest applicable discount will be used.
          </p>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
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
      </div>
    </div>
  );
}