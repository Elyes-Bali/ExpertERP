import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Menu,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Calendar,
  Warehouse,
  FileText,
  Download,
  Package,
  Layers,
} from "lucide-react";

// --- STORE IMPORTS ---
import { useInvoiceStore } from "../store/supplierInvoiceStore";
import { useSupplierStore } from "../store/supplierStore";
import { useProductStore } from "../store/productStore";
import { useWarehouseStore } from "../store/warehouseStore";
import { useProjectStore } from "../store/projectsStore";
import CompanySidebar from "./CompanySidebar";

// Tailwind Base Classes for Inputs to handle Dark Mode consistently
const baseInput =
  "w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-[1.25rem] px-5 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 transition-all outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-500";

const SupplierInvoiceDashboard = () => {
  const {
    invoices = [],
    fetchInvoices,
    createInvoice,
    downloadPDF,
    deleteInvoice,
  } = useInvoiceStore();

  const { suppliers = [], fetchSuppliers } = useSupplierStore();
  const { products = [], fetchProducts } = useProductStore();
  const { warehouses = [], fetchWarehouses } = useWarehouseStore();
  const { projects = [], fetchProjects } = useProjectStore();

  const [productSearch, setProductSearch] = useState({});
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    supplier: "",
    date: "",
    warehouse: "",
    project: "",
    note: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 6;
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetchInvoices();
    fetchSuppliers();
    fetchProducts();
    fetchWarehouses();
    fetchProjects();
  }, []);

  const addItem = () => setItems([...items, { product: "", quantity: 1 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("supplier", form.supplier);
    formData.append("note", form.note);
    formData.append("items", JSON.stringify(items));
    formData.append("date", form.date);
    formData.append("warehouse", form.warehouse);
    formData.append("project", form.project);

    await createInvoice(formData);
    setItems([]);
    setForm({ supplier: "", date: "", warehouse: "", project: "", note: "" });
    fetchInvoices();
  };

  const handleDeleteInvoice = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteInvoice(id);
    }
  };

  const filteredInvoices = useMemo(
    () =>
      invoices.filter(
        (inv) =>
          inv.supplier?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          inv.project?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [invoices, searchQuery],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvoices.length / rowsPerPage),
  );
  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  return (
  <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950 transition-colors duration-300">
      <CompanySidebar
        activeItem="Factures"
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                Facture fournisseur
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                  Suivi des revenus
                </span>
              </div>
            </div>
          </div>

          <div className="relative hidden md:block">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Rechercher une référence..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-11 pr-4 py-2.5 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm font-medium text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/5 outline-none w-72 transition-all"
            />
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total des factures"
              value={invoices.length}
              icon={<FileText size={20} />}
              color="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
              label="Nombre de documents"
            />
            <StatCard
              title="Fournisseurs actifs"
              value={suppliers.length}
              icon={<Briefcase size={20} />}
              color="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              label="Comptes facturés"
            />
            <StatCard
              title="Projets en cours"
              value={projects.length}
              icon={<Layers size={20} />}
              color="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
              label="Mandats liés"
            />
          </div>

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/20 dark:shadow-none overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/20 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                <Plus size={18} />
              </div>
              <div>
                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  Créer une nouvelle facture
                </h2>
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">
                  Spécifier les détails de la transaction
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-10">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FormGroup
                  label="Sélectionner le fournisseur"
                  icon={<Briefcase size={14} />}
                >
                  <select
                    className={baseInput}
                    value={form.supplier}
                    onChange={(e) =>
                      setForm({ ...form, supplier: e.target.value })
                    }
                  >
                    <option value="" className="dark:bg-slate-900">
                      Choisir un fournisseur...
                    </option>
                    {suppliers.map((c) => (
                      <option
                        key={c._id}
                        value={c._id}
                        className="dark:bg-slate-900"
                      >
                        {c.name}
                      </option>
                    ))}
                  </select>
                </FormGroup>

                <FormGroup label="Date de facture" icon={<Calendar size={14} />}>
                  <input
                    type="date"
                    className={baseInput}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </FormGroup>

                <FormGroup label="Entrepôt" icon={<Warehouse size={14} />}>
                  <select
                    className={baseInput}
                    value={form.warehouse}
                    onChange={(e) =>
                      setForm({ ...form, warehouse: e.target.value })
                    }
                  >
                    <option value="" className="dark:bg-slate-900">
                      Source de stock...
                    </option>
                    {warehouses.map((w) => (
                      <option
                        key={w._id}
                        value={w._id}
                        className="dark:bg-slate-900"
                      >
                        {w.name}
                      </option>
                    ))}
                  </select>
                </FormGroup>

                <FormGroup label="Lien de projet" icon={<Layers size={14} />}>
                  <select
                    className={baseInput}
                    value={form.project}
                    onChange={(e) =>
                      setForm({ ...form, project: e.target.value })
                    }
                  >
                    <option value="" className="dark:bg-slate-900">
                      Centre de coûts...
                    </option>
                    {projects.map((p) => (
                      <option
                        key={p._id}
                        value={p._id}
                        className="dark:bg-slate-900"
                      >
                        {p.name}
                      </option>
                    ))}
                  </select>
                </FormGroup>
              </div>

              <FormGroup label="Notes / Conditions" icon={<FileText size={14} />}>
                <textarea
                  rows="2"
                  className={`${baseInput} resize-none`}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Conditions de paiement..."
                />
              </FormGroup>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                    Articles de facturation
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-4 py-2 rounded-xl transition-all"
                  >
                    <Plus size={14} /> Ajouter une ligne
                  </button>
                </div>

                <div className="space-y-3">
                  <AnimatePresence >
                    {items.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col md:flex-row gap-4 p-5 bg-gray-50/50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-800 rounded-3xl items-end"
                      >
                        <FormGroup
                          label="Produit"
                          icon={<Package size={12} />}
                          className="flex-1"
                        >
                          <div className="relative w-full">
                            <input
                              type="text"
                              className={baseInput}
                              placeholder="Rechercher un produit..."
                              value={
                                productSearch[index] ??
                                products.find((p) => p._id === item.product)
                                  ?.name ??
                                ""
                              }
                              onFocus={() => setOpenIndex(index)}
                              onChange={(e) =>
                                setProductSearch({
                                  ...productSearch,
                                  [index]: e.target.value,
                                })
                              }
                            />
                            {openIndex === index && (
                              <div className="absolute z-50 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl mt-2 max-h-52 overflow-y-auto shadow-xl">
                                {products
                                  .filter((p) =>
                                    p.name
                                      .toLowerCase()
                                      .includes(
                                        (
                                          productSearch[index] || ""
                                        ).toLowerCase(),
                                      ),
                                  )
                                  .map((p) => (
                                    <div
                                      key={p._id}
                                      onClick={() => {
                                        const newItems = [...items];
                                        newItems[index].product = p._id;
                                        setItems(newItems);
                                        setProductSearch({
                                          ...productSearch,
                                          [index]: p.name,
                                        });
                                        setOpenIndex(null);
                                      }}
                                      className="px-4 py-3 cursor-pointer hover:bg-indigo-50 dark:hover:bg-slate-700 text-sm border-b border-gray-50 dark:border-slate-700 last:border-0"
                                    >
                                      <div className="font-semibold text-gray-900 dark:text-white">
                                        {p.name}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-slate-400">
                                        Stock : {p.stock} | {p.price} TND
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </FormGroup>
                        <FormGroup label="Qté" className="w-full md:w-32">
                          <input
                            type="number"
                            className={baseInput}
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].quantity = Number(e.target.value);
                              setItems(newItems);
                            }}
                          />
                        </FormGroup>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-3.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-rose-500 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={!form.supplier || !form.date || items.length === 0}
                  className="w-full md:w-auto bg-gray-900 dark:bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-400 transition-all shadow-xl dark:shadow-none"
                >
                  Générer et enregistrer la commande
                </button>
              </div>
            </form>
          </motion.div>

          {/* INVOICE INDEX */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 px-2">
              <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
              Archive ({filteredInvoices.length} entrées)
            </h3>

            {filteredInvoices.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-800 py-20 flex flex-col items-center">
                <AlertCircle
                  size={32}
                  className="text-gray-200 dark:text-gray-800 mb-4"
                />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Aucune facture correspondante
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {currentInvoices.map((inv) => (
                    <motion.div
                      key={inv._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 hover:shadow-2xl dark:hover:shadow-none transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                              <FileText size={20} />
                            </div>
                            <div>
                              <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase">
                                RÉF-FACT
                              </span>
                              <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase truncate max-w-[150px]">
                                {inv.supplier?.name || "Fournisseur"}
                              </h4>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => downloadPDF(inv._id)}
                              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                            >
                              <Download size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteInvoice(inv._id)}
                              className="p-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                              Projet
                            </p>
                            <p className="text-[11px] font-bold text-gray-800 dark:text-slate-200 uppercase">
                              {inv.project?.name || "Standard"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">
                              Date
                            </p>
                            <p className="text-[11px] font-bold text-gray-800 dark:text-slate-200">
                              {new Date(inv.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 border-t border-gray-50 dark:border-slate-800 pt-4">
                          {inv.items.slice(0, 3).map((item, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center text-[11px] font-medium text-gray-500 dark:text-slate-400"
                            >
                              <span className="truncate max-w-[60%]">
                                • {item.name}
                              </span>
                              <span className="font-bold text-gray-800 dark:text-slate-300">
                                {item.total?.toFixed(2)} TND
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-50 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase">
                            Sous-total: {inv.subtotal} TND
                          </p>
                          <p className="text-[10px] font-black text-gray-400 uppercase">
                            TVA totale: {inv.totalVAT} TND
                          </p>
                          <p className="text-[10px] font-black text-gray-400 uppercase">
                            Taxes: {inv.totalTaxes} TND
                          </p>
                          <p className="text-[10px] font-black text-gray-400 uppercase">
                            Timbre fiscal: {inv.timbreFiscal} TND
                          </p>

                          <p className="text-[10px] font-black text-gray-400 uppercase">
                            Total à payer
                          </p>
                          <p className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
                            {inv.netPay?.toFixed(3)} TND
                          </p>
                        </div>
                        <div className="px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                          Finalisé
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-8 py-5 rounded-3xl border border-gray-100 dark:border-slate-800">
                <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase">
                  Page {currentPage} sur {totalPages}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-20"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-20"
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

const FormGroup = ({ label, children, icon, className = "" }) => (
  <div className={`space-y-3 ${className}`}>
    <div className="flex items-center gap-2 px-1">
      {icon && (
        <span className="text-gray-400 dark:text-slate-600">{icon}</span>
      )}
      <label className="text-[10px] font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest">
        {label}
      </label>
    </div>
    {children}
  </div>
);

const StatCard = ({ title, value, icon, color, label }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm flex items-start gap-6 group transition-all"
  >
    <div
      className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0`}
    >
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 mb-1 uppercase tracking-widest">
        {title}
      </p>
      <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
        {value}
      </h3>
      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-600 mt-1 uppercase">
        {label}
      </p>
    </div>
  </motion.div>
);

export default SupplierInvoiceDashboard;
