import React, { useRef } from 'react'
import html2pdf from 'html2pdf.js'

export default function DetailedResultsModal({
  isOpen,
  onClose,
  decision,
  confidence,
  reasons,
  evidence,
  comparisons,
  criteria,
  bidder,
  tenderText,
  bidderText,
  complianceScore,
  matchedCount,
  flaggedCount,
  riskScore,
  fraudFlags,
}) {
  const reportRef = useRef(null)
  const confidencePercent = confidence != null ? Math.round(confidence * 100) : 0
  const criteriaCount = criteria?.length || 0

  function downloadPDF() {
    if (!reportRef.current) return
    
    const element = reportRef.current
    const opt = {
      margin: 10,
      filename: `tender-evaluation-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    }

    html2pdf().set(opt).from(element).save()
  }

  function getDecisionColor() {
    if (decision === 'Eligible') return 'text-[#0b4f3a]'
    if (decision === 'Not Eligible') return 'text-[#8c1f1f]'
    return 'text-[#8a6a00]'
  }

  function getDecisionBg() {
    if (decision === 'Eligible') return 'bg-[#e6f3eb]'
    if (decision === 'Not Eligible') return 'bg-[#fdecec]'
    return 'bg-[#fff6df]'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-auto flex items-start justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="sticky top-0 bg-[#0b4f3a] text-white p-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold">Tender Evaluation Report</h2>
            <p className="text-sm opacity-90 mt-1">{new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold opacity-80 hover:opacity-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Report Content */}
        <div ref={reportRef} className="p-8 space-y-8" style={{ backgroundColor: '#ffffff' }}>
          {/* Decision Section */}
          <div className={`rounded-xl p-6 border-2 ${getDecisionBg()} border-current`}>
            <div className="text-center">
              <div className="text-5xl mb-3">
                {decision === 'Eligible' ? '✔' : decision === 'Not Eligible' ? '✖' : '⚠'}
              </div>
              <h1 className={`text-4xl font-bold mb-2 ${getDecisionColor()}`}>{decision}</h1>
              <p className="text-lg text-gray-700">
                {decision === 'Eligible'
                  ? 'The bidder has met all mandatory tender requirements and qualifies to proceed.'
                  : decision === 'Not Eligible'
                  ? 'The bidder does not meet critical requirements and is disqualified.'
                  : 'Manual review is recommended due to incomplete information.'}
              </p>
            </div>
          </div>

          {/* Risk Assessment Section */}
          {riskScore !== null && (
            <div className="rounded-xl p-6 border-2 border-slate-200 bg-slate-50">
              <h2 className="text-2xl font-bold text-[#1e293b] mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                Predictive Risk & Fraud Engine
              </h2>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0 relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={riskScore > 60 ? 'text-red-500' : riskScore > 30 ? 'text-amber-500' : 'text-emerald-500'}
                      strokeDasharray={`${riskScore}, 100`}
                      strokeWidth="3"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-800">{riskScore}%</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Risk Score</span>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Detected Risk Factors</h3>
                  {fraudFlags && fraudFlags.length > 0 ? (
                    <ul className="space-y-2">
                      {fraudFlags.map((flag, idx) => (
                        <li key={idx} className={`p-3 rounded border text-sm font-medium flex items-start gap-3 ${
                          flag.includes('High') ? 'bg-red-50 border-red-200 text-red-800' : 
                          flag.includes('Medium') ? 'bg-amber-50 border-amber-200 text-amber-800' : 
                          'bg-slate-100 border-slate-200 text-slate-700'
                        }`}>
                          <span className="mt-0.5">⚠️</span>
                          {flag}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 font-medium flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      No significant fraud indicators detected.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Key Metrics */}
          <div>
            <h2 className="text-2xl font-bold text-[#123126] mb-4">Evaluation Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-lg border border-gray-300 p-4 text-center">
                <div className="text-sm text-gray-600 font-semibold">Compliance Score</div>
                <div className="text-3xl font-bold text-[#0b4f3a] mt-2">{criteriaCount ? `${complianceScore}%` : '—'}</div>
              </div>
              <div className="rounded-lg border border-gray-300 p-4 text-center">
                <div className="text-sm text-gray-600 font-semibold">Confidence</div>
                <div className="text-3xl font-bold text-[#0b4f3a] mt-2">{confidencePercent}%</div>
              </div>
              <div className="rounded-lg border border-gray-300 p-4 text-center">
                <div className="text-sm text-gray-600 font-semibold">Requirements Met</div>
                <div className="text-3xl font-bold text-green-600 mt-2">{matchedCount}/{criteriaCount}</div>
              </div>
              <div className="rounded-lg border border-gray-300 p-4 text-center">
                <div className="text-sm text-gray-600 font-semibold">Requirements Flagged</div>
                <div className="text-3xl font-bold text-red-600 mt-2">{flaggedCount}</div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          {comparisons && comparisons.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#123126] mb-4">Requirement-by-Requirement Analysis</h2>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-[#eef4ef]">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Requirement</th>
                      <th className="px-4 py-3 text-left font-semibold">Bidder Value</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((row, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-3 font-medium">{row.requirement}</td>
                        <td className="px-4 py-3">{row.bidder_value}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              row.status === 'Matched'
                                ? 'bg-green-100 text-green-700'
                                : row.status === 'Not matched'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{row.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Findings */}
          {reasons && reasons.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#123126] mb-4">Key Findings</h2>
              <div className="space-y-2">
                {reasons.map((reason, idx) => {
                  const isPositive = String(reason).startsWith('✓') || reason.toLowerCase().includes('satisfied')
                  return (
                    <div key={idx} className={`p-3 rounded-lg border-l-4 ${
                      isPositive
                        ? 'bg-green-50 border-green-500 text-green-900'
                        : 'bg-red-50 border-red-500 text-red-900'
                    }`}>
                      <span className="font-semibold">{reason}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Evidence */}
          {evidence && evidence.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#123126] mb-4">Supporting Evidence</h2>
              <ul className="space-y-2">
                {evidence.map((ev, idx) => (
                  <li key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xl flex-shrink-0">📄</span>
                    <span className="text-gray-800">{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tender Text */}
          {tenderText && (
            <div>
              <h2 className="text-2xl font-bold text-[#123126] mb-4">Tender Requirements (Original)</h2>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-sm text-gray-800 whitespace-pre-wrap break-words">
                {tenderText.substring(0, 500)}{tenderText.length > 500 ? '...' : ''}
              </div>
            </div>
          )}

          {/* Bidder Text */}
          {bidderText && (
            <div>
              <h2 className="text-2xl font-bold text-[#123126] mb-4">Bidder Submission (Original)</h2>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-sm text-gray-800 whitespace-pre-wrap break-words">
                {bidderText.substring(0, 500)}{bidderText.length > 500 ? '...' : ''}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-xs text-gray-500 text-center pt-6 border-t">
            <p>This report was generated by Tender Evidence Copilot</p>
            <p>{new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-6 flex gap-3 justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Close
          </button>
          <button
            onClick={downloadPDF}
            className="px-6 py-2 bg-[#0b4f3a] text-white rounded-lg font-medium hover:bg-[#0a4332] transition flex items-center gap-2 shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span>Export Certified Audit Report</span>
          </button>
        </div>
      </div>
    </div>
  )
}
