import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Menu,
  Briefcase,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X
} from "lucide-react";
import { useWarehouseStore } from "../store/warehouseStore";
import CompanySidebar from "./CompanySidebar";

const WrahousesDashboard = () => {
  const {
    warehouses = [],
    fetchWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  } = useWarehouseStore();

  const [form, setForm] = useState({
    name: "",
    isActive: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Pagination & Search State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 6;

  useEffect(() => {
    fetchWarehouses();
  }, []);

  // Filtered warehouses logic
  const filteredWarehouses = useMemo(() => 
    warehouses.filter(w => 
      w.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [warehouses, searchQuery]
  );
  
  const totalPages = Math.max(1, Math.ceil(filteredWarehouses.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const currentWarehouses = filteredWarehouses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;

    if (editingId) {
      await updateWarehouse(editingId, form);
      setEditingId(null);
    } else {
      await createWarehouse(form);
    }

    setForm({ name: "", isActive: true });
    fetchWarehouses();
  };

  const startEdit = (warehouse) => {
    setEditingId(warehouse._id);
    setForm({
      name: warehouse.name,
      isActive: warehouse.isActive,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
  <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950 transition-colors duration-300">
      <CompanySidebar
        activeItem="Projets"
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white font-display">
                Gestion des entrepôts
              </h1>
              <p className="hidden sm:block text-xs text-gray-500 dark:text-slate-400 font-medium tracking-tight">
                Organisez et suivez vos entités commerciales actives
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={16} />
                <input 
                  type="text"
                  placeholder="Rechercher des entrepôts..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 outline-none w-64 transition-all"
                />
             </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-6xl mx-auto w-full space-y-6 lg:space-y-8">
          
          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <StatCard
              title="Total des entrepôts"
              value={warehouses.length}
              icon={<Folder className="text-indigo-600 dark:text-indigo-400" />}
              color="bg-indigo-50 dark:bg-indigo-500/10"
              trend="Tous temps"
            />
            <StatCard
              title="Actifs"
              value={warehouses.filter(w => w.isActive).length}
              icon={<CheckCircle2 className="text-emerald-600 dark:text-emerald-400" />}
              color="bg-emerald-50 dark:bg-emerald-500/10"
              trend="Opérationnel"
            />
            <StatCard
              title="Inactifs"
              value={warehouses.filter(w => !w.isActive).length}
              icon={<Briefcase className="text-amber-600 dark:text-amber-400" />}
              color="bg-amber-50 dark:bg-amber-500/10"
              trend="Archivé"
            />
          </div>

          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-50 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white">
                <Plus size={18} />
              </div>
              <h2 className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-widest">
                {editingId ? "Modifier l'entrepôt existant" : "Ajouter un nouvel entrepôt"}
              </h2>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-6">
                <div className="flex-1 w-full space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                    Nom / Libellé de l'entrepôt
                  </label>
                  <div className="relative">
                    <Folder className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
                    <input
                      placeholder="ex. Expansion marketing T4"
                      className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-gray-900 dark:text-slate-100 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pb-2 px-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded-lg border-gray-200 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer bg-transparent"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    />
                    <span className="text-xs font-bold text-gray-500 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-slate-200 transition-colors uppercase tracking-wider">
                      Statut actif
                    </span>
                  </label>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button 
                    type="submit"
                    className="flex-1 md:flex-none bg-gray-900 dark:bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all shadow-lg shadow-gray-200 dark:shadow-none flex items-center justify-center gap-2"
                  >
                    {editingId ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                    {editingId ? "Enregistrer les modifications" : "Créer l'entrepôt"}
                  </button>
                  
                  {editingId && (
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setForm({ name: "", isActive: true });
                      }}
                      className="p-3.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>

          {/* List Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200">Index principal des entrepôts</h3>
              <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest px-3 py-1 bg-gray-50 dark:bg-slate-800 rounded-full border border-gray-100 dark:border-slate-700">
                {filteredWarehouses.length} entrées
              </span>
            </div>

            <div className="p-2 lg:p-4">
              {filteredWarehouses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50/30 dark:bg-slate-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                  <AlertCircle size={32} className="text-gray-300 dark:text-slate-700" />
                  <p className="mt-2 text-sm font-bold text-gray-400 dark:text-slate-600 italic">
                    Aucun entrepôt ne correspond à vos critères
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                  <AnimatePresence >
                    {currentWarehouses.map((warehouse) => (
                      <motion.div
                        layout
                        key={warehouse._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`group p-4 lg:p-5 rounded-2xl border transition-all flex items-center justify-between ${
                          warehouse.isActive 
                            ? "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:shadow-md" 
                            : "bg-gray-50/50 dark:bg-slate-800/20 border-transparent opacity-75 grayscale"
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`p-3 rounded-xl shrink-0 ${
                            warehouse.isActive 
                              ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                              : "bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-600"
                          }`}>
                            <Folder size={20} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 truncate pr-2">
                              {warehouse.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${
                                warehouse.isActive 
                                  ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" 
                                  : "bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-500"
                              }`}>
                                {warehouse.isActive ? "Actif" : "En pause"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                          <button
                            onClick={() => startEdit(warehouse)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm("Supprimer définitivement cet entrepôt ?")) {
                                await deleteWarehouse(warehouse._id);
                                fetchWarehouses();
                              }
                            }}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <div className="md:hidden">
                            <MoreVertical size={18} className="text-gray-300 dark:text-slate-700" />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-8 pb-4">
                  <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                    Page {currentPage} sur {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white dark:bg-slate-900 p-5 lg:p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-start gap-4 transition-all"
  >
    <div className={`p-3.5 rounded-2xl ${color} shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 mb-1 truncate uppercase tracking-widest">
        {title}
      </p>
      <h3 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white tracking-tight truncate">
        {value}
      </h3>
      <div className="mt-2 text-[10px] font-bold text-gray-500 dark:text-slate-400 flex items-center gap-1 uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
        {trend}
      </div>
    </div>
  </motion.div>
);

export default WrahousesDashboard;