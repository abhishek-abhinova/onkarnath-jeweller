'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin, setToken } from '@/lib/adminClient';
import { BUSINESS } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminLogin(form.login, form.password);
      setToken(res.token);
      router.replace('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-hero grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur">
          <div className="flex flex-col items-center text-center">
            <img src="/logo.svg" alt="Logo" className="h-16 w-16" />
            <h1 className="mt-4 font-hindi text-xl font-bold text-maroon-800">Admin Panel</h1>
            <p className="mt-1 text-xs text-charcoal-500">{BUSINESS.name}</p>
          </div>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="label" htmlFor="login">Email or Username</label>
              <input
                id="login"
                className="input"
                autoComplete="username"
                placeholder="admin"
                value={form.login}
                onChange={(e) => setForm((f) => ({ ...f, login: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="input"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
            </div>
            {error && (
              <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{error}</p>
            )}
            <button type="submit" disabled={loading} className="btn btn-gold w-full !py-3">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-ivory-200 px-4 py-3 text-center text-xs text-charcoal-500">
            Demo credentials — username: <b>admin</b> · password: <b>admin123</b>
          </div>

          <a href="/" className="mt-5 block text-center text-xs font-semibold text-gold-700 hover:underline">
            ← Back to website
          </a>
        </div>
      </div>
    </main>
  );
}