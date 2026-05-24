import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Menu,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Box,
  Tag,
  Hash,
  Layers,
  ArrowRight
} from "lucide-react";
import { useCatalogStore } from "../store/catalogStore";
import CompanySidebar from "./CompanySidebar";

const CatalogDashboard = () => {
  const {
    categories,
    units,
    brands,
    fetchCategories,
    fetchUnits,
    fetchBrands,
    createCategory,
    updateCategory,
    deleteCategory,
    createUnit,
    updateUnit,
    deleteUnit,
    createBrand,
    updateBrand,
    deleteBrand,
  } = useCatalogStore();

  const [tab, setTab] = useState("categories");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [form, setForm] = useState({ name: "", restriction: "all" });
  const [unitForm, setUnitForm] = useState({ label: "", code: "" });
  const [brandForm, setBrandForm] = useState({ name: "" });

  const [editing, setEditing] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  useEffect(() => {
    fetchCategories();
    fetchUnits();
    fetchBrands();
  }, []);

  /////////////////////////////////////
  // HANDLERS
  /////////////////////////////////////
  const handleCategory = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateCategory(editing, form);
      setEditing(null);
    } else {
      await createCategory(form);
    }
    setForm({ name: "", restriction: "all" });
    fetchCategories();
  };

  const handleUnit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateUnit(editing, unitForm);
      setEditing(null);
    } else {
      const { _id, company, isDefault, createdAt, updatedAt, ...cleanData } = unitForm;
      await createUnit(cleanData);
    }
    setUnitForm({ label: "", code: "" });
    fetchUnits();
  };

  const handleBrand = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateBrand(editing, brandForm);
      setEditing(null);
    } else {
      await createBrand(brandForm);
    }
    setBrandForm({ name: "" });
    fetchBrands();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete this ${tab.slice(0, -1)} permanently?`)) return;

    if (tab === "categories") {
      await deleteCategory(id);
      fetchCategories();
    } else if (tab === "units") {
      await deleteUnit(id);
      fetchUnits();
    } else if (tab === "brands") {
      await deleteBrand(id);
      fetchBrands();
    }
  };

  /////////////////////////////////////
  // DATA SWITCH
  /////////////////////////////////////
  const currentData = useMemo(() => {
    if (tab === "categories") return categories;
    if (tab === "units") return units;
    return brands;
  }, [tab, categories, units, brands]);

  const filteredData = useMemo(() => {
    return currentData.filter((item) =>
      (item.name || item.label || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [currentData, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

  const paginated = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getTabIcon = (t) => {
    switch(t) {
      case 'categories': return <Layers size={18} />;
      case 'units': return <Box size={18} />;
      case 'brands': return <Tag size={18} />;
      default: return <Folder size={18} />;
    }
  };

  return (
<div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950 transition-colors duration-300">
      <CompanySidebar
        activeItem="Catalogue"
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-800/80">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">Moteur de catalogue</h1>
              <p className="hidden sm:block text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-widest">Gestion globale des données de référence</p>
            </div>
          </div>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400" size={16} />
            <input
              placeholder="Filtrer les enregistrements..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-64 transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
            />
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-8 max-w-6xl mx-auto w-full">
          <div className="flex p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
            {["categories", "units", "brands"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setEditing(null);
                  setSearchQuery("");
                }}
                className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                  tab === t 
                    ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                }`}
              >
                {getTabIcon(t)}
                {t === "categories" ? "catégories" : t === "units" ? "unités" : "marques"}
                {tab === t && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 border-2 border-indigo-500/10 rounded-xl pointer-events-none" 
                  />
                )}
              </button>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Plus size={16} />
                </div>
                <h2 className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-widest">
                  {editing ? `Modifier ${tab.slice(0, -1)}` : `Nouvelle entrée ${tab.slice(0, -1)}`}
                </h2>
              </div>
              {editing && (
                <button 
                  onClick={() => setEditing(null)}
                  className="text-[10px] font-bold text-red-500 hover:underline uppercase tracking-widest"
                >
                  Annuler modification
                </button>
              )}
            </div>

            <div className="p-6">
              {tab === "categories" && (
                <form onSubmit={handleCategory} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" size={18} />
                    <input
                      placeholder="ex : Machines industrielles"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={form.restriction}
                      onChange={(e) => setForm({ ...form, restriction: e.target.value })}
                      className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 px-6 pr-10 text-sm font-bold text-gray-700 dark:text-gray-100 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer"
                    >
                      <option value="all">Accès global</option>
                      <option value="sale">Ventes uniquement</option>
                      <option value="purchase">Achats uniquement</option>
                    </select>
                  </div>
                  <button className="bg-gray-900 dark:bg-gray-700 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all shadow-lg shadow-gray-200 dark:shadow-black flex items-center justify-center gap-2">
                    {editing ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                    {editing ? "Appliquer les modifications" : "Créer l’enregistrement"}
                  </button>
                </form>
              )}

              {/* UNITS FORM */}
              {tab === "units" && (
                <form onSubmit={handleUnit} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" size={18} />
                    <input
                      placeholder="Libellé (ex : Kilogrammes)"
                      value={unitForm.label}
                      onChange={(e) => setUnitForm({ ...unitForm, label: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
                    />
                  </div>
                  <div className="w-full md:w-40 relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" size={18} />
                    <input
                      placeholder="Code (KG)"
                      value={unitForm.code}
                      onChange={(e) => setUnitForm({ ...unitForm, code: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
                    />
                  </div>
                  <button className="bg-gray-900 dark:bg-gray-700 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all shadow-lg shadow-gray-200 dark:shadow-black flex items-center justify-center gap-2">
                    {editing ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                    {editing ? "Enregistrer l’unité" : "Ajouter une unité"}
                  </button>
                </form>
              )}

              {/* BRANDS FORM */}
              {tab === "brands" && (
                <form onSubmit={handleBrand} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" size={18} />
                    <input
                      placeholder="Nom officiel de la marque"
                      value={brandForm.name}
                      onChange={(e) => setBrandForm({ name: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
                    />
                  </div>
                  <button className="bg-gray-900 dark:bg-gray-700 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all shadow-lg shadow-gray-200 dark:shadow-black flex items-center justify-center gap-2">
                    {editing ? <CheckCircle2 size={18} /> : <Plus size={18} />}
                    {editing ? "Mettre à jour la marque" : "Enregistrer la marque"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* LISTING SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-gray-400 dark:text-gray-400 uppercase tracking-[0.2em]">Enregistrements actifs {tab}</h3>
              <div className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-700">
                {filteredData.length} TOTAL
              </div>
            </div>

            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle size={32} className="text-gray-300 dark:text-gray-400" />
                </div>
                <p className="text-sm font-bold text-gray-400 dark:text-gray-400 italic">Aucun enregistrement correspondant trouvé dans la base de données</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence >
                  {paginated.map((item) => (
                    <motion.div
                      layout
                      key={item._id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="group p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl flex justify-between items-center transition-all hover:border-indigo-200 dark:hover:border-indigo-500 hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-300 group-hover:bg-indigo-50 group-hover:dark:bg-indigo-900 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center transition-colors">
                          {getTabIcon(tab)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
                            {item.name || item.label}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-tighter">
                              {item.code || item.restriction || 'Standard'}
                            </span>
                            {item.restriction && (
                              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                            )}
                            {item.restriction && (
                              <span className="text-[10px] font-bold text-indigo-400 dark:text-indigo-400 capitalize">
                                {item.restriction}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditing(item._id);
                            if (tab === "categories") setForm(item);
                            if (tab === "units") setUnitForm(item);
                            if (tab === "brands") setBrandForm(item);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-400 uppercase tracking-widest">
                    Enregistrement {((currentPage - 1) * rowsPerPage) + 1} à {Math.min(currentPage * rowsPerPage, filteredData.length)} sur {filteredData.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex items-center px-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300">
                    {currentPage} / {totalPages}
                  </div>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <ChevronRight size={20} />
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

export default CatalogDashboard;