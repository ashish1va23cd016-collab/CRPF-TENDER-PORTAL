import React from 'react';

export default function ActiveTenders({ onEvaluate }) {
  const tenders = [
    { id: 'CRPF/PROC/2026/01', desc: 'Supply of Bulletproof Jackets Level-IV', date: '01-05-2026', close: '20-05-2026', status: 'Open' },
    { id: 'CRPF/IT/2026/15', desc: 'AMC for Data Center Infrastructure', date: '28-04-2026', close: '15-05-2026', status: 'Open' },
    { id: 'CRPF/ENGG/2026/08', desc: 'Construction of Barracks at Camp Alpha', date: '25-04-2026', close: '18-05-2026', status: 'Open' },
    { id: 'CRPF/PROC/2026/12', desc: 'Procurement of Tactical Drones', date: '03-05-2026', close: '25-05-2026', status: 'New' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-full">
      <div className="bg-gradient-to-r from-slate-100 to-white px-6 py-4 border-b border-slate-200">
         <h2 className="text-xl font-black text-[#1e293b] flex items-center gap-2">
           <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
           Active Tenders
         </h2>
         <p className="text-sm text-slate-500 mt-1 font-medium">List of currently open tenders requesting evaluation.</p>
      </div>
      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
            <tr>
              <th className="px-6 py-4">Tender Reference No.</th>
              <th className="px-6 py-4">Subject / Description</th>
              <th className="px-6 py-4">Published Date</th>
              <th className="px-6 py-4">Closing Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenders.map((tender, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono font-semibold text-[#1e293b]">{tender.id}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{tender.desc}</td>
                <td className="px-6 py-4 whitespace-nowrap">{tender.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-red-600 font-semibold">{tender.close}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${tender.status === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {tender.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={onEvaluate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm transition"
                  >
                    Evaluate Bids
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
