import { useState } from 'react';
import { useUsersStore } from '../../stores/usersStore';
import { Pencil, UserCog, UserX } from 'lucide-react';

export default function ManageResellers() {
  const { users, updateUser, deleteUser } = useUsersStore();
  const resellers = users.filter(user => user.role === 'reseller');
  
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  
  const handleEdit = (id: string, name: string, email: string) => {
    setEditMode(id);
    setEditName(name);
    setEditEmail(email);
  };
  
  const handleSave = (id: string) => {
    updateUser(id, {
      name: editName,
      email: editEmail,
    });
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
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary-900">Manage Resellers</h1>
        <p className="mt-2 text-secondary-600">
          View, edit, and manage your reseller accounts.
        </p>
      </div>
      
      <div className="card overflow-hidden">
        <div className="border-b border-secondary-200 pb-5">
          <h2 className="text-lg font-medium text-secondary-800">Reseller List</h2>
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
                  Sub-Resellers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200 bg-white">
              {resellers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-secondary-500">
                    No resellers found
                  </td>
                </tr>
              ) : (
                resellers.map(reseller => {
                  const subResellerCount = users.filter(u => 
                    u.role === 'sub-reseller' && u.parentResellerId === reseller.id
                  ).length;
                  
                  return (
                    <tr key={reseller.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-700">
                        {editMode === reseller.id ? (
                          <input
                            type="text"
                            className="input"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        ) : (
                          reseller.name
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-700">
                        {editMode === reseller.id ? (
                          <input
                            type="email"
                            className="input"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                          />
                        ) : (
                          reseller.email
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-700">
                        <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                          {subResellerCount}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {editMode === reseller.id ? (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleSave(reseller.id)}
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
                              onClick={() => handleEdit(reseller.id, reseller.name, reseller.email)}
                              className="text-primary-600 hover:text-primary-800"
                              title="Edit"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteConfirm(reseller.id)}
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
        
        {/* Add Reseller Form */}
        <div className="mt-6 border-t border-secondary-200 pt-6">
          <h3 className="text-md font-medium text-secondary-800">Create New Reseller</h3>
          <p className="mt-1 text-sm text-secondary-500">
            Use the user management section to create new users and assign them the reseller role.
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
              Are you sure you want to delete this reseller? This action cannot be undone, and any sub-resellers will need to be reassigned.
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