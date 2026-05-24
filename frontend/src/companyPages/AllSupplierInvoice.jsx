import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  CheckCircle,
  XCircle,
  Trash2,
  Download,
  Menu,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
} from "lucide-react";

import { useInvoiceStore } from "../store/supplierInvoiceStore";
import CompanySidebar from "./CompanySidebar";

const AllSupplierInvoice = () => {
  const {
    invoices = [],
    fetchInvoices,
    deleteInvoice,
    updateInvoiceStatus,
    downloadPDF,
  } = useInvoiceStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🔹 Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    fetchInvoices();
  }, []);

  const togglePaid = (id, current) => {
    updateInvoiceStatus(id, !current);
  };

  // 🔹 Generate dynamic years based on invoice data
  const availableYears = useMemo(() => {
    const years = invoices.map((inv) => new Date(inv.date).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a);
  }, [invoices]);

  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  // 🔹 Filter Logic
  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((inv) => {
        const invDate = new Date(inv.date);
        const matchesSearch =
          inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          inv.supplier?.name?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesMonth =
          selectedMonth === "all" || invDate.getMonth().toString() === selectedMonth;
        const matchesYear =
          selectedYear === "all" || invDate.getFullYear().toString() === selectedYear;

        return matchesSearch && matchesMonth && matchesYear;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // 🔹 Sort latest first
  }, [invoices, searchQuery, selectedMonth, selectedYear]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
  <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950 transition-colors duration-300">
  <CompanySidebar
    activeItem="Factures"
    isOpen={isSidebarOpen}
    setIsOpen={setIsSidebarOpen}
  />

  <main className="flex-1 flex flex-col min-w-0">
    {/* HEADER */}
    <header className="h-20 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg lg:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Factures Fournisseurs
          </h1>
          <p className="hidden sm:block text-xs font-medium text-slate-400 dark:text-slate-400">
            Gérez vos cycles de facturation et de recouvrement
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Rechercher un numéro ou un client..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none w-64 transition-all"
          />
        </div>
      </div>
    </header>

    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* 🔹 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Volume Total"
          value={invoices.length}
          icon={<FileText size={20} />}
          color="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30"
          trend="Inventaire actuel"
        />
        <StatCard
          title="Réglées"
          value={invoices.filter((i) => i.isPaid).length}
          icon={<CheckCircle size={20} />}
          color="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30"
          trend="Payées avec succès"
        />
        <StatCard
          title="En attente"
          value={invoices.filter((i) => !i.isPaid).length}
          icon={<XCircle size={20} />}
          color="text-rose-600 bg-rose-50 dark:bg-rose-900/30"
          trend="Action requise"
        />
      </div>

      {/* 🔹 CONTROLS & DATE FILTER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Filter size={18} className="text-slate-400 dark:text-slate-500" />
          <span className="text-sm font-semibold">Filtrer par date :</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer text-slate-900 dark:text-slate-100"
            >
              <option value="all">Tous les mois</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer text-slate-900 dark:text-slate-100"
          >
            <option value="all">Toutes les années</option>
            {availableYears.map((y) => (
              <option key={y} value={y.toString()}>
                {y}
              </option>
            ))}
          </select>

          {(selectedMonth !== "all" || selectedYear !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedMonth("all");
                setSelectedYear("all");
                setSearchQuery("");
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline ml-2"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* 🔹 LIST (Rows under each other) */}
      <div className="space-y-4">
        <div className="hidden md:grid grid-cols-12 px-6 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <div className="col-span-2">Facture</div>
          <div className="col-span-3">Fournisseur</div>
          <div className="col-span-2 text-center">Statut</div>
          <div className="col-span-2 text-right">Montant</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        <AnimatePresence >
          {filteredInvoices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-700 p-20 flex flex-col items-center text-slate-400 dark:text-slate-500"
            >
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full mb-4">
                <AlertCircle size={40} className="text-slate-300 dark:text-slate-500" />
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                Aucun enregistrement trouvé
              </p>
              <p className="text-sm">Essayez d’ajuster votre recherche ou vos filtres</p>
            </motion.div>
          ) : (
            currentInvoices.map((inv) => (
              <motion.div
                key={inv._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white dark:bg-[#111827] p-4 md:px-6 md:py-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all md:grid md:grid-cols-12 items-center gap-4 flex flex-col"
              >
                {/* Invoice ID & Date */}
                <div className="col-span-2 w-full md:w-auto">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-indigo-50 group-hover:dark:bg-indigo-900/20 group-hover:text-indigo-500 transition-colors">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 leading-tight">
                        {inv.invoiceNumber}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                        {new Date(inv.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Supplier */}
                <div className="col-span-3 w-full md:w-auto border-t md:border-t-0 pt-2 md:pt-0">
                  <p className="text-xs text-slate-400 dark:text-slate-500 md:hidden font-bold uppercase mb-1">
                    Fournisseur
                  </p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {inv.supplier?.name || "Aucun nom de fournisseur"}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="col-span-2 flex justify-center w-full md:w-auto">
                  <span
                    className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest ${
                      inv.isPaid
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700"
                        : "bg-rose-100 dark:bg-rose-900/30 text-rose-700"
                    }`}
                  >
                    {inv.isPaid ? "Payée" : "En attente"}
                  </span>
                </div>

                {/* Amount */}
                <div className="col-span-2 w-full md:w-auto text-center md:text-right">
                  <p className="text-xs text-slate-400 dark:text-slate-500 md:hidden font-bold uppercase mb-1">
                    Net à payer
                  </p>
                  <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {inv.netPay?.toLocaleString()}{" "}
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-0.5">
                      TND
                    </span>
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-3 flex items-center justify-end gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                  <button
                    onClick={() => togglePaid(inv._id, inv.isPaid)}
                    title={inv.isPaid ? "Marquer comme non payée" : "Marquer comme payée"}
                    className={`p-2 rounded-xl transition-colors ${
                      inv.isPaid
                        ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                        : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                    }`}
                  >
                    {inv.isPaid ? <XCircle size={20} /> : <CheckCircle size={20} />}
                  </button>

                  <button
                    onClick={() => downloadPDF(inv._id)}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    title="Télécharger le PDF"
                  >
                    <Download size={20} />
                  </button>

                  <button
                    onClick={() => deleteInvoice(inv._id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-colors"
                    title="Supprimer l’enregistrement"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Affichage de{" "}
            <span className="text-slate-900 dark:text-slate-100">{currentInvoices.length}</span> sur{" "}
            <span className="text-slate-900 dark:text-slate-100">{filteredInvoices.length}</span> enregistrements
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-[#1F2937] transition-colors"
            >
              <ChevronLeft size={16} />
              Précédent
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50"
                      : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1F2937]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-[#1F2937] transition-colors"
            >
              Suivant
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  </main>
</div>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => (
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-5 transition-shadow hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50"
  >
    <div className={`p-4 rounded-2xl ${color} flex-shrink-0`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
        {title}
      </p>
      <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 leading-none">{value}</h3>
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1">
        <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
        {trend}
      </p>
    </div>
  </motion.div>
);

export default AllSupplierInvoice;