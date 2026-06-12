'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Droplets, Wifi, AlertTriangle, LogOut, User, Activity } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Client-side guard — middleware handles SSR
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, router]);

  function handleLogout() {
    logout();
    router.push('/auth/login');
  }

  if (!isAuthenticated || !user) return null;

  const stats = [
    { icon: Droplets, label: 'Active Devices',  value: '0',  sub: 'No devices yet',    color: 'text-water-400',   bg: 'bg-water-500/10'   },
    { icon: Activity,    label: 'Readings Today',  value: '0',  sub: 'Awaiting data',     color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: AlertTriangle, label: 'Open Alerts',  value: '0',  sub: 'All clear',          color: 'text-amber-400',  bg: 'bg-amber-500/10'   },
    { icon: Wifi,        label: 'System Status',  value: 'OK', sub: 'API connected',     color: 'text-violet-400',  bg: 'bg-violet-500/10'  },
  ];

  return (
    <div className="water-bg min-h-screen">
      {/* Navbar */}
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-water-500/20 border border-water-500/30 flex items-center justify-center">
              <Droplets size={16} className="text-water-400" />
            </div>
            <span className="font-bold tracking-widest text-white text-sm uppercase">EQUA</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-7 h-7 rounded-full bg-water-500/20 border border-water-500/20 flex items-center justify-center">
                <User size={13} className="text-water-400" />
              </div>
              <span className="hidden sm:block">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Welcome banner */}
        <div className="glass-card p-6 mb-8 border-water-500/20 bg-water-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-water-500/20 flex items-center justify-center">
              <span className="text-lg">👋</span>
            </div>
            <div>
              <h2 className="text-white font-semibold">Welcome, {user.name}!</h2>
              <p className="text-slate-400 text-sm">Sprint 1 complete — authentication is live. Add your first device to get started.</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ icon: Icon, label, value, sub, color, bg }) => (
            <div key={label} className="glass-card p-5 hover:border-white/20 transition-colors">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={18} className={color} />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-sm text-slate-400 mt-0.5">{label}</p>
              <p className="text-xs text-slate-600 mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* Placeholder content panels */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass-card p-6 min-h-48 flex flex-col items-center justify-center text-center">
            <Activity size={32} className="text-slate-700 mb-3" />
            <p className="text-slate-500 text-sm">Live readings chart will appear here</p>
            <p className="text-slate-700 text-xs mt-1">Sprint 2 — Device Management</p>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            <AlertTriangle size={28} className="text-slate-700 mb-3" />
            <p className="text-slate-500 text-sm">Alert feed</p>
            <p className="text-slate-700 text-xs mt-1">Sprint 3 — Alerts Module</p>
          </div>
        </div>

        {/* Token info for dev */}
        <details className="mt-8 glass-card p-4 text-xs text-slate-600 font-mono cursor-pointer">
          <summary className="text-slate-500 hover:text-slate-400 transition-colors">🔐 Auth debug info</summary>
          <div className="mt-3 space-y-1 break-all">
            <p><span className="text-slate-400">User ID:</span> {user.id}</p>
            <p><span className="text-slate-400">Email:</span> {user.email}</p>
            <p><span className="text-slate-400">Role:</span> {user.role}</p>
            <p><span className="text-slate-400">Active:</span> {String(user.isActive)}</p>
          </div>
        </details>
      </main>
    </div>
  );
}
