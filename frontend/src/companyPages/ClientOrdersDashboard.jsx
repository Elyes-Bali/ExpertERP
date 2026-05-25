import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  Menu,
  AlertCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Folder,
  Briefcase,
  Calendar,
  Warehouse,
  FileText,
  Download,
  Package,
  X,
  CreditCard,
  Layers,
} from "lucide-react";

import { useClientOrderStore } from "../store/clientOrderStore";
import { useCustomerStore } from "../store/customerStore";
import { useProductStore } from "../store/productStore";
import { useWarehouseStore } from "../store/warehouseStore";
import { useProjectStore } from "../store/projectsStore";
import CompanySidebar from "./CompanySidebar";

const ClientOrdersDashboard = () => {
  const {
    orders = [],
    fetchOrders,
    createOrder,
    downloadPDF,
    deleteOrder,
  } = useClientOrderStore();
  const { customers = [], fetchCustomers } = useCustomerStore();
  const { products = [], fetchProducts } = useProductStore();
  const { warehouses = [], fetchWarehouses } = useWarehouseStore();
  const { projects = [], fetchProjects } = useProjectStore();
  const [productSearch, setProductSearch] = useState({});
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false); // ← NEW

  const [form, setForm] = useState({
    customer: "",
    date: "",
    warehouse: "",
    project: "",
    note: "",
  });
  const [logo, setLogo] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 6;
  const [openIndex, setOpenIndex] = useState(null);
  const [stockWarning, setStockWarning] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
    fetchWarehouses();
    fetchProjects();
  }, []);

  const addItem = () => setItems([...items, { product: "", quantity: 1 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const checkStock = (itemsList) => {
    const warnings = [];
    itemsList.forEach((item, index) => {
      const product = products.find((p) => p._id === item.product);
      if (product && item.quantity > product.stock) {
        warnings.push({
          index,
          product: product.name,
          available: product.stock,
          requested: item.quantity,
        });
      }
    });
    setStockWarning(warnings);
    return warnings.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = checkStock(items);
    if (!isValid) return;
    const formData = new FormData();
    formData.append("customer", form.customer);
    formData.append("note", form.note);
    formData.append("items", JSON.stringify(items));
    formData.append("date", form.date);
    formData.append("warehouse", form.warehouse);
    formData.append("project", form.project);
    if (logo) formData.append("logo", logo);

    await createOrder(formData);
    setItems([]);
    setStockWarning([]);
    setForm({ customer: "", date: "", warehouse: "", project: "", note: "" });
    setShowForm(false); // ← close form after submit
    fetchOrders();
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      useClientOrderStore.setState((state) => ({
        orders: state.orders.filter((order) => order._id !== id),
      }));
      await deleteOrder(id);
    }
  };

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.customer?.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.project?.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [orders, searchQuery],
  );

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

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
        <header className="h-20 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                Commandes
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Suivi des revenus
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Rechercher une référence ou un client..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-11 pr-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white outline-none w-72 transition-all"
              />
            </div>

            {/* TOGGLE FORM BUTTON */}
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg ${
                showForm
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-none"
                  : "bg-indigo-600 text-white shadow-indigo-100 dark:shadow-none hover:bg-indigo-700"
              }`}
            >
              {showForm ? <X size={14} /> : <Plus size={14} />}
              {showForm ? "Annuler" : "Nouvelle commande"}
            </button>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total des commandes"
              value={orders.length}
              icon={<FileText size={20} className="text-indigo-600 dark:text-indigo-400" />}
              color="bg-indigo-50 dark:bg-indigo-900/20"
              label="Nombre de documents"
            />
            <StatCard
              title="Clients actifs"
              value={customers.length}
              icon={<Briefcase size={20} className="text-emerald-600 dark:text-emerald-400" />}
              color="bg-emerald-50 dark:bg-emerald-900/20"
              label="Comptes facturés"
            />
            <StatCard
              title="Projets en cours"
              value={projects.length}
              icon={<Layers size={20} className="text-amber-600 dark:text-amber-400" />}
              color="bg-amber-50 dark:bg-amber-900/20"
              label="Mandats liés"
            />
          </div>

          {/* FORM: CREATE ORDER — toggled */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
                className="bg-white dark:bg-[#111827] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none overflow-hidden"
              >
                <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                      <Plus size={18} />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                        Nouvelle commande brouillon
                      </h2>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                        Spécifier les détails de transaction et les articles
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FormGroup label="Sélectionner un client" icon={<Briefcase size={14} />}>
                      <select
                        className="custom-input"
                        value={form.customer}
                        onChange={(e) => setForm({ ...form, customer: e.target.value })}
                      >
                        <option value="">Choisir un client...</option>
                        {customers.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </FormGroup>

                    <FormGroup label="Date de commande" icon={<Calendar size={14} />}>
                      <input
                        type="date"
                        className="custom-input"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                      />
                    </FormGroup>

                    <FormGroup label="Entrepôt" icon={<Warehouse size={14} />}>
                      <select
                        className="custom-input"
                        value={form.warehouse}
                        onChange={(e) => setForm({ ...form, warehouse: e.target.value })}
                      >
                        <option value="">Source de stock...</option>
                        {warehouses.map((w) => (
                          <option key={w._id} value={w._id}>{w.name}</option>
                        ))}
                      </select>
                    </FormGroup>

                    <FormGroup label="Lien de projet" icon={<Layers size={14} />}>
                      <select
                        className="custom-input"
                        value={form.project}
                        onChange={(e) => setForm({ ...form, project: e.target.value })}
                      >
                        <option value="">Centre de coûts...</option>
                        {projects.map((p) => (
                          <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                      </select>
                    </FormGroup>
                  </div>

                  <FormGroup label="Notes / Conditions" icon={<FileText size={14} />}>
                    <textarea
                      rows="2"
                      placeholder="Conditions de paiement, coordonnées bancaires ou message personnel..."
                      className="custom-input resize-none"
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                    />
                  </FormGroup>

                  {stockWarning.length > 0 && (
                    <div className="p-4 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-widest mb-2">
                        <AlertCircle size={16} />
                        Alerte de stock
                      </div>
                      {stockWarning.map((w, i) => (
                        <p key={i} className="text-xs text-red-600 dark:text-red-300">
                          • <b>{w.product}</b> : seulement {w.available} disponible — vous avez demandé {w.requested}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* LINE ITEMS */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                        Articles de facturation
                      </h3>
                      <button
                        type="button"
                        onClick={addItem}
                        className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-4 py-2 rounded-xl transition-all"
                      >
                        <Plus size={14} /> Ajouter une ligne
                      </button>
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence>
                        {items.map((item, index) => (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={index}
                            className="flex flex-col md:flex-row gap-4 p-5 bg-gray-50/50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-3xl items-end"
                          >
                            <FormGroup label="Produit" icon={<Package size={12} />} className="flex-1">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Sélectionner ou rechercher un produit..."
                                  className="custom-input"
                                  value={
                                    productSearch[index] ??
                                    products.find((p) => p._id === item.product)?.name ??
                                    ""
                                  }
                                  onFocus={() => setOpenIndex(index)}
                                  onChange={(e) =>
                                    setProductSearch({ ...productSearch, [index]: e.target.value })
                                  }
                                />
                                {openIndex === index && (
                                  <div className="absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl mt-2 max-h-52 overflow-y-auto shadow-lg">
                                    {products
                                      .filter((p) =>
                                        p.name.toLowerCase().includes((productSearch[index] || "").toLowerCase())
                                      )
                                      .map((p) => (
                                        <div
                                          key={p._id}
                                          onClick={() => {
                                            const newItems = [...items];
                                            newItems[index].product = p._id;
                                            setItems(newItems);
                                            setProductSearch({ ...productSearch, [index]: p.name });
                                            setOpenIndex(null);
                                          }}
                                          className="px-4 py-2 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-sm"
                                        >
                                          <div className="font-semibold text-gray-900 dark:text-white">{p.name}</div>
                                          <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Stock : {p.stock} | {p.price} TND | TVA : {p.vat ? p.vat.value : 0}%
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
                                className="custom-input"
                                placeholder="0"
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
                              className="p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-rose-500 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-100 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {items.length === 0 && (
                        <div className="py-10 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-300 dark:text-gray-700">
                          <Package size={24} className="mb-2 opacity-20" />
                          <p className="text-[10px] font-black uppercase tracking-widest">
                            La commande est vide
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      type="submit"
                      disabled={!form.customer || !form.date || items.length === 0}
                      className="w-full md:w-auto bg-gray-900 dark:bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 dark:hover:bg-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 transition-all shadow-xl shadow-gray-200/50 dark:shadow-none"
                    >
                      Générer et enregistrer la commande
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ORDER INDEX */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                Archive ({filteredOrders.length} entrées)
              </h3>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-800 py-20 flex flex-col items-center">
                <AlertCircle size={32} className="text-gray-200 dark:text-gray-800 mb-4" />
                <p className="text-sm font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
                  Aucune commande correspondante
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#111827] rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Client</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Date d'émission</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Articles</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Sous-total</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">TVA</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Taxes</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Timbre</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Statut</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {currentOrders.map((order, index) => (
                          <motion.tr
                            key={order._id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ delay: index * 0.03 }}
                            className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-indigo-900/5 hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-colors group"
                          >
                            {/* Client */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                  <FileText size={16} />
                                </div>
                                <div>
                                  <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-tighter">RÉF-COM</p>
                                  <p className="text-xs font-black text-gray-900 dark:text-white uppercase truncate max-w-[120px]">
                                    {order.customer?.name}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Date */}
                            <td className="px-6 py-4">
                              <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                {new Date(order.date).toLocaleDateString()}
                              </p>
                            </td>

                            {/* Articles */}
                            <td className="px-6 py-4 max-w-[200px]">
                              <div className="space-y-1">
                                {order.items.slice(0, 2).map((item, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-600 shrink-0"></div>
                                    <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">
                                      {item.name}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap shrink-0">
                                      ×{item.quantity}
                                    </span>
                                  </div>
                                ))}
                                {order.items.length > 2 && (
                                  <p className="text-[9px] text-gray-400 italic">
                                    +{order.items.length - 2} autres articles
                                  </p>
                                )}
                              </div>
                            </td>

                            {/* Sous-total */}
                            <td className="px-6 py-4">
                              <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                {order.subtotal} TND
                              </p>
                            </td>

                            {/* TVA */}
                            <td className="px-6 py-4">
                              <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                {order.totalVAT} TND
                              </p>
                            </td>

                            {/* Taxes */}
                            <td className="px-6 py-4">
                              <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                {order.totalTaxes} TND
                              </p>
                            </td>

                            {/* Timbre */}
                            <td className="px-6 py-4">
                              <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                {order.timbreFiscal} TND
                              </p>
                            </td>

                            {/* Total */}
                            <td className="px-6 py-4">
                              <p className="text-sm font-black text-gray-900 dark:text-white tracking-tighter whitespace-nowrap">
                                {order.netPay || "0.00"} TND
                              </p>
                            </td>

                            {/* Statut */}
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${
                                order.netPay > 0
                                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                                  : "bg-amber-50 dark:bg-amber-900/20 text-amber-600"
                              }`}>
                                {order.netPay > 0 ? "Finalisée" : "Brouillon"}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => downloadPDF(order._id)}
                                  className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 transition-colors shadow-lg shadow-indigo-100 dark:shadow-none"
                                >
                                  <Download size={12} /> PDF
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(order._id)}
                                  className="p-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 px-8 py-5 rounded-3xl border border-gray-100 dark:border-gray-800">
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Page {currentPage} sur {totalPages}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .custom-input { 
          width: 100%; 
          background: #F8FAFC; 
          border: 1px solid #E2E8F0; 
          border-radius: 1.25rem; 
          padding: 0.85rem 1.25rem; 
          font-size: 0.875rem; 
          font-weight: 500; 
          color: #0F172A; 
          transition: all 0.2s; 
          outline: none; 
        }
        .dark .custom-input {
          background: #1F2937;
          border-color: #374151;
          color: #F9FAFB;
        }
        .custom-input:focus { 
          border-color: #6366F1; 
          background: white; 
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.05); 
        }
        .dark .custom-input:focus {
          background: #111827;
          border-color: #818CF8;
        }
        .custom-input::placeholder { color: #94A3B8; font-weight: 400; }
        .dark .custom-input::placeholder { color: #6B7280; }
      `}</style>
    </div>
  );
};

const FormGroup = ({ label, children, icon, className = "" }) => (
  <div className={`space-y-3 ${className}`}>
    <div className="flex items-center gap-2 px-1">
      {icon && <span className="text-gray-400 dark:text-gray-500">{icon}</span>}
      <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.1em]">
        {label}
      </label>
    </div>
    {children}
  </div>
);

const StatCard = ({ title, value, icon, color, label }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white dark:bg-[#111827] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-start gap-6 group hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-widest">
        {title}
      </p>
      <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
        {value}
      </h3>
      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-tighter">
        {label}
      </p>
    </div>
  </motion.div>
);

export default ClientOrdersDashboard;