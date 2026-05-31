// BIDashboardBuilder.jsx — Version française

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import {
  Menu,
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  FileText,
  Users,
  Download,
  Sparkles,
  Activity,
  BarChart3,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ChevronDown,
  Filter,
  MoreHorizontal,
  AlertCircle,
  CheckCircle2,
  Zap,
  DollarSign,
  Target,
  Clock,
} from "lucide-react";
import CompanySidebar from "./CompanySidebar";
import { useClientOrderStore } from "../store/clientOrderStore";
import { useInvoiceStore } from "../store/invoiceStore";
import { useSupplierOrderStore } from "../store/supplierOrderStore";
import { useSupplierInvoiceStore } from "../store/supplierInvoiceStore";
import { buildForecast } from "../utils/aiForecast";

/* =========================================================
   CONSTANTES
========================================================= */

const MONTH_ORDER = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];

const PALETTE = {
  revenue:   "#6366F1",
  purchases: "#F59E0B",
  profit:    "#10B981",
  neutral:   "#94A3B8",
};

const DATE_RANGES = [
  { label: "30 derniers jours", value: 30 },
  { label: "90 derniers jours", value: 90 },
  { label: "6 derniers mois",   value: 180 },
  { label: "Cette année",       value: 365 },
  { label: "Tout l'historique", value: 99999 },
];

/* =========================================================
   UTILITAIRES
========================================================= */

const fmt = (n) =>
  new Intl.NumberFormat("fr-TN", { minimumFractionDigits: 0 }).format(Math.round(n));

const pctChange = (current, previous) => {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
};

function filterByDays(items, days) {
  if (days >= 99999) return items;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return items.filter((i) => new Date(i.date) >= cutoff);
}

/* =========================================================
   INFOBULLE PERSONNALISÉE
========================================================= */

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl px-4 py-3 text-sm">
      <p className="font-bold text-gray-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="capitalize">{entry.name}:</span>
          <span className="font-semibold">{fmt(entry.value)} TND</span>
        </div>
      ))}
    </div>
  );
};

/* =========================================================
   COMPOSANT PRINCIPAL
========================================================= */

const BIDashboardBuilder = () => {
  const [isSidebarOpen, setIsSidebarOpen]     = useState(false);
  const [dateRange, setDateRange]             = useState(365);
  const [showRangeMenu, setShowRangeMenu]     = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [aiInsights, setAiInsights]           = useState(null);

  /* STORES */
  const { orders: clientOrders,       fetchOrders: fetchClientOrders }       = useClientOrderStore();
  const { invoices,                   fetchInvoices }                         = useInvoiceStore();
  const { orders: supplierOrders,     fetchOrders: fetchSupplierOrders }     = useSupplierOrderStore();
  const { invoices: supplierInvoices, fetchInvoices: fetchSupplierInvoices } = useSupplierInvoiceStore();

  useEffect(() => {
    fetchClientOrders();
    fetchInvoices();
    fetchSupplierOrders();
    fetchSupplierInvoices();
  }, []);

  /* DONNÉES FILTRÉES */
  const paidSalesOrders = useMemo(
    () => filterByDays(clientOrders.filter((o) => o.isPaid && !o.isCanceled), dateRange),
    [clientOrders, dateRange]
  );
  const paidInvoices         = useMemo(() => filterByDays(invoices.filter((i) => i.isPaid), dateRange), [invoices, dateRange]);
  const paidSupplierOrders   = useMemo(() => filterByDays(supplierOrders.filter((o) => o.isPaid), dateRange), [supplierOrders, dateRange]);
  const paidSupplierInvoices = useMemo(() => filterByDays(supplierInvoices.filter((i) => i.isPaid), dateRange), [supplierInvoices, dateRange]);

  /* PÉRIODE PRÉCÉDENTE — pour le % de variation */
  const prevPaidSalesOrders = useMemo(
    () => filterByDays(clientOrders.filter((o) => o.isPaid && !o.isCanceled), dateRange * 2).filter(
      (o) => !paidSalesOrders.includes(o)
    ),
    [clientOrders, dateRange, paidSalesOrders]
  );

  /* KPI */
  const totalRevenue   = useMemo(() => [...paidSalesOrders, ...paidInvoices].reduce((a, i) => a + (i.netPay || 0), 0), [paidSalesOrders, paidInvoices]);
  const totalPurchases = useMemo(() => [...paidSupplierOrders, ...paidSupplierInvoices].reduce((a, i) => a + (i.netPay || 0), 0), [paidSupplierOrders, paidSupplierInvoices]);
  const totalProfit    = totalRevenue - totalPurchases;
  const profitMargin   = totalRevenue ? (totalProfit / totalRevenue) * 100 : 0;
  const totalTx        = paidSalesOrders.length + paidInvoices.length + paidSupplierOrders.length + paidSupplierInvoices.length;
  const avgOrderValue  = paidSalesOrders.length ? totalRevenue / paidSalesOrders.length : 0;

  const prevRevenue = useMemo(() => prevPaidSalesOrders.reduce((a, i) => a + (i.netPay || 0), 0), [prevPaidSalesOrders]);

  /* DONNÉES MENSUELLES */
  const monthlyData = useMemo(() => {
    const map = {};

    const getMonthFr = (dateStr) => {
      const d = new Date(dateStr);
      const monthsFr = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];
      return monthsFr[d.getMonth()];
    };

    [...paidSalesOrders, ...paidInvoices].forEach((item) => {
      const m = getMonthFr(item.date);
      if (!map[m]) map[m] = { month: m, revenue: 0, purchases: 0, profit: 0 };
      map[m].revenue += item.netPay || 0;
    });
    [...paidSupplierOrders, ...paidSupplierInvoices].forEach((item) => {
      const m = getMonthFr(item.date);
      if (!map[m]) map[m] = { month: m, revenue: 0, purchases: 0, profit: 0 };
      map[m].purchases += item.netPay || 0;
    });
    return Object.values(map)
      .sort((a, b) => MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month))
      .map((m) => ({ ...m, profit: m.revenue - m.purchases }));
  }, [paidSalesOrders, paidInvoices, paidSupplierOrders, paidSupplierInvoices]);

  /* MEILLEURS CLIENTS */
  const topCustomers = useMemo(() => {
    const map = {};
    paidSalesOrders.forEach((o) => {
      const name = o.customer?.name || "Inconnu";
      if (!map[name]) map[name] = { name, amount: 0, count: 0 };
      map[name].amount += o.netPay || 0;
      map[name].count  += 1;
    });
    return Object.values(map).sort((a, b) => b.amount - a.amount).slice(0, 6);
  }, [paidSalesOrders]);

  /* MEILLEURS FOURNISSEURS */
  const topSuppliers = useMemo(() => {
    const map = {};
    paidSupplierOrders.forEach((o) => {
      const name = o.supplier?.name || "Inconnu";
      if (!map[name]) map[name] = { name, amount: 0 };
      map[name].amount += o.netPay || 0;
    });
    return Object.values(map).sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [paidSupplierOrders]);

  /* DONNÉES CAMEMBERT */
  const pieData = [
    { name: "Chiffre d'affaires", value: totalRevenue,            color: PALETTE.revenue   },
    { name: "Achats",             value: totalPurchases,           color: PALETTE.purchases },
    { name: "Bénéfice",           value: Math.max(0, totalProfit), color: PALETTE.profit    },
  ].filter((d) => d.value > 0);

const forecast = useMemo(() => {
  return buildForecast(monthlyData);
}, [monthlyData]);


  /* INSIGHTS IA */
  const generateInsights = useCallback(async () => {
    setInsightsLoading(true);
    try {
      const ctx = {
        chiffreAffaires:      Math.round(totalRevenue),
        totalAchats:          Math.round(totalPurchases),
        beneficeNet:          Math.round(totalProfit),
        margeBeneficiaire:    profitMargin.toFixed(1),
        totalTransactions:    totalTx,
        valeurMoyenneCommande: Math.round(avgOrderValue),
        meilleurClient:       topCustomers[0]?.name || "N/A",
        revenuMeilleurClient: Math.round(topCustomers[0]?.amount || 0),
        variationCA:          pctChange(totalRevenue, prevRevenue)?.toFixed(1),
        nombreMois:           monthlyData.length,
      };

      const prompt = `Tu es un analyste financier pour un système ERP tunisien. En te basant sur ces données :
${JSON.stringify(ctx, null, 2)}

Génère exactement 3 insights métier concis et actionnables en JSON :
[
  { "type": "positive|warning|neutral", "title": "...", "text": "...", "action": "..." },
  { "type": "positive|warning|neutral", "title": "...", "text": "...", "action": "..." },
  { "type": "positive|warning|neutral", "title": "...", "text": "...", "action": "..." }
]
Réponds uniquement en JSON, sans markdown, entièrement en français.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data  = await res.json();
      const raw   = data.content?.map((c) => c.text || "").join("") || "[]";
      const clean = raw.replace(/```json|```/g, "").trim();
      setAiInsights(JSON.parse(clean));
    } catch {
      setAiInsights([
        { type: "neutral",  title: "Aperçu du chiffre d'affaires", text: `Chiffre d'affaires total de ${fmt(totalRevenue)} TND avec une marge bénéficiaire de ${profitMargin.toFixed(1)}%.`,                         action: "Revoir la stratégie tarifaire" },
        { type: "positive", title: "Volume de transactions",        text: `${totalTx} transactions payées enregistrées sur la période sélectionnée.`,                                                                    action: "Analyser les tendances de transactions" },
        { type: "warning",  title: "Maîtrise des coûts",            text: `Les achats représentent ${totalRevenue ? ((totalPurchases / totalRevenue) * 100).toFixed(1) : 0}% du chiffre d'affaires.`,                  action: "Négocier les tarifs fournisseurs" },
      ]);
    } finally {
      setInsightsLoading(false);
    }
  }, [totalRevenue, totalPurchases, totalProfit, profitMargin, totalTx, avgOrderValue, topCustomers, prevRevenue, monthlyData]);

  useEffect(() => {
    if (totalRevenue > 0) generateInsights();
  }, [dateRange]);

  const selectedRangeLabel = DATE_RANGES.find((r) => r.value === dateRange)?.label || "Personnalisé";

  /* =========================================================
     RENDU
  ========================================================= */
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <CompanySidebar activeItem="Tableau de bord BI" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 min-w-0 flex flex-col">
        {/* EN-TÊTE */}
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
              <Menu size={18} className="text-gray-600 dark:text-slate-300" />
            </button>
            <div>
              <h1 className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight">Intelligence Commerciale</h1>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">Analytique ERP · Données en direct</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* SÉLECTEUR DE PÉRIODE */}
            <div className="relative">
              <button
                onClick={() => setShowRangeMenu((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors"
              >
                <Filter size={14} />
                {selectedRangeLabel}
                <ChevronDown size={14} className={`transition-transform ${showRangeMenu ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showRangeMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    {DATE_RANGES.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => { setDateRange(r.value); setShowRangeMenu(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${
                          dateRange === r.value
                            ? "text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-500/10"
                            : "text-gray-700 dark:text-slate-300"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* <button
              onClick={generateInsights}
              disabled={insightsLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold shadow-md shadow-indigo-200 dark:shadow-none transition-all"
            >
              <Sparkles size={14} />
              {insightsLoading ? "Analyse en cours…" : "Insights IA"}
            </button> */}

            {/* <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 text-sm font-semibold transition-colors">
              <Download size={14} />
              Exporter
            </button> */}
          </div>
        </header>

        {/* CONTENU */}
        <div className="flex-1 p-4 lg:p-6 space-y-5">

          {/* RANGÉE KPI */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <KPICard title="Chiffre d'affaires"  value={`${fmt(totalRevenue)} TND`}    sub={`${pctChange(totalRevenue, prevRevenue)?.toFixed(1) || 0}% vs période préc.`} trend={pctChange(totalRevenue, prevRevenue)} icon={<Wallet size={20} />}       color="indigo" />
            <KPICard title="Total des achats"    value={`${fmt(totalPurchases)} TND`}  sub={`${paidSupplierOrders.length + paidSupplierInvoices.length} transactions fournisseurs`} trend={null} icon={<ShoppingCart size={20} />} color="amber" />
            <KPICard title="Bénéfice net"        value={`${fmt(totalProfit)} TND`}     sub={`Marge de ${profitMargin.toFixed(1)}%`}                                        trend={totalProfit >= 0 ? 1 : -1} icon={<TrendingUp size={20} />}    color="emerald"/>
            <KPICard title="Commande moyenne"    value={`${fmt(avgOrderValue)} TND`}   sub={`sur ${totalTx} transactions`}                                                  trend={null} icon={<Target size={20} />}       color="blue"   />
          </div>

          {/* RANGÉE KPI SECONDAIRE */}
          <div className="grid grid-cols-3 gap-4">
            <MiniStat label="Bons de commande"   value={paidSalesOrders.length}       icon={<FileText   size={14} />} />
            <MiniStat label="Factures clients"   value={paidInvoices.length}          icon={<DollarSign size={14} />} />
            <MiniStat label="Docs fournisseurs"  value={paidSupplierOrders.length + paidSupplierInvoices.length} icon={<Activity size={14} />} />
          </div>

          {forecast && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="grid grid-cols-1 xl:grid-cols-3 gap-4"
  >
    <ForecastCard
      title="Prévision CA (Mois prochain)"
      value={fmt(forecast.nextRevenue) + " TND"}
      color="indigo"
    />

    <ForecastCard
      title="Prévision Achats"
      value={fmt(forecast.nextPurchases) + " TND"}
      color="amber"
    />

    <ForecastCard
      title="Profit estimé"
      value={fmt(forecast.nextProfit) + " TND"}
      color={forecast.nextProfit >= 0 ? "emerald" : "red"}
    />
  </motion.div>
)}

          {/* RANGÉE DE GRAPHIQUES */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* GRAPHIQUE DE SURFACE — CA & Achats */}
            <ChartCard title="Chiffre d'affaires vs Achats" subtitle="Tendance mensuelle" className="xl:col-span-2">
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PALETTE.revenue}   stopOpacity={0.15} />
                      <stop offset="100%" stopColor={PALETTE.revenue} stopOpacity={0}    />
                    </linearGradient>
                    <linearGradient id="gradPurchases" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PALETTE.purchases}   stopOpacity={0.15} />
                      <stop offset="100%" stopColor={PALETTE.purchases} stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Area type="monotone" dataKey="revenue"   name="Chiffre d'affaires" stroke={PALETTE.revenue}   strokeWidth={2.5} fill="url(#gradRevenue)"   dot={{ r: 3, fill: PALETTE.revenue,   strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  <Area type="monotone" dataKey="purchases" name="Achats"             stroke={PALETTE.purchases} strokeWidth={2.5} fill="url(#gradPurchases)" dot={{ r: 3, fill: PALETTE.purchases, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* CAMEMBERT — Répartition financière */}
            <ChartCard title="Répartition financière" subtitle="Distribution du chiffre d'affaires">
              <div className="flex flex-col items-center justify-center h-[260px]">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${fmt(v)} TND`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1 w-full px-4 mt-1">
                  {pieData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        {d.name}
                      </span>
                      <span className="font-semibold">{totalRevenue ? `${((d.value / totalRevenue) * 100).toFixed(1)}%` : "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>
          </div>

          {/* HISTOGRAMME — TRÉSORERIE MENSUELLE */}
          <ChartCard title="Trésorerie mensuelle" subtitle="Chiffre d'affaires, achats et bénéfice par mois">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <ReferenceLine y={0} stroke="#e2e8f0" />
                <Bar dataKey="revenue"   name="Chiffre d'affaires" fill={PALETTE.revenue}   radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="purchases" name="Achats"             fill={PALETTE.purchases} radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="profit"    name="Bénéfice"           fill={PALETTE.profit}    radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* RANGÉE DU BAS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            {/* MEILLEURS CLIENTS */}
            <SectionCard title="Meilleurs clients" subtitle={`Par chiffre d'affaires · ${selectedRangeLabel}`} icon={<Users size={16} />}>
              <div className="space-y-2 mt-1">
                {topCustomers.length === 0 && (
                  <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">Aucune donnée disponible</p>
                )}
                {topCustomers.map((c, i) => {
                  const pct = topCustomers[0]?.amount ? (c.amount / topCustomers[0].amount) * 100 : 0;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-6 text-xs font-black text-gray-300 dark:text-slate-600 text-center shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{c.name}</span>
                          <span className="text-sm font-black text-gray-900 dark:text-white ml-2 shrink-0">{fmt(c.amount)} <span className="font-normal text-gray-400 dark:text-slate-500 text-xs">TND</span></span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.07 }}
                            className="h-full rounded-full"
                            style={{ background: i === 0 ? PALETTE.revenue : `${PALETTE.revenue}60` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            {/* MEILLEURS FOURNISSEURS */}
            <SectionCard title="Meilleurs fournisseurs" subtitle={`Par achats · ${selectedRangeLabel}`} icon={<ShoppingCart size={16} />}>
              <div className="space-y-2 mt-1">
                {topSuppliers.length === 0 && (
                  <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">Aucune donnée disponible</p>
                )}
                {topSuppliers.map((s, i) => {
                  const pct = topSuppliers[0]?.amount ? (s.amount / topSuppliers[0].amount) * 100 : 0;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-6 text-xs font-black text-gray-300 dark:text-slate-600 text-center shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{s.name}</span>
                          <span className="text-sm font-black text-gray-900 dark:text-white ml-2 shrink-0">{fmt(s.amount)} <span className="font-normal text-gray-400 dark:text-slate-500 text-xs">TND</span></span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.07 }}
                            className="h-full rounded-full"
                            style={{ background: i === 0 ? PALETTE.purchases : `${PALETTE.purchases}60` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>

          {/* INSIGHTS IA */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-black text-gray-900 dark:text-white">Insights IA</h2>
                <p className="text-xs text-gray-400 dark:text-slate-500">Générés à partir de vos données ERP en direct</p>
              </div>
              <button
                onClick={generateInsights}
                disabled={insightsLoading}
                className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold disabled:opacity-50"
              >
                <RefreshCw size={12} className={insightsLoading ? "animate-spin" : ""} />
                Régénérer
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insightsLoading
                ? Array.from({ length: 3 }).map((_, i) => <InsightSkeleton key={i} />)
                : (aiInsights || []).map((ins, i) => <InsightCard key={i} insight={ins} index={i} />)
              }
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

/* =========================================================
   CARTE KPI
========================================================= */

const colorMap = {
  indigo:  { bg: "bg-indigo-50  dark:bg-indigo-500/10", icon: "bg-indigo-600",  text: "text-indigo-600 dark:text-indigo-400"  },
  amber:   { bg: "bg-amber-50   dark:bg-amber-500/10",  icon: "bg-amber-500",   text: "text-amber-600 dark:text-amber-400"    },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-500/10",icon: "bg-emerald-600", text: "text-emerald-600 dark:text-emerald-400" },
  blue:    { bg: "bg-blue-50    dark:bg-blue-500/10",   icon: "bg-blue-600",    text: "text-blue-600 dark:text-blue-400"      },
};

const KPICard = ({ title, value, sub, trend, icon, color }) => {
  const c = colorMap[color] || colorMap.indigo;
  const trendPositive = trend > 0;
  const trendNeutral  = trend === null || trend === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      className={`rounded-2xl p-5 ${c.bg} border border-white/50 dark:border-white/5`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 dark:text-slate-500 mb-3">{title}</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center text-white shrink-0 ml-3`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        {!trendNeutral && (
          <span className={`flex items-center gap-0.5 text-xs font-bold ${trendPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
            {trendPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
        <span className="text-[11px] text-gray-400 dark:text-slate-500">{sub}</span>
      </div>
    </motion.div>
  );
};

/* =========================================================
   MINI STATISTIQUE
========================================================= */

const MiniStat = ({ label, value, icon }) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
    <span className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1.5">{icon}{label}</span>
    <span className="text-lg font-black text-gray-900 dark:text-white">{value}</span>
  </div>
);

/* =========================================================
   CARTE DE GRAPHIQUE
========================================================= */

const ChartCard = ({ title, subtitle, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
    className={`bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 ${className}`}
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-sm font-black text-gray-900 dark:text-white">{title}</h2>
        <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
      </div>
      <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400">
        <MoreHorizontal size={16} />
      </button>
    </div>
    {children}
  </motion.div>
);

/* =========================================================
   CARTE DE SECTION
========================================================= */

const SectionCard = ({ title, subtitle, icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
    className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="text-gray-400 dark:text-slate-500">{icon}</span>
        <div>
          <h2 className="text-sm font-black text-gray-900 dark:text-white">{title}</h2>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
    </div>
    {children}
  </motion.div>
);

const ForecastCard = ({ title, value, color }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
    red: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  };

  return (
    <div className={`rounded-2xl p-5 border border-gray-100 dark:border-slate-800 ${colors[color]}`}>
      <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">
        {title}
      </p>
      <p className="text-2xl font-black mt-2">{value}</p>
      <p className="text-[11px] opacity-60 mt-1">
        Forecast automatique 
      </p>
    </div>
  );
};

/* =========================================================
   CARTE D'INSIGHT
========================================================= */

const insightStyle = {
  positive: {
    border: "border-emerald-200 dark:border-emerald-500/20",
    bg:     "bg-emerald-50 dark:bg-emerald-500/10",
    icon:   <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />,
    badge:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
    label:  "Positif",
  },
  warning: {
    border: "border-amber-200 dark:border-amber-500/20",
    bg:     "bg-amber-50 dark:bg-amber-500/10",
    icon:   <AlertCircle  size={18} className="text-amber-600 dark:text-amber-400"   />,
    badge:  "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
    label:  "Attention",
  },
  neutral: {
    border: "border-blue-200 dark:border-blue-500/20",
    bg:     "bg-blue-50 dark:bg-blue-500/10",
    icon:   <Zap          size={18} className="text-blue-600 dark:text-blue-400"     />,
    badge:  "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
    label:  "Neutre",
  },
};

const InsightCard = ({ insight, index }) => {
  const s = insightStyle[insight.type] || insightStyle.neutral;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.07 }}
      className={`rounded-2xl border p-5 ${s.border} ${s.bg}`}
    >
      <div className="flex items-center gap-2 mb-3">
        {s.icon}
        <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full ${s.badge}`}>
          {s.label}
        </span>
      </div>
      <h3 className="font-black text-gray-900 dark:text-white text-sm mb-1.5">{insight.title}</h3>
      <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">{insight.text}</p>
      {insight.action && (
        <p className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
          <ArrowUpRight size={12} />
          {insight.action}
        </p>
      )}
    </motion.div>
  );
};

/* =========================================================
   SQUELETTE D'INSIGHT (CHARGEMENT)
========================================================= */

const InsightSkeleton = () => (
  <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 p-5 animate-pulse">
    <div className="flex gap-2 mb-3">
      <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-slate-700" />
      <div className="w-16 h-4 rounded-full bg-gray-200 dark:bg-slate-700" />
    </div>
    <div className="w-3/4 h-4 rounded bg-gray-200 dark:bg-slate-700 mb-2" />
    <div className="w-full h-3 rounded bg-gray-100 dark:bg-slate-800 mb-1.5" />
    <div className="w-5/6 h-3 rounded bg-gray-100 dark:bg-slate-800 mb-1.5" />
    <div className="w-4/6 h-3 rounded bg-gray-100 dark:bg-slate-800" />
  </div>
);

export default BIDashboardBuilder;