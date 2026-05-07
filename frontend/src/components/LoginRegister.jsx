import React, { useState } from 'react';

export default function LoginRegister({ onLogin }) {
  const [activeTab, setActiveTab] = useState('vendor-login'); // vendor-login, register, employee
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (activeTab === 'employee') {
      onLogin({ name: name || 'Authorized Officer', email: email || 'officer@crpf.gov.in', role: 'employee' });
    } else {
      onLogin({ name: name || 'Vendor Rep', email: email || 'vendor@example.com', role: 'vendor' });
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-4 fade-in">
      <div className="bg-white dark:bg-[#1e293b] w-full max-w-5xl rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row h-[600px]">
        {/* Left Side - Image/Branding */}
        <div className="md:w-5/12 bg-slate-800 relative hidden md:flex flex-col justify-between">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: "url('/images/crpf_login_bg.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          </div>
          
          <div className="relative z-10 p-8 flex items-center gap-3">
             <div className="w-12 h-16 bg-gradient-to-b from-amber-500 to-amber-700 rounded-b-full flex items-center justify-center p-1 border-2 border-white outline outline-2 outline-amber-600">
                <div className="w-6 h-6 border-4 border-white/50 rounded-full flex items-center justify-center">
                   <div className="w-2 h-2 bg-white/80 rounded-sm"></div>
                </div>
             </div>
             <div>
               <h2 className="text-white font-black text-xl leading-tight">CRPF</h2>
               <p className="text-slate-300 text-xs font-medium">Tender Portal</p>
             </div>
          </div>

          <div className="relative z-10 p-8">
            <h1 className="text-3xl font-black text-white mb-2">Secure Procurement</h1>
            <p className="text-slate-300 text-sm">Welcome to the modernized tender evaluation platform. Powered by BidAssure AI.</p>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="md:w-7/12 bg-white flex flex-col h-full overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button 
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition ${activeTab === 'vendor-login' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('vendor-login')}
            >
              Registered User
            </button>
            <button 
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition ${activeTab === 'register' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('register')}
            >
              New Registration
            </button>
            <button 
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition ${activeTab === 'employee' ? 'text-amber-600 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('employee')}
            >
              Employee Login
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-8 md:p-12 flex items-center justify-center">
            <div className="w-full max-w-sm">
              <div className="text-center mb-8 md:hidden">
                 <h2 className="text-[#1e293b] font-black text-2xl">CRPF Tender Portal</h2>
              </div>
              <h2 className="text-2xl font-black text-[#1e293b] mb-6">
                {activeTab === 'vendor-login' && 'Vendor Login'}
                {activeTab === 'register' && 'Create Vendor Account'}
                {activeTab === 'employee' && 'Officer Login'}
              </h2>

              <form onSubmit={handleLogin} className="space-y-4">
                {(activeTab === 'register' || activeTab === 'employee') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {activeTab === 'employee' ? 'Gov.in Email' : 'Email / User ID'}
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                    {activeTab !== 'register' && (
                      <a href="#" className="text-xs text-amber-600 hover:text-amber-700 font-bold">Forgot Password?</a>
                    )}
                  </div>
                  <input 
                    type="password" 
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {activeTab === 'register' && (
                  <div className="flex items-start gap-2 mt-2">
                    <input type="checkbox" className="mt-1" id="terms" required />
                    <label htmlFor="terms" className="text-xs text-slate-600">
                      I agree to the <a href="#" className="text-amber-600 hover:underline">Terms & Conditions</a> and <a href="#" className="text-amber-600 hover:underline">Privacy Policy</a> of the CRPF portal.
                    </label>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full py-3 px-4 bg-[#1e293b] hover:bg-slate-800 text-white font-bold rounded-lg shadow-md transition mt-4"
                >
                  {activeTab === 'vendor-login' && 'Secure Login'}
                  {activeTab === 'register' && 'Register Account'}
                  {activeTab === 'employee' && 'Authenticate'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-xs text-slate-500">
                  By accessing this system, you agree to abide by the <br/>
                  <span className="font-semibold">IT Act 2000 & Official Secrets Act 1923</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
