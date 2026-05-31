import React from "react";

const AIReport = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5 space-y-6">

      <div>
        <h2 className="text-lg font-black">📊 {data.summary.title}</h2>
        <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-slate-300">
          {data.summary.points.map((p, i) => (
            <li key={i}>• {p}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-red-500">⚠️ Risques</h3>
        <div className="space-y-2 mt-2">
          {data.risks.map((r, i) => (
            <div key={i} className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10">
              <p className="font-semibold">{r.title}</p>
              <p className="text-xs text-gray-600">{r.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-green-500">💡 Opportunités</h3>
        <div className="grid gap-2 mt-2">
          {data.opportunities.map((o, i) => (
            <div key={i} className="p-3 rounded-xl bg-green-50 dark:bg-green-500/10">
              <p className="font-semibold">{o.title}</p>
              <p className="text-xs">{o.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-indigo-500">🎯 Actions</h3>
        <div className="space-y-2 mt-2">
          {data.recommendations.map((r, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-indigo-500 font-bold">→</span>
              <div>
                <p className="font-semibold">{r.title}</p>
                <p className="text-xs text-gray-500">{r.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AIReport;