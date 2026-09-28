import React from 'react';

export default function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-200 rounded-xl"></div>
              <div className="space-y-1.5">
                <div className="w-24 h-3.5 bg-slate-200 rounded"></div>
                <div className="w-32 h-2.5 bg-slate-100 rounded"></div>
              </div>
            </div>
            <div className="w-28 h-5 bg-slate-100 rounded-md"></div>
          </div>

          <div className="grid grid-cols-7 items-center gap-2 py-2">
            <div className="col-span-2 space-y-1">
              <div className="w-16 h-6 bg-slate-200 rounded"></div>
              <div className="w-12 h-3 bg-slate-100 rounded"></div>
            </div>
            <div className="col-span-3 flex flex-col items-center gap-2">
              <div className="w-16 h-2.5 bg-slate-200 rounded"></div>
              <div className="w-full h-1 bg-slate-200 rounded"></div>
              <div className="w-20 h-3 bg-slate-100 rounded"></div>
            </div>
            <div className="col-span-2 flex flex-col items-end space-y-1">
              <div className="w-16 h-6 bg-slate-200 rounded"></div>
              <div className="w-12 h-3 bg-slate-100 rounded"></div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <div className="w-36 h-3 bg-slate-100 rounded"></div>
            <div className="flex items-center gap-3">
              <div className="w-20 h-6 bg-slate-200 rounded"></div>
              <div className="w-28 h-9 bg-sky-100 rounded-xl"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
