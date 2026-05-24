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
  X,
  Wifi,
  Coins,
  Gauge,
  Globe
} from "lucide-react";
import { useContractTypeStore } from "../store/contractTypeStore";
import CompanySidebar from "./CompanySidebar";

const ContractTypeDashboard = () => {
  const {
    contractTypes = [],
    fetchContractTypes,
    createContractType,
    updateContractType,
    deleteContractType,
    toggleContractType,
  } = useContractTypeStore();

  const [form, setForm] = useState({
    value: 0,
    price: 0,
    type: "",
    isActive: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 6;

  useEffect(() => {
    fetchContractTypes();
  }, []);

 const filteredContractTypes = useMemo(() =>
  contractTypes.filter((ct) =>
    String(ct.value)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  ),
  [contractTypes, searchQuery]
);
  
  const totalPages = Math.max(1, Math.ceil(filteredContractTypes.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const currentContractTypes = filteredContractTypes.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.value) return;

    if (editingId) {
      await updateContractType(editingId, form);
      setEditingId(null);
    } else {
      await createContractType(form);
    }

    setForm({ value: 0, price: 0, type: "", isActive: true });
    fetchContractTypes();
  };

  const startEdit = (contractType) => {
    setEditingId(contractType._id);
    setForm({
      value: contractType.value,
      price: contractType.price,
      type: contractType.type,
      isActive: contractType.isActive,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
  <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950 transition-colors duration-300">
  <CompanySidebar
    activeItem="Types de contrats"
    isOpen={isSidebarOpen}
    setIsOpen={setIsSidebarOpen}
  />

  <main className="flex-1 flex flex-col min-w-0">
    {/* Header */}
    <header className="h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Menu size={24} />
        </button>

        <div className="min-w-0">
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            Gestion des types de contrats
          </h1>
          <p className="hidden sm:block text-xs font-medium tracking-tight text-gray-500 dark:text-gray-400">
            Organisez et suivez vos types de contrats actifs
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
          <input 
            type="text"
            placeholder="Rechercher des types de contrats..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-64 transition-all"
          />
        </div>
      </div>
    </header>

    <div className="p-4 lg:p-8 max-w-6xl mx-auto w-full space-y-6 lg:space-y-8">

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatCard
          title="Types de contrats totaux"
          value={contractTypes.length}
          icon={<Gauge className="text-indigo-600" />}
          color="bg-indigo-50 dark:bg-indigo-900"
          trend="Tout le temps"
        />

        <StatCard
          title="Actifs maintenant"
          value={contractTypes.filter(ct => ct.isActive).length}
          icon={<CheckCircle2 className="text-emerald-600" />}
          color="bg-emerald-50 dark:bg-emerald-900"
          trend="Opérationnel"
        />

        <StatCard
          title="Inactifs"
          value={contractTypes.filter(ct => !ct.isActive).length}
          icon={<Briefcase className="text-amber-600" />}
          color="bg-amber-50 dark:bg-amber-900"
          trend="Archivé"
        />
      </div>

      {/* Form Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-700/30 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <Plus size={18} />
          </div>

          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-200">
            {editingId ? "Modifier un type de contrat existant" : "Ajouter un nouveau type de contrat"}
          </h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-6">

            <div className="flex-1 w-full space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest ml-1 text-gray-400 dark:text-gray-300">
                Valeur / type de contrat
              </label>
              <div className="relative">
                <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="number"
                  placeholder="ex. 10 / 100"
                  className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </div>
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest ml-1 text-gray-400 dark:text-gray-300">
                Prix du type de contrat
              </label>
              <div className="relative">
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="number"
                  placeholder="ex. 100 TND"
                  className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest ml-1 text-gray-400 dark:text-gray-300">
                Type de contrat
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="ex. ADSL, Fibre, 4G, 5G"
                  className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pb-2 px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-lg border-gray-200 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  Statut actif
                </span>
              </label>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button 
                type="submit"
                className="flex-1 md:flex-none bg-gray-900 text-white dark:bg-gray-700 dark:text-gray-100 px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-gray-200 dark:shadow-gray-800 flex items-center justify-center gap-2"
              >
                {editingId ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                {editingId ? "Enregistrer les modifications" : "Créer le type de contrat"}
              </button>

              {editingId && (
                <button 
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: "", isActive: true });
                  }}
                  className="p-3.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-200 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  <X size={20} />
                </button>
              )}
            </div>

          </form>
        </div>
      </motion.div>

      {/* List Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase truncate max-w-[150px]">
            Index des types de contrats
          </h3>

          <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
            {filteredContractTypes.length} entrées
          </span>
        </div>

        <div className="p-2 lg:p-4">
          {filteredContractTypes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/30 dark:bg-gray-700/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-600">
              <AlertCircle size={32} className="text-gray-300 dark:text-gray-500" />
              <p className="mt-2 text-sm font-bold italic text-gray-400 dark:text-gray-300">
                Aucun type de contrat trouvé correspondant à vos critères
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
              <AnimatePresence >
                {currentContractTypes.map((contractType) => (
                  <motion.div
                    layout
                    key={contractType._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`group p-4 lg:p-5 rounded-2xl border transition-all flex items-center justify-between ${
                      contractType.isActive 
                        ? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-indigo-200 hover:shadow-md dark:hover:shadow-indigo-800" 
                        : "bg-gray-50/50 dark:bg-gray-700/50 border-transparent opacity-75 grayscale"
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`p-3 rounded-xl shrink-0 ${
                        contractType.isActive ? "bg-indigo-50 dark:bg-indigo-900 text-indigo-600" : "bg-gray-200 dark:bg-gray-600 text-gray-500"
                      }`}>
                        <Gauge size={20} />
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase truncate max-w-[150px]">
                          {contractType.value} MB - {contractType.type}
                        </h4>

                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase truncate max-w-[150px]">
                          {contractType.price} TND
                        </h4>

                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${
                            contractType.isActive ? "bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200" : "bg-gray-200 dark:bg-gray-600 text-gray-500"
                          }`}>
                            {contractType.isActive ? "Actif" : "En pause"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900 rounded-lg transition-colors">
                        <CheckCircle2 size={18} />
                      </button>

                      <button
                        onClick={() => startEdit(contractType)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm("Supprimer définitivement ce type de contrat ?")) {
                            await deleteContractType(contractType._id);
                            fetchContractTypes();
                          }
                        }}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="md:hidden">
                      <MoreVertical size={18} className="text-gray-300 dark:text-gray-500" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 pt-8 pb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Page {currentPage} sur {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 disabled:opacity-30 transition-all shadow-sm"
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
    className="bg-white dark:bg-gray-800 p-5 lg:p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-start gap-4 transition-all"
  >
    <div className={`p-3.5 rounded-2xl ${color} shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold mb-1 truncate uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {title}
      </p>
      <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
        {value}
      </h3>
      <div className="mt-2 text-[10px] font-bold flex items-center gap-1 uppercase tracking-widest text-gray-500 dark:text-gray-400">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
        {trend}
      </div>
    </div>
  </motion.div>
);


export default ContractTypeDashboard
