import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  RefreshCw,
  Clock,
  TrendingUp,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

/* =========================================================
   ICON CONFIG
========================================================= */

const typeConfig = {
  positive: {
    icon: <CheckCircle2 size={16} />,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200/40 dark:border-emerald-500/20",
  },
  warning: {
    icon: <AlertCircle size={16} />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200/40 dark:border-amber-500/20",
  },
  neutral: {
    icon: <Zap size={16} />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-200/40 dark:border-blue-500/20",
  },
};

/* =========================================================
   INSIGHT ITEM
========================================================= */

const InsightItem = ({ item, index }) => {
  const cfg = typeConfig[item.type] || typeConfig.neutral;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl border ${cfg.border} ${cfg.bg}`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${cfg.color}`}>{cfg.icon}</div>

        <div className="flex-1">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            {item.title}
          </h3>

          <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 leading-relaxed">
            {item.text}
          </p>

          {item.action && (
            <button className={`mt-2 flex items-center gap-1 text-xs font-semibold ${cfg.color} hover:opacity-80`}>
              {item.action}
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* =========================================================
   FORECAST CHART
========================================================= */

const ForecastChart = ({ data }) => {
  if (!data?.length) return null;

  return (
    <div className="mt-4 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={16} className="text-indigo-500" />
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
          Prévision des ventes
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data}>
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const InsightsIA = ({ insights, loading, onRefresh }) => {
  const data = insights || {};

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
            <Sparkles size={18} className="text-indigo-600 dark:text-indigo-400" />
          </div>

          <div>
            <h2 className="text-sm font-black text-gray-900 dark:text-white">
              Rapport IA
            </h2>
            <p className="text-[11px] text-gray-400 dark:text-slate-500">
              Analyse financière automatique
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-slate-800"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Actualiser
        </button>
      </div>

      {/* BODY */}
      <div className="p-5 space-y-5">

        {/* LOADING */}
        {loading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-1/2 bg-gray-100 dark:bg-slate-800 rounded" />
            <div className="h-3 w-3/4 bg-gray-100 dark:bg-slate-800 rounded" />
            <div className="h-3 w-2/3 bg-gray-100 dark:bg-slate-800 rounded" />
          </div>
        )}

        {/* SUMMARY */}
        {!loading && data.summary && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border border-indigo-100/40 dark:border-slate-800">
            <h3 className="text-sm font-black text-gray-900 dark:text-white">
              {data.summary.title}
            </h3>

            <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-slate-300">
              {data.summary.points?.map((p, i) => (
                <li key={i}>• {p}</li>
              ))}
            </ul>
          </div>
        )}

        {/* RISKS */}
        {!loading && data.risks && (
          <div>
            <h3 className="text-xs font-bold text-red-500 mb-2">
              Risques
            </h3>
            <div className="space-y-2">
              {data.risks.map((r, i) => (
                <InsightItem
                  key={i}
                  item={{
                    type: "warning",
                    title: r,
                    text: "",
                  }}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}

        {/* OPPORTUNITIES */}
        {!loading && data.opportunities && (
          <div>
            <h3 className="text-xs font-bold text-emerald-500 mb-2">
              Opportunités
            </h3>
            <div className="space-y-2">
              {data.opportunities.map((o, i) => (
                <InsightItem
                  key={i}
                  item={{
                    type: "positive",
                    title: o,
                    text: "",
                  }}
                  index={i}
                />
              ))}
            </div>
          </div>
        )}

        {/* FORECAST */}
        {!loading && <ForecastChart data={data.forecast} />}

        {/* RECOMMENDATIONS */}
        {!loading && data.recommendations && (
          <div>
            <h3 className="text-xs font-bold text-indigo-500 mb-2">
              Recommandations
            </h3>

            <div className="space-y-2">
              {data.recommendations.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg border border-gray-100 dark:border-slate-800 hover:shadow-sm transition"
                >
                  <p className="text-xs font-medium text-gray-700 dark:text-slate-300">
                    {r}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !data.summary && (
          <div className="text-center py-10 text-sm text-gray-400">
            Aucun rapport IA disponible
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-400">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          Généré automatiquement
        </span>

        <span className="text-indigo-500 font-semibold">
          AI Powered
        </span>
      </div>
    </div>
  );
};

export default InsightsIA;