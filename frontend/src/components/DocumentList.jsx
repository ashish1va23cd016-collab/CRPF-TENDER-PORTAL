import React from 'react';

export default function DocumentList({ title, documents }) {
  const handleDownload = (docTitle) => {
    // A tiny, valid blank PDF base64 string
    const pdfBase64 = "JVBERi0xLjAKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCTMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQyXQo+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDExNiAwMDAwMCBuIAp0cmFpbGVyCjwwCi9TaXplIDQKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjE2NAolJUVPRgo=";
    const linkSource = `data:application/pdf;base64,${pdfBase64}`;
    const downloadLink = document.createElement("a");
    const fileName = `${docTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-full">
      <div className="bg-gradient-to-r from-slate-100 to-white px-6 py-4 border-b border-slate-200">
         <h2 className="text-xl font-black text-[#1e293b] flex items-center gap-2">
           <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
           </svg>
           {title}
         </h2>
      </div>
      
      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
              <th className="p-4 font-bold w-16 text-center">S.No.</th>
              <th className="p-4 font-bold">Document Title</th>
              <th className="p-4 font-bold w-40">Date Released</th>
              <th className="p-4 font-bold w-32 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium text-[#1e293b]">
            {documents.map((doc, idx) => (
              <tr key={idx} className="border-b border-slate-100 hover:bg-amber-50/50 transition-colors">
                <td className="p-4 text-center text-slate-400 font-bold">{idx + 1}</td>
                <td className="p-4">{doc.title}</td>
                <td className="p-4 text-slate-500">{doc.date}</td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => handleDownload(doc.title)}
                    className="px-3 py-1.5 bg-[#1e293b] text-white rounded text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1 mx-auto"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    PDF
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
