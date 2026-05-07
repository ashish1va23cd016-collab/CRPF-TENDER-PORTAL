import React from 'react';

export default function ArchiveTenders() {
  const archives = [
    { id: 'CRPF/PROC/2025/44', desc: 'Supply of Winter Clothing', awardedTo: 'Himalayan Gears Pvt Ltd', amount: '₹ 2.4 Cr', date: '15-12-2025' },
    { id: 'CRPF/IT/2025/32', desc: 'Upgradation of Communication Systems', awardedTo: 'TechNet Solutions', amount: '₹ 5.1 Cr', date: '02-11-2025' },
    { id: 'CRPF/ENGG/2025/19', desc: 'Renovation of Training Facilities', awardedTo: 'BuildWell Constructions', amount: '₹ 1.8 Cr', date: '28-09-2025' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-full">
      <div className="bg-gradient-to-r from-slate-100 to-white px-6 py-4 border-b border-slate-200">
         <h2 className="text-xl font-black text-[#1e293b] flex items-center gap-2">
           <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
           Archive Tenders
         </h2>
         <p className="text-sm text-slate-500 mt-1 font-medium">Historical record of awarded tenders.</p>
      </div>
      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
            <tr>
              <th className="px-6 py-4">Tender Reference No.</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Awarded To</th>
              <th className="px-6 py-4">Value</th>
              <th className="px-6 py-4">Award Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {archives.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono font-semibold text-[#1e293b]">{item.id}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{item.desc}</td>
                <td className="px-6 py-4 font-bold text-green-700">{item.awardedTo}</td>
                <td className="px-6 py-4 font-semibold">{item.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
