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
import { useClientOrderStore } from "../store/clientOrderStore";
import CompanySidebar from "./CompanySidebar";

const AllClientOrders = () => {
  const {
    orders = [],
    fetchOrders,
    deleteOrder,
    updateOrderStatus,
    downloadPDF,
  } = useClientOrderStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    fetchOrders();
  }, []);

  // const togglePaid = (id, current) => {
  //   updateOrderStatus(id, !current);
  // };
  const togglePaid = (order) => {
    if (order.isCanceled) return;

    updateOrderStatus(order._id, {
      isPaid: !order.isPaid,
    });
  };

  const availableYears = useMemo(() => {
    const years = orders.map((order) => new Date(order.date).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a);
  }, [orders]);

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

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const orderDate = new Date(order.date);
        const matchesSearch =
          order.orderNumber
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.customer?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesMonth =
          selectedMonth === "all" ||
          orderDate.getMonth().toString() === selectedMonth;
        const matchesYear =
          selectedYear === "all" ||
          orderDate.getFullYear().toString() === selectedYear;

        return matchesSearch && matchesMonth && matchesYear;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [orders, searchQuery, selectedMonth, selectedYear]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / rowsPerPage),
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  return (
  <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950 transition-colors duration-300">
  <CompanySidebar
    activeItem="Commandes"
    isOpen={isSidebarOpen}
    setIsOpen={setIsSidebarOpen}
  />

  <main className="flex-1 flex flex-col min-w-0">
    {/* HEADER */}
    <header className="h-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg lg:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Commandes Clients
          </h1>
          <p className="hidden sm:block text-xs font-medium text-slate-400 dark:text-slate-300">
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
            className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none w-64 transition-all text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>
    </header>

    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* 🔹 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Volume Total"
          value={orders.length}
          icon={<FileText size={20} />}
          color="text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/30"
          trend="Inventaire Actuel"
        />
        <StatCard
          title="Réglé"
          value={orders.filter((o) => o.isPaid).length}
          icon={<CheckCircle size={20} />}
          color="text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30"
          trend="Payé avec succès"
        />
        <StatCard
          title="En attente"
          value={orders.filter((o) => !o.isPaid).length}
          icon={<XCircle size={20} />}
          color="text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/30"
          trend="Action requise"
        />
      </div>

      {/* 🔹 CONTROLS & DATE FILTER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Filter
            size={18}
            className="text-slate-400 dark:text-slate-500"
          />
          <span className="text-sm font-semibold">
            Filtrer par date :
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar
              size={14}
              className="text-slate-400 dark:text-slate-500"
            />
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer text-slate-900 dark:text-slate-100"
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
            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer text-slate-900 dark:text-slate-100"
          >
            <option value="all">Toutes les années</option>
            {availableYears.map((y) => (
              <option key={y} value={y.toString()}>
                {y}
              </option>
            ))}
          </select>

          {(selectedMonth !== "all" ||
            selectedYear !== "all" ||
            searchQuery) && (
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

      {/* 🔹 LIST */}
      <div className="space-y-4">
        {/* 🔥 TABLE HEADER */}
        <div className="hidden md:grid grid-cols-12 px-6 py-3 text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-wider sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 rounded-t-2xl">
          <div className="col-span-2">Commande</div>
          <div className="col-span-3">Client</div>
          <div className="col-span-2 text-center">Statut</div>
          <div className="col-span-2 text-right">Montant</div>
          <div className="col-span-1 text-right">Annuler</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <AnimatePresence >
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-20 flex flex-col items-center text-slate-400 dark:text-slate-500"
            >
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-full mb-4">
                <AlertCircle
                  size={40}
                  className="text-slate-300 dark:text-slate-500"
                />
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                Aucun enregistrement trouvé
              </p>
              <p className="text-sm">
                Essayez d’ajuster votre recherche ou vos filtres
              </p>
            </motion.div>
          ) : (
            currentOrders.map((order) => (
              <motion.div
                key={order._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/5 transition-all md:grid md:grid-cols-12 items-center gap-4"
              >
                {/* Order */}
                <div className="col-span-2 flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {order.orderNumber}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Customer */}
                <div className="col-span-3 truncate">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-100 truncate">
                    {order.customer?.name || "Aucun nom de client"}
                  </p>
                </div>

                {/* Status */}
                <div className="col-span-2 flex justify-center">
                  <span
                    className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest ${
                      order.isCanceled
                        ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        : order.isPaid
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                    }`}
                  >
                    {order.isCanceled
                      ? "Annulée"
                      : order.isPaid
                        ? "Payée"
                        : "En attente"}
                  </span>
                </div>

                {/* Amount */}
                <div className="col-span-2 text-right">
                  <span className="text-base font-black text-slate-900 dark:text-slate-100">
                    {order.netPay?.toLocaleString()}{" "}
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      TND
                    </span>
                  </span>
                </div>

                {/* Cancel */}
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() =>
                      updateOrderStatus(order._id, {
                        isCanceled: !order.isCanceled,
                      })
                    }
                    className={`p-2 rounded-xl transition-colors ${
                      order.isCanceled
                        ? "text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                        : "text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
                    }`}
                    title={
                      order.isCanceled
                        ? "Restaurer la commande"
                        : "Annuler la commande"
                    }
                  >
                    {order.isCanceled ? (
                      <CheckCircle size={18} />
                    ) : (
                      <XCircle size={18} />
                    )}
                  </button>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition">
                  <button
                    onClick={() => togglePaid(order)}
                    disabled={order.isCanceled}
                    title={
                      order.isPaid
                        ? "Marquer comme non payée"
                        : "Marquer comme payée"
                    }
                    className={`p-2 rounded-xl transition-colors ${
                      order.isPaid
                        ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30"
                        : "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                    }`}
                  >
                    {order.isPaid ? (
                      <XCircle size={18} />
                    ) : (
                      <CheckCircle size={18} />
                    )}
                  </button>

                  <button
                    onClick={() => downloadPDF(order._id)}
                    className="p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-xl transition-colors"
                    title="Télécharger le PDF"
                  >
                    <Download size={18} />
                  </button>

                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30 rounded-xl transition-colors"
                    title="Supprimer l’enregistrement"
                  >
                    <Trash2 size={18} />
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
            <span className="text-slate-900 dark:text-slate-100">
              {currentOrders.length}
            </span>{" "}
            sur{" "}
            <span className="text-slate-900 dark:text-slate-100">
              {filteredOrders.length}
            </span>{" "}
            enregistrements
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
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
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900"
                      : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
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
    className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-5 transition-shadow hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50"
  >
    <div className={`p-4 rounded-2xl ${color} flex-shrink-0 transition-colors`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
        {title}
      </p>
      <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 leading-none">
        {value}
      </h3>
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1">
        <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
        {trend}
      </p>
    </div>
  </motion.div>
);

export default AllClientOrders;
