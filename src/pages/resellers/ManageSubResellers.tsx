import { useState } from 'react';
import { useUsersStore } from '../../stores/usersStore';
import { Pencil, UserCog, UserX } from 'lucide-react';

export default function ManageSubResellers() {
  const { users, updateUser, deleteUser, setSubResellerParent } = useUsersStore();
  const subResellers = users.filter(user => user.role === 'sub-reseller');
  const resellers = users.filter(user => user.role === 'reseller');
  
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editParentId, setEditParentId] = useState('');
  
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  
  const handleEdit = (id: string, name: string, email: string, parentId?: string) => {
    setEditMode(id);
    setEditName(name);
    setEditEmail(email);
    setEditParentId(parentId || '');
  };
  
  const handleSave = (id: string) => {
    updateUser(id, {
      name: editName,
      email: editEmail,
    });
    
    if (editParentId) {
      setSubResellerParent(id, editParentId);
    }
    
    setEditMode(null);
  };
  
  const handleCancel = () => {
    setEditMode(null);
  };
  
  const handleDeleteConfirm = (id: string) => {
    setShowConfirmDelete(id);
  };
  
  const handleDeleteCancel = () => {
    setShowConfirmDelete(null);
  };
  
  const handleDelete = (id: string) => {
    deleteUser(id);
    setShowConfirmDelete(null);
  };
  
  const getCreatorName = (createdBy?: string) => {
    if (!createdBy) return 'Unknown';
    const creator = users.find(u => u.id === createdBy);
    return creator ? `${creator.name} (${creator.role})` : 'Unknown';
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary-900">Manage Sub-Resellers</h1>
        <p className="mt-2 text-secondary-600">
          View, edit, and manage your sub-reseller accounts.
        </p>
      </div>
      
      <div className="card overflow-hidden">
        <div className="border-b border-secondary-200 pb-5">
          <h2 className="text-lg font-medium text-secondary-800">Sub-Reseller List</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                  Parent Reseller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200 bg-white">
              {subResellers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-secondary-500">
                    No sub-resellers found
                  </td>
                </tr>
              ) : (
                subResellers.map(subReseller => {
                  const parentReseller = users.find(u => u.id === subReseller.parentResellerId);
                  
                  return (
                    <tr key={subReseller.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-700">
                        {editMode === subReseller.id ? (
                          <input
                            type="text"
                            className="input"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        ) : (
                          subReseller.name
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-700">
                        {editMode === subReseller.id ? (
                          <input
                            type="email"
                            className="input"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                          />
                        ) : (
                          subReseller.email
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-700">
                        {editMode === subReseller.id ? (
                          <select
                            className="select"
                            value={editParentId}
                            onChange={(e) => setEditParentId(e.target.value)}
                          >
                            <option value="">-- Select Reseller --</option>
                            {resellers.map(reseller => (
                              <option key={reseller.id} value={reseller.id}>
                                {reseller.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          parentReseller ? parentReseller.name : 'Unassigned'
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-700">
                        {getCreatorName(subReseller.createdBy)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {editMode === subReseller.id ? (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleSave(subReseller.id)}
                              className="btn btn-primary px-2 py-1"
                            >
                              Save
                            </button>
                            <button 
                              onClick={handleCancel}
                              className="btn btn-outline px-2 py-1"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEdit(
                                subReseller.id, 
                                subReseller.name, 
                                subReseller.email,
                                subReseller.parentResellerId
                              )}
                              className="text-primary-600 hover:text-primary-800"
                              title="Edit"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteConfirm(subReseller.id)}
                              className="text-error-600 hover:text-error-800"
                              title="Delete"
                            >
                              <UserX className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Add Sub-Reseller Info */}
        <div className="mt-6 border-t border-secondary-200 pt-6">
          <h3 className="text-md font-medium text-secondary-800">Create New Sub-Reseller</h3>
          <p className="mt-1 text-sm text-secondary-500">
            Use the user management section to create new users and assign them the sub-reseller role.
          </p>
          <div className="mt-4">
            <a 
              href="/settings/users" 
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              <UserCog className="mr-1 h-4 w-4" />
              Go to User Management
            </a>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-secondary-900 bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-medium text-secondary-900">Confirm Delete</h3>
            <p className="mt-2 text-sm text-secondary-600">
              Are you sure you want to delete this sub-reseller? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={() => handleDelete(showConfirmDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}