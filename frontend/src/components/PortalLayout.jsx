import React, { useState, useEffect } from 'react';

export default function PortalLayout({ user, onLogout, children, currentView, setCurrentView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Handle dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const mockNotifications = [
    { id: 1, text: "High-risk bid detected in Jammu Sector procurement.", time: "10 mins ago", unread: true },
    { id: 2, text: "5 new vendors registered today.", time: "2 hours ago", unread: true },
    { id: 3, text: "System update v2.0 deployed successfully.", time: "1 day ago", unread: false }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar - Accessibility & Quick Links */}
      <div className="bg-[#1e293b] text-slate-300 text-xs py-1.5 px-4 md:px-8 justify-between items-center border-b border-slate-700 hidden md:flex">
        <div className="flex gap-4 items-center flex-wrap">
          <a href="#" className="hover:text-white transition-colors">Screen Reader Access</a>
          <span className="text-slate-600">|</span>
          <a href="#" className="hover:text-white transition-colors">Skip to Main Content</a>
          <span className="text-slate-600">|</span>
          <div className="flex gap-1 items-center">
            <button className="px-1.5 hover:bg-slate-700 rounded transition-colors text-white">A-</button>
            <button className="px-1.5 hover:bg-slate-700 rounded transition-colors text-white font-bold">A</button>
            <button className="px-1.5 hover:bg-slate-700 rounded transition-colors text-white text-sm">A+</button>
          </div>
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <select className="bg-transparent border-none outline-none cursor-pointer hover:text-white transition-colors">
            <option className="bg-slate-800 text-white">English</option>
            <option className="bg-slate-800 text-white">Hindi</option>
          </select>
          <span className="text-slate-600">|</span>
          <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          <span className="text-slate-600">|</span>
          <a href="#" className="hover:text-white transition-colors">Feedback</a>
        </div>
      </div>

      {/* Main Header - Logos and Titles */}
      <header className="sticky top-0 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md py-4 px-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm border-b border-slate-200 dark:border-slate-800 relative z-50 gap-4 transition-all duration-300">
        <div className="flex items-center gap-3 md:gap-4 max-w-full">
          <div className="w-12 h-16 md:w-16 md:h-20 flex-shrink-0 bg-gradient-to-b from-amber-500 to-amber-700 rounded-b-full shadow-md flex items-center justify-center p-1 border-2 border-white dark:border-slate-800 outline outline-2 outline-amber-600 relative overflow-hidden group">
             {/* Mock Emblem */}
             <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-white/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-white/80 rounded-sm"></div>
             </div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-3xl font-black text-[#1e293b] dark:text-white tracking-tight leading-tight truncate md:whitespace-normal drop-shadow-sm">CENTRAL RESERVE POLICE FORCE</h1>
            <p className="text-xs md:text-base text-slate-500 dark:text-slate-400 font-bold truncate md:whitespace-normal uppercase tracking-wide">Govt. of India | Ministry of Home Affairs</p>
          </div>
        </div>
        
        {/* Right side logos / User Profile */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              )}
            </button>

            {/* Notifications */}
            {user && (
              <div className="relative hidden md:block">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 relative"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-[#0f172a] rounded-full animate-pulse"></span>
                </button>
                
                {/* Notification Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in-up origin-top-right">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-[#0f172a]">
                      <h3 className="text-sm font-black text-[#1e293b] dark:text-white">Notifications</h3>
                      <button className="text-xs text-amber-600 dark:text-amber-500 font-bold hover:underline">Mark all read</button>
                    </div>
                    <ul className="max-h-80 overflow-y-auto">
                      {mockNotifications.map(n => (
                        <li key={n.id} className={`p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer ${n.unread ? 'bg-amber-50/30 dark:bg-amber-900/10' : ''}`}>
                          <div className="flex gap-3">
                            <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${n.unread ? 'bg-amber-500' : 'bg-transparent'}`}></div>
                            <div>
                              <p className={`text-sm ${n.unread ? 'font-bold text-[#1e293b] dark:text-white' : 'font-medium text-slate-600 dark:text-slate-300'}`}>{n.text}</p>
                              <p className="text-xs text-slate-400 mt-1 font-semibold">{n.time}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="p-3 text-center bg-slate-50 dark:bg-[#0f172a] border-t border-slate-100 dark:border-slate-700">
                      <button className="text-xs font-bold text-slate-500 hover:text-[#1e293b] dark:hover:text-white transition">View all alerts</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <>
                <div className="hidden md:flex flex-col items-end mr-2">
                   <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Secure Portal</span>
                   <span className="text-sm font-black text-[#0f172a] dark:text-white">{user.name}</span>
                </div>
                
                <div className="relative hidden md:flex items-center">
                  <button onClick={onLogout} className="text-sm font-bold text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition mr-4">Logout</button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1e293b] to-slate-800 flex items-center justify-center text-white font-black shadow-lg border-2 border-white dark:border-slate-800">
                    {user.name.charAt(0)}
                  </div>
                </div>
              </>
            ) : (
              <button 
                onClick={() => { setCurrentView('login'); setMobileMenuOpen(false); }}
                className="hidden md:block px-6 py-2.5 bg-gradient-to-r from-[#1e293b] dark:from-slate-700 to-slate-800 dark:to-slate-900 hover:from-slate-800 hover:to-black text-white text-sm font-black uppercase tracking-wider rounded-lg shadow-[0_4px_14px_rgba(30,41,59,0.3)] hover:shadow-[0_6px_20px_rgba(30,41,59,0.4)] transition-all transform hover:-translate-y-0.5"
              >
                Login / Register
              </button>
            )}
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded ml-auto flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
      </header>

      {/* Main Navigation (Hidden on mobile unless opened) */}
      <nav className={`bg-[#1e293b] border-b-4 border-amber-500 shadow-md relative z-40 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
        <div className="px-4 md:px-8 max-w-[1600px] mx-auto">
          <ul className="flex flex-col md:flex-row text-sm font-black text-slate-300 uppercase tracking-wider items-start md:items-center w-full">
            <li>
              <button onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }} className={`block px-4 py-3.5 transition-all w-full text-left md:w-auto ${currentView === 'home' ? 'bg-amber-500 text-[#1e293b] shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]' : 'hover:bg-slate-800 hover:text-white'}`}>
                Home
              </button>
            </li>
            <li>
              <button onClick={() => { setCurrentView('about'); setMobileMenuOpen(false); }} className={`block px-4 py-3.5 transition-all w-full text-left md:w-auto ${currentView === 'about' ? 'bg-amber-500 text-[#1e293b] shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]' : 'hover:bg-slate-800 hover:text-white'}`}>
                About Us
              </button>
            </li>
            <li>
              <button onClick={() => { setCurrentView('organization'); setMobileMenuOpen(false); }} className={`block px-4 py-3.5 transition-all w-full text-left md:w-auto ${currentView === 'organization' ? 'bg-amber-500 text-[#1e293b] shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]' : 'hover:bg-slate-800 hover:text-white'}`}>
                Organization
              </button>
            </li>
            <li>
              <button onClick={() => { setCurrentView('dte-zone'); setMobileMenuOpen(false); }} className={`block px-4 py-3.5 transition-all w-full text-left md:w-auto ${currentView === 'dte-zone' ? 'bg-amber-500 text-[#1e293b] shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]' : 'hover:bg-slate-800 hover:text-white'}`}>
                Dte/Zone
              </button>
            </li>
            <li>
              <button onClick={() => { setCurrentView('training'); setMobileMenuOpen(false); }} className={`block px-4 py-3.5 transition-all w-full text-left md:w-auto ${currentView === 'training' ? 'bg-amber-500 text-[#1e293b] shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]' : 'hover:bg-slate-800 hover:text-white'}`}>
                Training
              </button>
            </li>
            <li>
              <button onClick={() => { setCurrentView('evaluation'); setMobileMenuOpen(false); }} className={`block px-4 py-3.5 transition-all w-full text-left md:w-auto ${['evaluation', 'active', 'archive', 'faqs', 'qrs', 'procurement-plan', 'mha-guidelines'].includes(currentView) ? 'bg-amber-500 text-[#1e293b] shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]' : 'hover:bg-slate-800 hover:text-white'}`}>
                Tenders
              </button>
            </li>
            <li>
              <button onClick={() => { setCurrentView('contact'); setMobileMenuOpen(false); }} className={`block px-4 py-3.5 transition-all w-full text-left md:w-auto ${currentView === 'contact' ? 'bg-amber-500 text-[#1e293b] shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]' : 'hover:bg-slate-800 hover:text-white'}`}>
                Contact Us
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Page Body Wrapper */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col md:flex-row items-stretch bg-slate-50 dark:bg-[#0f172a] relative z-0">
        
        {/* Sidebar */}
        <aside className={`w-full md:w-64 flex-shrink-0 bg-white dark:bg-[#1e293b] border-r border-slate-200 dark:border-slate-800 shadow-[2px_0_15px_rgba(0,0,0,0.03)] z-10 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="p-5 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-sm font-black text-[#1e293b] dark:text-white uppercase tracking-widest flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
              Tenders Menu
            </h2>
          </div>
          <ul className="flex flex-col py-3 space-y-1 px-3">
            {!user && (
              <li>
                <button 
                  onClick={() => { setCurrentView('login'); setMobileMenuOpen(false); }}
                  className={`w-full text-left block px-4 py-3 rounded-lg text-sm font-bold transition-all md:hidden ${currentView === 'login' ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 shadow-sm border border-amber-100 dark:border-amber-900/50' : 'text-slate-600 dark:text-slate-400 hover:text-[#1e293b] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  Login / Register
                </button>
              </li>
            )}
            <li>
              <button 
                onClick={() => { setCurrentView('evaluation'); setMobileMenuOpen(false); }}
                className={`w-full text-left block px-4 py-3 rounded-lg text-sm font-bold transition-all ${currentView === 'evaluation' ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 shadow-sm border border-amber-100 dark:border-amber-900/50' : 'text-slate-600 dark:text-slate-400 hover:text-[#1e293b] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                Tender Evaluation Tool
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentView('compare'); setMobileMenuOpen(false); }}
                className={`w-full text-left block px-4 py-3 rounded-lg text-sm font-bold transition-all flex justify-between items-center ${currentView === 'compare' ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 shadow-sm border border-amber-100 dark:border-amber-900/50' : 'text-slate-600 dark:text-slate-400 hover:text-[#1e293b] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                <span>Compare Bidders</span>
                <span className="text-[10px] font-black uppercase bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">New</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentView('active'); setMobileMenuOpen(false); }}
                className={`w-full text-left block px-4 py-3 rounded-lg text-sm font-bold transition-all ${currentView === 'active' ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 shadow-sm border border-amber-100 dark:border-amber-900/50' : 'text-slate-600 dark:text-slate-400 hover:text-[#1e293b] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              >
                Active Tenders
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentView('archive'); setMobileMenuOpen(false); }}
                className={`w-full text-left block px-4 py-3 rounded-lg text-sm font-bold transition-all ${currentView === 'archive' ? 'text-amber-700 bg-amber-50 shadow-sm border border-amber-100' : 'text-slate-600 hover:text-[#1e293b] hover:bg-slate-100'}`}
              >
                Archive Tenders
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentView('faqs'); setMobileMenuOpen(false); }}
                className={`w-full text-left block px-4 py-3 rounded-lg text-sm font-bold transition-all ${currentView === 'faqs' ? 'text-amber-700 bg-amber-50 shadow-sm border border-amber-100' : 'text-slate-600 hover:text-[#1e293b] hover:bg-slate-100'}`}
              >
                Tender FAQ's
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden min-h-[600px] bg-slate-50 relative">
          {/* Breadcrumbs */}
          <div className="mb-6 hidden md:flex items-center text-xs font-black text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-amber-600 transition-colors">Home</a>
            <span className="mx-3 text-slate-300">/</span>
            <a href="#" className="hover:text-amber-600 transition-colors">Tenders</a>
            <span className="mx-3 text-slate-300">/</span>
            <span className="text-[#1e293b]">
              {currentView === 'home' && 'Welcome Home'}
              {currentView === 'about' && 'About CRPF'}
              {currentView === 'organization' && 'Organization Structure'}
              {currentView === 'dte-zone' && 'Directorate / Zones'}
              {currentView === 'training' && 'Training Institutes'}
              {currentView === 'contact' && 'Contact Support'}
              {currentView === 'evaluation' && 'Tender Evaluation Engine'}
              {currentView === 'compare' && 'Multi-Bidder Comparison'}
              {currentView === 'active' && 'Active Tenders'}
              {currentView === 'archive' && 'Archive Tenders'}
              {currentView === 'faqs' && 'Frequently Asked Questions'}
              {currentView === 'login' && 'Secure Login'}
            </span>
          </div>

          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="bg-[#0f172a] text-slate-400 py-10 px-4 mt-auto border-t-4 border-amber-600 relative z-10">
         <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                <div className="w-3 h-3 bg-slate-600 rounded-sm"></div>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Website Content owned by CRPF</p>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Copyright © {new Date().getFullYear()} Central Reserve Police Force</p>
         </div>
      </footer>
    </div>
  );
}
