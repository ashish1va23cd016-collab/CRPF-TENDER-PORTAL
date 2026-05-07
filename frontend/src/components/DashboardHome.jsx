import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function DashboardHome({ onNavigate }) {
  const stats = [
    { label: 'Active Tenders', value: '24', icon: '📄', color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Bids Evaluated', value: '1,432', icon: '✅', color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Pending Reviews', value: '8', icon: '⏳', color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Total Value (Cr)', value: '₹450', icon: '💰', color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const volumeData = [
    { name: 'Jan', volume: 120 },
    { name: 'Feb', volume: 180 },
    { name: 'Mar', volume: 150 },
    { name: 'Apr', volume: 290 },
    { name: 'May', volume: 340 },
    { name: 'Jun', volume: 210 },
  ];

  const disqualificationData = [
    { name: 'Financials', count: 45 },
    { name: 'Experience', count: 32 },
    { name: 'Certifications', count: 85 },
    { name: 'Format', count: 12 },
    { name: 'Past Default', count: 5 },
  ];

  return (
    <div className="space-y-8 fade-in">
      {/* Hero Welcome Banner */}
      <div className="bg-[#1e293b] p-8 md:p-10 rounded-xl shadow-md border-b-4 border-amber-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/crpf_login_bg.png')] bg-cover bg-center opacity-10 mix-blend-screen"></div>
        
        <div className="relative z-10 text-white">
          <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Centralized e-Procurement & Evaluation Engine
          </h2>
          <p className="text-slate-300 text-base max-w-3xl leading-relaxed font-medium">
            Authorized portal for automated bid evaluation, risk modeling, and MHA compliance monitoring. Strictly for official CRPF personnel use.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 transition-colors hover:border-amber-400">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${stat.bg} ${stat.color} bg-opacity-20`}>
              {stat.icon}
            </div>
            <div>
              <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-xl font-black text-[#1e293b] mb-6 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg"><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg></div>
            Evaluation Volume (YTD)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-xl font-black text-[#1e293b] dark:text-white mb-6 flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-lg"><svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div>
            Top Disqualification Reasons
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disqualificationData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 13, fontWeight: 600}} width={95} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 6, 6, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-black text-[#1e293b] dark:text-white mb-4 border-b dark:border-slate-700 pb-2">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => onNavigate('evaluation')} className="w-full text-left p-4 rounded-lg border border-slate-100 hover:border-amber-500 hover:bg-amber-50 transition flex items-center justify-between group">
              <div>
                <div className="font-bold text-[#1e293b]">Tender Evaluation Engine</div>
                <div className="text-xs text-slate-500">Run AI evaluation and risk scoring on bids</div>
              </div>
              <div className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">→</div>
            </button>
            <button onClick={() => onNavigate('active')} className="w-full text-left p-4 rounded-lg border border-slate-100 hover:border-amber-500 hover:bg-amber-50 transition flex items-center justify-between group">
              <div>
                <div className="font-bold text-[#1e293b]">View Active Tenders</div>
                <div className="text-xs text-slate-500">Check currently open procurement requests</div>
              </div>
              <div className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">→</div>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-black text-[#1e293b] dark:text-white mb-4 border-b dark:border-slate-700 pb-2">Recent System Directives</h3>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <div className="text-xs font-bold text-slate-500 w-20 flex-shrink-0">12 May</div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">New risk assessment parameters implemented for capital acquisitions over ₹10 Cr.</div>
            </li>
            <li className="flex gap-4">
              <div className="text-xs font-bold text-slate-500 w-20 flex-shrink-0">08 May</div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Mandatory ISO 9001:2015 verification module activated in the evaluation engine.</div>
            </li>
            <li className="flex gap-4">
              <div className="text-xs font-bold text-slate-500 w-20 flex-shrink-0">02 May</div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Quarterly procurement audit logs finalized and archived successfully.</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
