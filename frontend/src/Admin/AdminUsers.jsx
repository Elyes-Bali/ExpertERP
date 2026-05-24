import React, { useState, useEffect, useMemo } from "react";
import {
  Menu,
  Users,
  Mail,
  Phone,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import SideBarAdmin from "./SideBarAdmin";

const AdminUsers = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchAllUsers, updateIsVerified } = useAuthStore();

  const [dailyPaymentsData, setDailyPaymentsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const users = await fetchAllUsers();
        setUsersList(users);

        // 🔹 CHART LOGIC (UNCHANGED)
        const paymentMap = new Map();

        users.forEach((user) => {
          user.paymentHistory?.forEach((payment) => {
            const paymentDate = new Date(payment.date)
              .toISOString()
              .split("T")[0];

            const amount = payment.amount || 0;

            if (paymentMap.has(paymentDate)) {
              paymentMap.set(paymentDate, paymentMap.get(paymentDate) + amount);
            } else {
              paymentMap.set(paymentDate, amount);
            }
          });
        });

        let chartData = Array.from(paymentMap, ([date, totalAmount]) => ({
          date,
          totalAmount,
        }));

        chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
        setDailyPaymentsData(chartData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [fetchAllUsers]);

  // 🔹 FILTER
  const filteredUsers = useMemo(() => {
    return usersList.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [usersList, searchQuery]);

  // 🔹 PAGINATION
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage),
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  return (
  <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans selection:bg-indigo-100 selection:text-indigo-700 transition-colors duration-300">
      <SideBarAdmin
        activeItem="Utilisateurs"
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-95"
            >
              <Menu size={22} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Annuaire des utilisateurs
                </h1>
                <span className="hidden sm:flex px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded-md tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                Gérer les comptes, la vérification et les niveaux d’abonnement
              </p>
            </div>
          </div>

          <div className="relative hidden md:block group">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none w-72 lg:w-80 transition-all font-medium"
            />
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
          {/* STATS SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                  <Users size={20} />
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-slate-300 dark:text-slate-600"
                />
              </div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Total des utilisateurs
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {usersList.length}
              </h3>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                  <ShieldCheck size={20} />
                </div>
              </div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Vérifiés
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {usersList.filter((u) => u.isVerified).length}
              </h3>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
                  <Layers size={20} />
                </div>
              </div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Plans Pro
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {
                  usersList.filter((u) => u.paidPlan && u.paidPlan !== "Free")
                    .length
                }
              </h3>
            </div>
          </div>

          {/* 🔹 USER LIST SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Membres actifs
              </h2>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-600">
                {filteredUsers.length} total
              </span>
            </div>

            <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-3 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-transparent">
              <div className="col-span-4">Infos membre</div>
              <div className="col-span-2 text-center">Rôle</div>
              <div className="col-span-2 text-center">Statut</div>
              <div className="col-span-2 text-center">Dernière activité</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {isLoading ? (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-20 flex flex-col items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mb-4" />
                    <p className="text-sm font-bold text-slate-400">
                      Récupération de la base utilisateurs...
                    </p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-900 p-20 rounded-[32px] border border-slate-200 dark:border-slate-800 text-center"
                  >
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertCircle
                        size={32}
                        className="text-slate-300 dark:text-slate-600"
                      />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      Aucun résultat trouvé
                    </h3>
                    <p className="text-sm font-medium text-slate-400 mt-1">
                      Aucun utilisateur ne correspond à vos critères.
                    </p>
                  </motion.div>
                ) : (
                  currentUsers.map((u) => (
                    <motion.div
                      key={u._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="group bg-white dark:bg-slate-900 p-4 lg:p-6 rounded-[24px] border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col lg:grid lg:grid-cols-12 gap-4 items-center"
                    >
                      {/* USER INFO */}
                      <div className="col-span-4 flex items-center gap-4 w-full">
                        <div className="relative">
                          <div className="h-12 w-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-[18px] flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:from-indigo-50 group-hover:to-indigo-100 dark:group-hover:from-indigo-500/10 dark:group-hover:to-indigo-500/20 group-hover:text-indigo-500 transition-all">
                            <User size={22} strokeWidth={2.5} />
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 ${u.isVerified ? "bg-emerald-500" : "bg-rose-500"}`}
                          ></div>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                            {u.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 truncate">
                              {u.email}
                            </p>
                            <span className="hidden sm:inline text-slate-200 dark:text-slate-800">
                              •
                            </span>
                            <p className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                              <Phone size={10} /> {u.phone || "---"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 flex flex-col items-center w-full">
                        <div className="flex items-center gap-2">
                          <Layers size={14} className="text-indigo-500" />
                          <span className="text-sm font-black text-slate-900 dark:text-white ">
                            {u.role}
                          </span>
                        </div>
                      </div>

                      {/* VERIFIED STATUS */}
                      <div className="col-span-2 flex justify-center w-full">
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest ${
                            u.isVerified
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {u.isVerified ? (
                            <ShieldCheck size={12} />
                          ) : (
                            <ShieldAlert size={12} />
                          )}
                          {u.isVerified ? "Vérifié" : "Action requise"}
                        </span>
                      </div>

                      {/* LAST LOGIN */}
                      <div className="col-span-2 flex flex-col items-center w-full text-center">
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                          <Calendar size={12} />
                          <span className="text-[11px] font-bold">
                            {u.lastLogin
                              ? new Date(u.lastLogin).toLocaleDateString()
                              : "Jamais"}
                          </span>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="col-span-2 flex items-center justify-end w-full lg:w-auto">
                        <button
                          onClick={async () => {
                            try {
                              const updatedUser = await updateIsVerified(
                                u._id,
                                !u.isVerified,
                              );

                              setUsersList((prev) =>
                                prev.map((user) =>
                                  user._id === u._id
                                    ? {
                                        ...user,
                                        isVerified: updatedUser.isVerified,
                                      }
                                    : user,
                                ),
                              );
                            } catch (error) {
                              console.error(error);
                            }
                          }}
                          className={`w-full lg:w-auto px-5 py-2 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all active:scale-95 ${
                            u.isVerified
                              ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 dark:hover:bg-rose-600 hover:text-white"
                              : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white"
                          }`}
                        >
                          {u.isVerified ? "Dé-vérifier" : "Vérifier l'utilisateur"}
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 🔹 PAGINATION */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Affichage{" "}
                <span className="text-slate-900 dark:text-white">
                  {currentUsers.length}
                </span>{" "}
                sur{" "}
                <span className="text-slate-900 dark:text-white">
                  {filteredUsers.length}
                </span>{" "}
                membres
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                        currentPage === i + 1
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-110"
                          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-indigo-200 hover:text-indigo-600"
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
                  className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
