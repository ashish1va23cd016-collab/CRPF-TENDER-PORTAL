import React, { useState } from 'react';

export default function BidComparisonMatrix() {
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const criteria = [
    { id: 'c1', name: 'Technical Compliance', weight: '40%' },
    { id: 'c2', name: 'Financial Stability', weight: '30%' },
    { id: 'c3', name: 'Past Experience', weight: '20%' },
    { id: 'c4', name: 'Delivery Timeline', weight: '10%' },
  ];

  const vendors = [
    {
      id: 'GEM/2026/B/1234',
      name: 'Bharat Dynamics Limited',
      scores: { c1: 95, c2: 88, c3: 92, c4: 85 },
      totalScore: 92,
      riskScore: 12,
      status: 'Recommended',
      notes: 'Excellent technical compliance. Solid financials.'
    },
    {
      id: 'GEM/2026/B/1235',
      name: 'Reliance Security Solutions',
      scores: { c1: 75, c2: 60, c3: 80, c4: 90 },
      totalScore: 72,
      riskScore: 45,
      status: 'Flagged',
      notes: 'Weak financials. Missing ISO certifications.'
    },
    {
      id: 'GEM/2026/B/1236',
      name: 'Tata Advanced Systems',
      scores: { c1: 88, c2: 90, c3: 65, c4: 70 },
      totalScore: 82,
      riskScore: 28,
      status: 'Acceptable',
      notes: 'Good financials, but limited past experience in large contracts.'
    }
  ];

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden w-full mx-auto fade-in transition-colors duration-300">
      <div className="bg-slate-50 dark:bg-slate-800 px-8 py-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-[#1e293b] dark:text-white flex items-center gap-3">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            Automated Bid Comparison Matrix
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Cross-reference multiple GeM vendor proposals simultaneously.</p>
        </div>
        {!showResults && !analyzing && (
          <button 
            onClick={handleRunAnalysis}
            className="px-6 py-2.5 bg-[#1e293b] dark:bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Run AI Matrix Analysis
          </button>
        )}
      </div>

      <div className="p-8">
        {analyzing ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-6 text-lg font-bold text-slate-600 dark:text-slate-300 animate-pulse">Running semantic comparison on 3 vendor bids...</p>
          </div>
        ) : !showResults ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path></svg>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No Analysis Run Yet</h3>
            <p className="text-slate-500 mt-2">Click "Run Matrix Analysis" to compare the shortlisted vendors.</p>
          </div>
        ) : (
          <div className="overflow-x-auto fade-in">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-r border-slate-200 dark:border-slate-700 font-black text-[#1e293b] dark:text-white w-1/4">Evaluation Criteria</th>
                  {vendors.map(v => (
                    <th key={v.id} className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-black text-center w-1/4">
                      <div className="text-lg text-[#1e293b] dark:text-white">{v.name}</div>
                      <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Vendor ID: {v.id.toUpperCase()}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {criteria.map(c => (
                  <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="p-4 border-r border-slate-100 dark:border-slate-800">
                      <div className="font-bold text-slate-700 dark:text-slate-300">{c.name}</div>
                      <div className="text-xs text-slate-400 mt-1">Weight: {c.weight}</div>
                    </td>
                    {vendors.map(v => (
                      <td key={`${v.id}-${c.id}`} className="p-4 text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-black text-lg ${
                          v.scores[c.id] >= 90 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          v.scores[c.id] >= 70 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {v.scores[c.id]}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                
                {/* AI Risk Score Row */}
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <td className="p-4 border-r border-slate-100 dark:border-slate-800 font-black text-[#1e293b] dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                    AI Risk Score
                  </td>
                  {vendors.map(v => (
                    <td key={`risk-${v.id}`} className="p-4 text-center">
                      <div className={`text-xl font-black ${
                        v.riskScore <= 20 ? 'text-green-600 dark:text-green-400' :
                        v.riskScore <= 40 ? 'text-amber-500 dark:text-amber-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {v.riskScore}%
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Final Recommendation Row */}
                <tr className="bg-slate-100 dark:bg-[#0f172a] shadow-inner">
                  <td className="p-6 border-r border-white dark:border-slate-800 font-black text-xl text-[#1e293b] dark:text-white">Final Recommendation</td>
                  {vendors.map(v => (
                    <td key={`status-${v.id}`} className="p-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`px-4 py-2 rounded-full text-sm font-black tracking-wide uppercase ${
                          v.status === 'Recommended' ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' :
                          v.status === 'Flagged' ? 'bg-red-500 text-white' :
                          'bg-amber-500 text-white'
                        }`}>
                          {v.status}
                        </span>
                        <span className="text-3xl font-black text-[#1e293b] dark:text-white mt-3">Score: {v.totalScore}</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-[200px] mx-auto">{v.notes}</p>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
