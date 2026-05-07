import React from 'react'

function TypeIcon({type}){
  if(type === 'numeric') return (<svg className="w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3v18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)
  if(type === 'certification') return (<svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l3 6 6 .5-4.5 4 1 6L12 16l-5.5 2.5 1-6L3 8.5 9 8 12 2z" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>)
  if(type === 'experience') return (<svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 12a4 4 0 100-8 4 4 0 000 8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)
  return (<svg className="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>)
}

export default function CriteriaCard({c}){
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-[#dfe6e0] hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-3">
        <div className="mt-1"><TypeIcon type={c.type} /></div>
        <div>
          <div className="font-semibold text-[#123126]">{c.criterion}</div>
          <div className="text-sm text-[#5d6b61] mt-1">Type: <span className="font-medium text-[#34453b]">{c.type}</span>{c.threshold ? <span className="text-[#6b786f]"> — threshold: {c.threshold}{c.unit ? c.unit : ''}</span> : null}</div>
        </div>
      </div>
    </div>
  )
}
