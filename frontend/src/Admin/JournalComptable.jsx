import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Trash2,
  Edit3,
  Plus,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { useJournalComptableStore } from "../store/journalComptableStore";
import SideBarAdmin from "../Admin/SideBarAdmin";

const JournalComptable = () => {
 const { journals, fetchJournals, deleteJournal, createJournal, updateJournal } =
    useJournalComptableStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [form, setForm] = useState({ code: "", label: "" });
  const [editingId, setEditingId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    fetchJournals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await updateJournal(editingId, form);
      setEditingId(null);
    } else {
      await createJournal(form);
    }

    setForm({ code: "", label: "" });
    fetchJournals();
  };

  const handleEdit = (journal) => {
    setForm({ code: journal.code, label: journal.label });
    setEditingId(journal._id);
  };

  // 🔹 FILTER
  const filteredJournals = useMemo(() => {
    return journals.filter(
      (j) =>
        j.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [journals, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredJournals.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

  const currentJournals = filteredJournals.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
 <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950 transition-colors duration-300">
  <SideBarAdmin
    activeItem="Plan Comptable"
    isOpen={isSidebarOpen}
    setIsOpen={setIsSidebarOpen}
  />

  <main className="flex-1 flex flex-col min-w-0">
    {/* HEADER */}
    <header className="h-20 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg lg:text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Plan Comptable
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-400">
            Gérer votre structure comptable
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative hidden md:block">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300"
          size={16}
        />
        <input
          type="text"
          placeholder="Rechercher un code ou un libellé..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none w-64"
        />
      </div>
    </header>

    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* 🔹 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          title="Total des journaux"
          value={journals.length}
          icon={<FileText size={20} />}
        />
        <StatCard
          title="Filtré"
          value={filteredJournals.length}
          icon={<Search size={20} />}
        />
      </div>

      {/* 🔹 FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-slate-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-4 items-center"
      >
        <input
          placeholder="Code"
          value={form.code}
          onChange={(e) =>
            setForm({ ...form, code: e.target.value })
          }
          className="w-full md:w-40 px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 outline-none"
        />

        <input
          placeholder="Libellé"
          value={form.label}
          onChange={(e) =>
            setForm({ ...form, label: e.target.value })
          }
          className="w-full md:w-64 px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 outline-none"
        />

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition">
          <Plus size={16} />
          {editingId ? "Mettre à jour" : "Ajouter"}
        </button>
      </form>

      {/* 🔹 LIST */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredJournals.length === 0 ? (
            <motion.div className="bg-white dark:bg-gray-800 p-20 rounded-3xl border border-slate-200 dark:border-gray-700 text-center text-slate-400 dark:text-slate-300">
              <AlertCircle size={40} className="mx-auto mb-4" />
              <p className="font-bold text-slate-900 dark:text-slate-100">
                Aucun journal trouvé
              </p>
            </motion.div>
          ) : (
            currentJournals.map((j) => (
              <motion.div
                key={j._id}
                layout
                className="group bg-white dark:bg-gray-800 p-4 rounded-2xl border border-slate-200 dark:border-gray-700 hover:shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* INFO */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-50 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">
                      {j.code}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-300">
                      {j.label}
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(j)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-xl transition"
                  >
                    <Edit3 size={18} />
                  </button>

                  <button
                    onClick={() => {
                      deleteJournal(j._id);
                      fetchJournals();
                    }}
                    className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900 rounded-xl transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* 🔹 PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-gray-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filteredJournals.length} résultats
          </p>

          <div className="flex gap-2">
            <button
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              className="px-3 py-1 border rounded-lg border-slate-300 dark:border-gray-600"
            >
              <ChevronLeft size={16} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-slate-900 dark:text-slate-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              className="px-3 py-1 border rounded-lg border-slate-300 dark:border-gray-600"
            >
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

const StatCard = ({ title, value, icon }) => (
  <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-slate-200 dark:border-gray-700 flex items-center gap-4">
    <div className="p-3 bg-indigo-50 dark:bg-indigo-700 text-indigo-600 dark:text-white rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-400 dark:text-slate-300 font-bold uppercase">
        {title}
      </p>
      <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">{value}</h3>
    </div>
  </motion.div>
);

export default JournalComptable
