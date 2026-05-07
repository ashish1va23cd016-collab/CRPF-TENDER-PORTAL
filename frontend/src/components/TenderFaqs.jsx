import React from 'react';

export default function TenderFaqs() {
  const faqs = [
    { q: 'How do I submit a bid online?', a: 'Bids must be submitted exclusively through the Central Public Procurement Portal (CPPP). Ensure you have a valid Digital Signature Certificate (DSC).' },
    { q: 'What documents are required for technical evaluation?', a: 'Standard documents include your PAN, GST registration, past 3 years turnover certificates, ISO certifications (if specified), and experience certificates. Please check the specific Tender RFP for mandatory criteria.' },
    { q: 'Is EMD (Earnest Money Deposit) mandatory for all?', a: 'MSMEs registered under NSIC/Udyog Aadhaar may be exempt from EMD. However, a Bid Security Declaration is usually required. Refer to the specific tender guidelines.' },
    { q: 'How does the BidAssure AI Evaluator work?', a: 'The system parses the uploaded tender requirements and automatically cross-checks them against the bidder\'s uploaded documents, highlighting matching criteria and flagging discrepancies for the procurement officer to review.' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-100 to-white px-6 py-4 border-b border-slate-200">
         <h2 className="text-xl font-black text-[#1e293b] flex items-center gap-2">
           <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           Frequently Asked Questions
         </h2>
      </div>
      <div className="p-6 space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
            <h3 className="text-base font-bold text-[#1e293b] mb-2">{faq.q}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
