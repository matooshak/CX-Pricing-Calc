import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useUsersStore } from '../stores/usersStore';
import { CloudCog } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const { users } = useUsersStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Demo login functionality
    // In a real app, this would validate against a backend
    if (email && password) {
      const user = users.find(user => user.email === email);
      if (user) {
        login(user);
      } else {
        setError('Invalid email or password');
      }
    } else {
      setError('Please enter both email and password');
    }
  };

  // Demo credentials for convenience
  const handleDemoLogin = (role: 'admin' | 'reseller' | 'sub-reseller') => {
    const demoUser = users.find(user => user.role === role);
    if (demoUser) {
      login(demoUser);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-secondary-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CloudCog className="h-16 w-16 text-primary-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-secondary-900">
          Cloud Pricing Calculator
        </h2>
        <p className="mt-2 text-center text-sm text-secondary-600">
          Sign in to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-error-50 p-4">
                <p className="text-sm text-error-800">{error}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button type="submit" className="w-full btn btn-primary">
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-secondary-500">
                  Demo logins
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                className="btn btn-outline text-xs"
                onClick={() => handleDemoLogin('admin')}
              >
                Admin
              </button>
              <button
                type="button"
                className="btn btn-outline text-xs"
                onClick={() => handleDemoLogin('reseller')}
              >
                Reseller
              </button>
              <button
                type="button"
                className="btn btn-outline text-xs"
                onClick={() => handleDemoLogin('sub-reseller')}
              >
                Sub-Reseller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}