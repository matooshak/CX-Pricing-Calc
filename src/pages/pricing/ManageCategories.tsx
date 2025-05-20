import { useState } from 'react';
import { useCalculatorsStore, Category } from '../../stores/calculatorsStore';
import { Trash2 } from 'lucide-react';

export default function ManageCategories() {
  const { categories, updateCategories } = useCalculatorsStore();
  const [editedCategories, setEditedCategories] = useState<Category[]>([...categories]);
  const [newCategory, setNewCategory] = useState({ name: '', ramPerCpu: 1 });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleUpdateCategory = (index: number, field: keyof Category, value: string | number) => {
    const updated = [...editedCategories];
    updated[index] = { ...updated[index], [field]: value };
    setEditedCategories(updated);
  };
  
  const handleRemoveCategory = (index: number) => {
    const updated = [...editedCategories];
    updated.splice(index, 1);
    setEditedCategories(updated);
  };
  
  const handleAddCategory = () => {
    if (newCategory.name.trim() === '') return;
    
    const newId = `${Date.now()}`;
    setEditedCategories([
      ...editedCategories,
      { id: newId, name: newCategory.name, ramPerCpu: newCategory.ramPerCpu }
    ]);
    setNewCategory({ name: '', ramPerCpu: 1 });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Update the store with new values
    updateCategories(editedCategories);
    
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
        <h1 className="text-2xl font-semibold text-secondary-900">Manage Categories</h1>
        <p className="mt-2 text-secondary-600">
          Configure CPU categories and RAM allocation per CPU.
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
                Categories updated successfully
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="card">
        <h2 className="mb-6 text-lg font-medium text-secondary-800">CPU Categories</h2>
        
        <div className="mb-6 overflow-hidden rounded-lg border border-secondary-200">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                  RAM per CPU (GB)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200 bg-white">
              {editedCategories.map((category, index) => (
                <tr key={category.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <input
                      type="text"
                      className="w-full border-0 bg-transparent p-0 focus:outline-none focus:ring-0"
                      value={category.name}
                      onChange={(e) => handleUpdateCategory(index, 'name', e.target.value)}
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <input
                      type="number"
                      min="1"
                      className="w-20 border-0 bg-transparent p-0 focus:outline-none focus:ring-0"
                      value={category.ramPerCpu}
                      onChange={(e) => handleUpdateCategory(index, 'ramPerCpu', parseInt(e.target.value) || 1)}
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button
                      type="button"
                      className="text-error-500 hover:text-error-700"
                      onClick={() => handleRemoveCategory(index)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mb-6">
          <h3 className="mb-3 text-md font-medium text-secondary-800">Add New Category</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Category Name"
                className="input"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </div>
            <div className="w-32">
              <input
                type="number"
                min="1"
                placeholder="RAM per CPU"
                className="input"
                value={newCategory.ramPerCpu}
                onChange={(e) => setNewCategory({ ...newCategory, ramPerCpu: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleAddCategory}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
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