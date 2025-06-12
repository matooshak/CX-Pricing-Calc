import { useState } from 'react';
import { useUsersStore } from '../../stores/usersStore';
import { UserRole, useAuthStore, type User } from '../../stores/authStore';
import { Pencil, UserX, UserPlus, Key } from 'lucide-react';

export default function ManageUsers() {
  const { user: currentUser } = useAuthStore();
  const { 
    users, 
    addUser, 
    updateUser, 
    deleteUser, 
    resetPassword,
  } = useUsersStore();

  const [editMode, setEditMode] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('reseller');
  const [editVpsMargin, setEditVpsMargin] = useState<number>(0);
  const [editBaasMargin, setEditBaasMargin] = useState<number>(0);
  const [editParentResellerId, setEditParentResellerId] = useState<string | null>(null);
  const [editPassword, setEditPassword] = useState('');

  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('reseller');
  const [newUserVpsMargin, setNewUserVpsMargin] = useState<number>(0);
  const [newUserBaasMargin, setNewUserBaasMargin] = useState<number>(0);
  const [newUserParentResellerId, setNewUserParentResellerId] = useState<string | null>(null);
  const [newUserPassword, setNewUserPassword] = useState('');

  const [showResetPassword, setShowResetPassword] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  const handleEdit = (user: User) => {
    setEditMode(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditVpsMargin(user.vpsMargin || 0);
    setEditBaasMargin(user.baasMargin || 0);
    setEditParentResellerId(user.parentResellerId || '');
    setEditPassword('');
  };

  const handleSave = (id: string) => {
    const updates: Partial<User> = {
      name: editName,
      email: editEmail,
      role: editRole,
      vpsMargin: editVpsMargin,
      baasMargin: editBaasMargin,
      parentResellerId: editRole === 'sub-reseller' ? editParentResellerId || undefined : undefined,
    };

    // Only update password if it was changed
    if (editPassword) {
      updateUser(id, updates, editPassword);
    } else {
      updateUser(id, updates);
    }
    
    setEditMode(null);
  };

  const handleCancel = () => {
    setEditMode(null);
  };

  const handleResetPassword = (id: string) => {
    if (newPassword === confirmPassword) {
      resetPassword(id, newPassword);
      setShowResetPassword(null);
      setNewPassword('');
      setConfirmPassword('');
    }
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

  const handleAddUser = () => {
    if (newUserName.trim() === '' || newUserEmail.trim() === '' || newUserPassword.trim() === '') return;

    // If current user is a reseller and creating a sub-reseller, set themselves as parent
    const parentResellerId = currentUser?.role === 'reseller' && newUserRole === 'sub-reseller'
      ? currentUser.id
      : newUserParentResellerId || undefined;

    const newUser: Omit<User, 'id'> & { password: string } = {
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      password: newUserPassword,
      vpsMargin: newUserVpsMargin,
      baasMargin: newUserBaasMargin,
      parentResellerId,
      createdBy: currentUser?.id
    };

    addUser(newUser);

    // Reset form
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('reseller');
    setNewUserPassword('');
    setNewUserVpsMargin(0);
    setNewUserBaasMargin(0);
    setNewUserParentResellerId('');
    setShowNewUserForm(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary-900">Manage Users</h1>
        <p className="mt-2 text-secondary-600">
          Create, edit, and manage user accounts and roles.
        </p>
      </div>
      
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-secondary-200 pb-5">
          <h2 className="text-lg font-medium text-secondary-800">Users List</h2>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
            onClick={() => setShowNewUserForm(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </button>
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
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200 bg-white">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-700">
                    {editMode === user.id ? (
                      <input
                        type="text"
                        className="input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-700">
                    {editMode === user.id ? (
                      <input
                        type="email"
                        className="input"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-secondary-700">
                    {editMode === user.id ? (
                      <>
                        <select
                          className="select mb-2"
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value as UserRole)}
                        >
                          <option value="admin">Admin</option>
                          <option value="reseller">Reseller</option>
                          <option value="sub-reseller">Sub-Reseller</option>
                        </select>
                        <input
                          type="password"
                          className="input"
                          placeholder="New password (optional)"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                        />
                      </>
                    ) : (
                      <span 
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-error-100 text-error-800' 
                            : user.role === 'reseller'
                              ? 'bg-primary-100 text-primary-800'
                              : 'bg-secondary-100 text-secondary-800'
                        }`}
                      >
                        {user.role === 'admin' 
                          ? 'Admin' 
                          : user.role === 'reseller'
                            ? 'Reseller'
                            : 'Sub-Reseller'
                        }
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {editMode === user.id ? (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleSave(user.id)}
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
                          onClick={() => handleEdit(user)}
                          className="text-primary-600 hover:text-primary-800"
                          title="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setShowResetPassword(user.id)}
                          className="text-warning-600 hover:text-warning-800"
                          title="Reset Password"
                        >
                          <Key className="h-5 w-5" />
                        </button>
                        {user.role !== 'admin' && (
                          <button 
                            onClick={() => handleDeleteConfirm(user.id)}
                            className="text-error-600 hover:text-error-800"
                            title="Delete"
                          >
                            <UserX className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* New User Modal */}
      {showNewUserForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-secondary-900 bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-medium text-secondary-900">Add New User</h3>
            <div className="mt-4 space-y-4">
              <div className="form-group">
                <label htmlFor="new-name" className="form-label">Name</label>
                <input
                  id="new-name"
                  type="text"
                  className="input"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-email" className="form-label">Email</label>
                <input
                  id="new-email"
                  type="email"
                  className="input"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-password" className="form-label">Password</label>
                <input
                  id="new-password"
                  type="password"
                  className="input"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-role" className="form-label">Role</label>
                <select
                  id="new-role"
                  className="select"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                >
                  <option value="admin">Admin</option>
                  <option value="reseller">Reseller</option>
                  <option value="sub-reseller">Sub-Reseller</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={() => setShowNewUserForm(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleAddUser}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Reset Password Modal */}
      {showResetPassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-secondary-900 bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-medium text-secondary-900">Reset Password</h3>
            <div className="mt-4 space-y-4">
              <div className="form-group">
                <label htmlFor="new-password" className="form-label">New Password</label>
                <input
                  id="new-password"
                  type="password"
                  className="input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  className="input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={() => {
                  setShowResetPassword(null);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => handleResetPassword(showResetPassword)}
                disabled={!newPassword || newPassword !== confirmPassword}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-secondary-900 bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-lg font-medium text-secondary-900">Confirm Delete</h3>
            <p className="mt-2 text-sm text-secondary-600">
              Are you sure you want to delete this user? This action cannot be undone.
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