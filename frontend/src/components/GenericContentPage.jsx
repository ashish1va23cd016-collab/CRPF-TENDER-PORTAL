import React from 'react';

export default function GenericContentPage({ title, paragraphs, imageSrc }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full max-w-6xl mx-auto flex flex-col lg:flex-row">
      
      {/* Optional Hero Image - Only renders if imageSrc is provided */}
      {imageSrc && (
        <div className="lg:w-5/12 min-h-[300px] lg:min-h-full relative">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${imageSrc}')` }}
          ></div>
          {/* Subtle gradient overlay to blend image into the border */}
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent hidden lg:block"></div>
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent lg:hidden"></div>
        </div>
      )}

      {/* Content Area */}
      <div className={`flex-1 ${imageSrc ? 'lg:w-7/12' : 'w-full'}`}>
        <div className="bg-gradient-to-r from-slate-100 to-white px-8 py-6 border-b border-slate-200">
          <h2 className="text-3xl font-black text-[#1e293b]">{title}</h2>
          <div className="w-16 h-1 bg-amber-500 mt-4"></div>
        </div>
        <div className="p-8 space-y-6 text-slate-700 leading-relaxed font-medium text-lg">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>

    </div>
  );
}
