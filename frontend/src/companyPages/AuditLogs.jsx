import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  Search,
  ChevronLeft,
  ChevronRight,
  Activity,
  User,
  Database,
  AlertCircle,
} from "lucide-react";
import { useAuditLogStore } from "../store/auditLogStore";
import CompanySidebar from "./CompanySidebar";

const AuditLogs = () => {
  const { logs = [], fetchAuditLogs, loading } = useAuditLogStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 8;

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  // ✅ Sort logs (recent first)
  const sortedLogs = useMemo(() => {
    return [...logs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [logs]);

  // 🔍 Filter logs
  const filteredLogs = useMemo(() => {
    return sortedLogs.filter((log) =>
      `${log.action} ${log.entity} ${log.user?.name || "system"} ${log.message || ""}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [sortedLogs, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLogs.length / rowsPerPage)
  );

  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950">
      {/* Sidebar */}
      <CompanySidebar
        activeItem="Audit Logs"
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu size={24} />
            </button>

            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                Audit Logs
              </h1>
              <p className="hidden sm:block text-xs text-gray-500 dark:text-slate-400">
                Historique complet des actions système
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Rechercher logs..."
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-sm w-64 text-gray-900 dark:text-white"
            />
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-4 lg:p-8 max-w-6xl mx-auto w-full space-y-6">

          {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <StatCard
              title="Total Logs"
              value={logs.length}
              icon={<Activity className="text-indigo-600" />}
              color="bg-indigo-50 dark:bg-indigo-500/10"
            />
            <StatCard
              title="Utilisateurs"
              value={new Set(logs.map(l => l.user?._id)).size}
              icon={<User className="text-emerald-600" />}
              color="bg-emerald-50 dark:bg-emerald-500/10"
            />
            <StatCard
              title="Actions"
              value={new Set(logs.map(l => l.action)).size}
              icon={<Database className="text-amber-600" />}
              color="bg-amber-50 dark:bg-amber-500/10"
            />
          </div>

          {/* TABLE CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">

            <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-widest">Historique des actions</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {filteredLogs.length} entrées
              </span>
            </div>

            {loading ? (
              <div className="p-10 text-center text-gray-400">
                Chargement...
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-10 flex flex-col items-center text-gray-400">
                <AlertCircle size={30} />
                <p className="mt-2 text-sm">Aucun log trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 text-xs uppercase">
                    <tr>
                      <th className="text-left px-6 py-4">Action</th>
                      <th className="text-left px-6 py-4">Entité</th>
                      <th className="text-left px-6 py-4">Utilisateur</th>
                      <th className="text-left px-6 py-4">Message</th>
                      <th className="text-right px-6 py-4">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentLogs.map((log) => (
                      <motion.tr
                        key={log._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition"
                      >
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          {log.action}
                        </td>

                        <td className="px-6 py-4 text-gray-600 dark:text-slate-300">
                          {log.entity}
                        </td>

                        <td className="px-6 py-4 text-gray-600 dark:text-slate-300">
                          {log.user?.name || "System"}
                        </td>

                        <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                          {log.message || "-"}
                        </td>

                        <td className="px-6 py-4 text-right text-xs text-gray-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-slate-800">
                <p className="text-xs text-gray-400">
                  Page {currentPage} / {totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-2 rounded-xl border dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-xl border dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

/* ================= STATS CARD ================= */
const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 flex gap-4"
  >
    <div className={`p-3 rounded-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-[10px] uppercase text-gray-400">{title}</p>
      <h3 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white tracking-tight truncate">{value}</h3>
    </div>
  </motion.div>
);

export default AuditLogs;