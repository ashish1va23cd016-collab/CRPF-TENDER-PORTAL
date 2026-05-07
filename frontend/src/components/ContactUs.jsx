import React from 'react';

export default function ContactUs() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-slate-100 to-white px-8 py-6 border-b border-slate-200">
        <h2 className="text-2xl font-black text-[#1e293b]">Contact Support</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50">
          <h3 className="text-lg font-bold text-[#1e293b] mb-4">Get in Touch</h3>
          <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed">
            For any queries regarding the portal, tender evaluations, or technical support, please contact the IT Helpdesk.
          </p>
          
          <div className="space-y-4 text-sm font-medium">
            <div className="flex gap-3">
              <span className="text-amber-500">📍</span>
              <span className="text-slate-700">Directorate General, CRPF<br/>CGO Complex, Lodhi Road<br/>New Delhi - 110003</span>
            </div>
            <div className="flex gap-3">
              <span className="text-amber-500">📞</span>
              <span className="text-slate-700">011-24360245 (Ext. 123)</span>
            </div>
            <div className="flex gap-3">
              <span className="text-amber-500">✉️</span>
              <span className="text-slate-700">it-helpdesk@crpf.gov.in</span>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <h3 className="text-lg font-bold text-[#1e293b] mb-4">Send a Message</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Name</label>
              <input type="text" className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Official Email</label>
              <input type="email" className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Message</label>
              <textarea rows="3" className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none"></textarea>
            </div>
            <button type="button" className="w-full bg-[#1e293b] text-white font-bold py-2 rounded text-sm hover:bg-slate-800 transition">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
