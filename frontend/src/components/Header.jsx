import React, { useState } from 'react'

export default function Header({ user, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <header className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 border-b border-blue-500/20 shadow-2xl sticky top-0 z-40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">BidAssure</h1>
            <p className="text-xs text-blue-300 font-bold tracking-widest">TENDER EVALUATION</p>
          </div>
        </div>

        {/* Navigation and User */}
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-slate-300 hover:text-white text-sm font-bold transition-colors uppercase tracking-wider">Dashboard</a>
            <a href="#" className="text-slate-300 hover:text-white text-sm font-bold transition-colors uppercase tracking-wider">Documentation</a>
            <div className="relative group">
              <button className="text-slate-300 hover:text-white text-sm font-bold transition-colors uppercase tracking-wider flex items-center gap-2">
                Support
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-72 bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-500/30 rounded-lg shadow-2xl shadow-blue-500/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 backdrop-blur-xl z-50">
                <div className="p-4 space-y-3">
                  <div className="border-b border-blue-500/20 pb-3">
                    <p className="text-sm font-bold text-blue-300 uppercase tracking-wider">Support Contact</p>
                    <p className="text-xs text-slate-400 mt-1">Government Registration ID</p>
                    <p className="text-sm font-mono text-cyan-400 font-bold">GOV-2026-BID-000145</p>
                  </div>
                  <div className="border-b border-blue-500/20 pb-3">
                    <p className="text-xs text-slate-400">Primary Contact</p>
                    <p className="text-sm text-slate-200 font-semibold">+91-11-2671-9999</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Email Support</p>
                    <p className="text-sm text-slate-200 font-semibold">support@bidassure.gov.in</p>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
            >
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-blue-400/50" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">{user.name}</span>
              <svg className={`w-4 h-4 text-blue-300 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-500/30 rounded-lg shadow-2xl shadow-blue-500/20 overflow-hidden backdrop-blur-xl">
                <div className="px-4 py-3 border-b border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                  <p className="text-sm font-bold text-white uppercase tracking-wider">{user.name}</p>
                  <p className="text-xs text-blue-300 mt-1 font-mono">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDropdown(false)
                    onLogout()
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-bold text-red-400 hover:bg-red-500/10 transition flex items-center gap-2 uppercase tracking-wider"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
