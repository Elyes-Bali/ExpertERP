import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Wallet,
  Hash,
  ArrowRight,
  X,
  Menu,
  Percent,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTaxStore } from "../store/taxStore";
import CompanySidebar from "./CompanySidebar";

/**
 * MAIN TAX DASHBOARD COMPONENT WITH DARK MODE SUPPORT
 */
const TaxDashboard = () => {
  const {
    taxes = [],
    vat,
    fetchTaxes,
    createTax,
    toggleTax,
    fetchVAT,
    setVAT,
    updateTax,
    deleteTax,
    updateVAT,
    deleteVAT,
  } = typeof useTaxStore !== "undefined"
    ? useTaxStore()
    : { taxes: [], vat: null };

  const [activeTab, setActiveTab] = useState("taxes");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [taxForm, setTaxForm] = useState({
    name: "",
    context: "all",
    valueType: "fixed",
    value: "",
    operation: "add",
    applyOnProducts: true,
    isActive: true,
  });

  const [vatForm, setVatForm] = useState({
    operation: "add",
    value: "",
    isActive: true,
  });

  useEffect(() => {
    if (fetchTaxes) fetchTaxes();
    if (fetchVAT) fetchVAT();
  }, [fetchTaxes, fetchVAT]);

  useEffect(() => {
    if (vat) {
      setVatForm({
        operation: vat.operation || "add",
        value: vat.value || "",
        isActive: vat.isActive ?? true,
      });
    }
  }, [vat]);

  const handleTaxSubmit = async (e) => {
    e.preventDefault();
    if (!taxForm.name || !taxForm.value) return;
    await createTax({ ...taxForm, value: Number(taxForm.value) });
    setTaxForm({
      name: "",
      context: "all",
      valueType: "fixed",
      value: "",
      operation: "add",
      applyOnProducts: true,
      isActive: true,
    });
    fetchTaxes();
  };

  const handleVATSubmit = async (e) => {
    e.preventDefault();
    if (vat) {
      await updateVAT({ ...vatForm, value: Number(vatForm.value) });
    } else {
      await setVAT({ ...vatForm, value: Number(vatForm.value) });
    }
    fetchVAT();
  };

  const totalPages = Math.max(1, Math.ceil(taxes.length / rowsPerPage));
  const currentTaxes = taxes.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [taxes.length, totalPages, currentPage]);

  return (
  <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950 transition-colors duration-300">
      <CompanySidebar
        activeItem="Paramètres"
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                Gestion des taxes & TVA
              </h1>
              <p className="hidden sm:block text-xs text-gray-500 dark:text-slate-400 font-medium tracking-tight">
                Configurer les règles fiscales et les taux de taxes pour les factures
              </p>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-6 lg:space-y-8">
          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <StatCard
              title="Taux de TVA global"
              value={vat ? `${vat.value}%` : "Non défini"}
              icon={<Percent className="text-indigo-600 dark:text-indigo-400" />}
              color="bg-indigo-50 dark:bg-indigo-500/10"
              trend={vat?.isActive ? "Actif" : "Inactif"}
            />
            <StatCard
              title="Taxes personnalisées actives"
              value={taxes.filter((t) => t.isActive).length}
              icon={<Hash className="text-emerald-600 dark:text-emerald-400" />}
              color="bg-emerald-50 dark:bg-emerald-500/10"
              trend="Prêt pour audit"
            />
            <StatCard
              title="Total des règles"
              value={taxes.length + (vat ? 1 : 0)}
              icon={<FileText className="text-amber-600 dark:text-amber-400" />}
              color="bg-amber-50 dark:bg-amber-500/10"
              trend="Contexte global"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Tabs Navigation */}
            <div className="flex flex-wrap border-b border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 p-1.5 lg:p-2">
              {[
                { id: "taxes", label: "Taxes personnalisées", icon: <Hash size={16} /> },
                { id: "vat", label: "Paramètres TVA globale", icon: <Percent size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl text-xs lg:text-sm font-semibold transition-all flex-1 sm:flex-none justify-center ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5"
                      : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5 lg:p-8">
              <AnimatePresence mode="wait">
                {activeTab === "taxes" ? (
                  <motion.div
                    key="taxes"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    {/* Create Tax Form */}
                    <div className="bg-gray-50/50 dark:bg-slate-800/20 rounded-2xl p-6 border border-gray-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 mb-6">
                        <Plus size={18} className="text-indigo-600 dark:text-indigo-400" />
                        <h2 className="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                          Créer une nouvelle taxe
                        </h2>
                      </div>

                      <form onSubmit={handleTaxSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <InputField
                          label="Nom de la taxe"
                          value={taxForm.name}
                          onChange={(e) => setTaxForm({ ...taxForm, name: e.target.value })}
                          placeholder="ex: Taxe municipale"
                        />

                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                            Contexte
                          </label>
                          <select
                            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm font-medium text-gray-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none"
                            value={taxForm.context}
                            onChange={(e) => setTaxForm({ ...taxForm, context: e.target.value })}
                          >
                            <option value="all">Toutes les transactions</option>
                            <option value="sale">Ventes uniquement</option>
                            <option value="purchase">Achats uniquement</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                            Type de valeur
                          </label>
                          <select
                            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm font-medium text-gray-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none"
                            value={taxForm.valueType}
                            onChange={(e) => setTaxForm({ ...taxForm, valueType: e.target.value })}
                          >
                            <option value="fixed">Fixe (TND)</option>
                            <option value="percentage">Pourcentage (%)</option>
                          </select>
                        </div>

                        <InputField
                          label="Valeur"
                          type="number"
                          value={taxForm.value}
                          onChange={(e) => setTaxForm({ ...taxForm, value: e.target.value })}
                          placeholder="0.00"
                        />

                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                            Opération
                          </label>
                          <select
                            className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm font-medium text-gray-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none"
                            value={taxForm.operation}
                            onChange={(e) => setTaxForm({ ...taxForm, operation: e.target.value })}
                          >
                            <option value="add">Ajouter (+)</option>
                            <option value="subtract">Soustraire (-)</option>
                          </select>
                        </div>

                        <div className="flex flex-col justify-center gap-3">
                          <Checkbox label="Appliquer sur les produits" checked={taxForm.applyOnProducts} onChange={(e) => setTaxForm({ ...taxForm, applyOnProducts: e.target.checked })} />
                          <Checkbox label="Activer" checked={taxForm.isActive} onChange={(e) => setTaxForm({ ...taxForm, isActive: e.target.checked })} />
                        </div>

                        <div className="md:col-span-2 lg:col-span-3 pt-2">
                          <button
                            type="submit"
                            className="w-full lg:w-auto bg-gray-900 dark:bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-600 dark:hover:bg-indigo-700 transition-all shadow-lg shadow-gray-200 dark:shadow-none flex items-center justify-center gap-2"
                          >
                            <Plus size={18} />
                            Créer la règle de taxe
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Taxes List */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                        Liste des règles actives
                      </h3>
                      
                      {taxes.length === 0 ? (
                        <EmptyState icon={<AlertCircle size={40} />} text="Aucune taxe personnalisée configurée." />
                      ) : (
                        <div className="space-y-4">
                          <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Détails taxe</th>
                                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Contexte</th>
                                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest text-center">Statut</th>
                                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                                {currentTaxes.map((tax) => (
                                  <tr key={tax._id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-colors">
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl shrink-0 ${tax.isActive ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "bg-gray-50 dark:bg-slate-800 text-gray-400"}`}>
                                          {tax.valueType === "percentage" ? <Percent size={18} /> : <Wallet size={18} />}
                                        </div>
                                        <div className="min-w-0">
                                          {editingTax === tax._id ? (
                                            <input
                                              autoFocus
                                              className="text-sm font-bold text-gray-900 dark:text-white bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500 rounded px-2 py-0.5 outline-none"
                                              value={taxForm.name}
                                              onChange={(e) => setTaxForm({ ...taxForm, name: e.target.value })}
                                            />
                                          ) : (
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-slate-200 truncate max-w-[150px]">{tax.name}</h4>
                                          )}
                                          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                                            {tax.operation === "add" ? "+" : "-"}{tax.value}{tax.valueType === "percentage" ? "%" : " TND"}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
                                        <Briefcase size={12} /> {tax.context}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex justify-center">
                                        <button className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${tax.isActive ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100" : "bg-gray-100 dark:bg-slate-800 text-gray-400"}`}>
                                          {tax.isActive ? "Actif" : "Suspendu"}
                                        </button>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center justify-end gap-2">
                                        {editingTax === tax._id ? (
                                          <button onClick={async () => { await updateTax(tax._id, taxForm); setEditingTax(null); fetchTaxes(); }} className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm"><CheckCircle2 size={16} /></button>
                                        ) : (
                                          <button onClick={() => { setEditingTax(tax._id); setTaxForm({ ...tax }); }} className="p-2 bg-gray-50 dark:bg-slate-800 text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"><Edit3 size={16} /></button>
                                        )}
                                        <button onClick={async () => { if (confirm("Supprimer cette taxe ?")) { await deleteTax(tax._id); fetchTaxes(); } }} className="p-2 bg-gray-50 dark:bg-slate-800 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/20 hover:text-red-600 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="vat"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    {/* VAT Configuration */}
                    <div className="bg-indigo-50/50 dark:bg-slate-800/20 rounded-3xl p-8 border border-indigo-100 dark:border-slate-800 flex flex-col items-center text-center max-w-2xl mx-auto">
                      <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                        <Percent size={32} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Configurer la TVA globale</h2>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mb-8 leading-relaxed px-4">Définir la taxe sur la valeur ajoutée standard de votre entreprise.</p>

                      <form onSubmit={handleVATSubmit} className="w-full space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField label="Taux de TVA (%)" type="number" value={vatForm.value} onChange={(e) => setVatForm({ ...vatForm, value: e.target.value })} placeholder="19" />
                          <div className="space-y-2 text-left">
                            <label className="block text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Calcul</label>
                            <select
                              className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl py-3.5 px-4 text-sm font-medium text-gray-700 dark:text-slate-200 outline-none"
                              value={vatForm.operation}
                              onChange={(e) => setVatForm({ ...vatForm, operation: e.target.value })}
                            >
                              <option value="add">Ajouter (+)</option>
                              <option value="subtract">Soustraire (-)</option>
                            </select>
                          </div>
                        </div>
                        <Checkbox label="Appliquer à toutes les factures" checked={vatForm.isActive} onChange={(e) => setVatForm({ ...vatForm, isActive: e.target.checked })} centered />
                        <button type="submit" className="w-full bg-gray-900 dark:bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 dark:shadow-none">
                          Enregistrer les paramètres TVA globaux <ArrowRight size={18} />
                        </button>
                      </form>
                    </div>

                    {vat && (
                      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${vat.isActive ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600" : "bg-gray-50 dark:bg-slate-800 text-gray-400"}`}>
                            <CheckCircle2 size={24} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Taux système actif</p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{vat.value}% <span className="text-sm font-medium text-gray-400 capitalize">({vat.operation})</span></h3>
                          </div>
                        </div>
                        <button onClick={async () => { if (confirm("Réinitialiser la TVA ?")) { await deleteVAT(); fetchVAT(); } }} className="flex items-center gap-2 px-4 py-2 text-red-600 font-bold text-xs hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
                          <Trash2 size={16} /> Réinitialiser la TVA
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div className="space-y-2 text-left">
    <label className="block text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl py-3.5 px-4 text-sm font-medium text-gray-700 dark:text-slate-200 outline-none transition-all focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500"
    />
  </div>
);

const Checkbox = ({ label, checked, onChange, centered = false }) => (
  <label className={`flex items-center gap-3 cursor-pointer group ${centered ? 'justify-center' : ''}`}>
    <input
      type="checkbox"
      className="w-5 h-5 rounded-lg border-gray-200 dark:border-slate-700 dark:bg-slate-900 text-indigo-600 focus:ring-indigo-500"
      checked={checked}
      onChange={onChange}
    />
    <span className="text-xs font-semibold text-gray-600 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-slate-200 transition-colors">
      {label}
    </span>
  </label>
);

const StatCard = ({ title, value, icon, color, trend }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white dark:bg-slate-900 p-5 lg:p-6 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-start gap-4 relative overflow-hidden group"
  >
    <div className={`p-3 rounded-2xl ${color} transition-transform group-hover:scale-110 duration-300 shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs lg:text-sm font-semibold text-gray-400 dark:text-slate-500 mb-1 truncate">{title}</p>
      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight truncate">{value}</h3>
      <div className="mt-2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">{trend}</div>
    </div>
  </motion.div>
);

const EmptyState = ({ icon, text }) => (
  <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 rounded-3xl">
    <div className="text-gray-300 dark:text-slate-700 mb-2">{icon}</div>
    <p className="text-sm font-medium text-gray-400 dark:text-slate-500 italic">{text}</p>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
        Page <span className="text-gray-900 dark:text-slate-200">{currentPage}</span> of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-500 disabled:opacity-30 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-all shadow-sm"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-500 disabled:opacity-30 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-all shadow-sm"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaxDashboard;