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
  Package,
  Info,
  DollarSign,
  Warehouse,
  Tag,
  Layers,
  Box,
  Percent,
  Activity,
  ArrowRight,
  ArrowUpDown,
  ArrowLeftRight,
  Weight,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useProductStore } from "../store/productStore";
import { useTaxStore } from "../store/taxStore";
import { useCatalogStore } from "../store/catalogStore";
import { useWarehouseStore } from "../store/warehouseStore";
import CompanySidebar from "./CompanySidebar";

const ProductDashboard = () => {
  const navigate = useNavigate();
  const {
    products,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProduct,
    importProducts,
  } = useProductStore();
  const { taxes, vat, fetchTaxes, fetchVAT } = useTaxStore();
  const {
    categories,
    brands,
    units,
    fetchCategories,
    fetchBrands,
    fetchUnits,
  } = useCatalogStore();
  const { warehouses, fetchWarehouses } = useWarehouseStore();

  const [form, setForm] = useState({
    name: "",
    type: "material",
    sellingPrice: "",
    includeTax: false,
    tax: "",
    vat: "",
    stock: 0,
    inStock: true,
    warehouse: "",
    category: "",
    brand: "",
    unit: "",
    description: "",
    height: 0,
    width: 0,
    weight: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 6;

  useEffect(() => {
    fetchProducts();
    fetchTaxes();
    fetchVAT();
    fetchCategories();
    fetchBrands();
    fetchUnits();
    fetchWarehouses();
  }, []);

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [products, searchQuery],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / rowsPerPage),
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;

    const payload = {
      name: form.name,
      type: form.type,
      price: Number(form.sellingPrice),
      includeTaxes: form.includeTax,
      taxes: form.tax ? [form.tax] : [],
      vat: form.vat || null,
      stock: Number(form.stock),
      inStock: Number(form.stock) > 0,
      warehouse: form.warehouse,
      category: form.category,
      brand: form.brand,
      unit: form.unit,
      description: form.description,
      height: Number(form.height),
      width: Number(form.width),
      weight: Number(form.weight),
    };

    if (editingId) {
      await updateProduct(editingId, payload);
      setEditingId(null);
    } else {
      await createProduct(payload);
    }

    setForm({
      name: "",
      type: "material",
      sellingPrice: "",
      includeTax: false,
      tax: "",
      vat: "",
      stock: 0,
      inStock: true,
      warehouse: "",
      category: "",
      brand: "",
      unit: "",
      description: "",
      height: 0,
      width: 0,
      weight: 0,
    });

    fetchProducts();
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      type: product.type,
      sellingPrice: product.price,
      includeTax: product.includeTaxes,
      tax: product.taxes?.[0] || "",
      vat: product.vat || "",
      stock: product.stock,
      inStock: product.inStock,
      warehouse: product.warehouse,
      category: product.category,
      brand: product.brand,
      unit: product.unit,
      description: product.description,
      height: product.height,
      width: product.width,
      weight: product.weight,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const calculateFinalPrice = (product) => {
    let finalPrice = product.price || 0;

    if (product.includeTaxes) {
      // Apply taxes on base price
      if (product.taxes && product.taxes.length > 0) {
        product.taxes.forEach((taxId) => {
          const taxObj = taxes.find((t) => t._id === taxId);
          if (taxObj) finalPrice += (product.price * taxObj.rate) / 100;
        });
      }

      // Apply VAT
      if (product.vat) {
        const vatObj = Array.isArray(vat)
          ? vat.find((v) => v._id === product.vat)
          : vat; // fallback if single object
        if (vatObj) finalPrice += (product.price * vatObj.value) / 100;
      }
    }

    return finalPrice.toFixed(2);
  };

  return (
   <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950 transition-colors duration-300">
      <CompanySidebar
        activeItem="Produits"
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      /><main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                Inventaire principal
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Système de catalogue en temps réel
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* 📘 Guide Button */}
            <button
              onClick={() => navigate("/Products-Guide")}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              <BookOpen size={16} />
              Guide
            </button>

            {/* 🔍 Search */}
            <div className="relative hidden md:block">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-11 pr-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-medium dark:text-white focus:ring-4 focus:ring-indigo-500/5 focus:bg-white dark:focus:bg-gray-800 outline-none w-64 transition-all"
              />
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <StatCard
              title="Total des produits"
              value={products.length}
              icon={<Package className="text-indigo-600" size={20} />}
              color="bg-indigo-50 dark:bg-indigo-900/20"
              trend="Actifs gérés"
            />
            <StatCard
              title="Stock disponible"
              value={products.filter((p) => p.inStock).length}
              icon={<CheckCircle2 className="text-emerald-600" size={20} />}
              color="bg-emerald-50 dark:bg-emerald-900/20"
              trend="Prêt pour expédition"
            />
            <StatCard
              title="Alertes d'inventaire"
              value={products.filter((p) => !p.inStock).length}
              icon={<Activity className="text-rose-600" size={20} />}
              color="bg-amber-50 dark:bg-amber-900/20"
              trend="Stock nul"
            />
            <div className="flex gap-4">
              <input
                type="file"
                accept=".xlsx"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  try {
                    await importProducts(file);
                    fetchProducts();
                    alert("Produits importés avec succès 🚀");
                  } catch (err) {
                    alert("Échec de l'importation, aucun produit valide trouvé dans le fichier ❌");
                  }
                }}
                className="hidden"
                id="excelUpload"
              />

              <label
                htmlFor="excelUpload"
                className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
              >
                Importer Excel
              </label>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/20 dark:shadow-none overflow-hidden transition-colors duration-300"
          >
            {/* Header Section */}
            <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                  {editingId ? <Edit3 size={20} /> : <Plus size={20} />}
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                    {editingId
                      ? "Modifier le produit existant"
                      : "Créer un nouvel actif principal"}
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tighter">
                    Entrez les spécifications du produit ci-dessous
                  </p>
                </div>
              </div>

              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setForm({
                      name: "",
                      type: "material",
                      sellingPrice: "",
                      includeTax: false,
                      tax: "",
                      vat: "",
                      stock: 0,
                      inStock: true,
                      warehouse: "",
                      category: "",
                      brand: "",
                      unit: "",
                      description: "",
                    });
                  }}
                  className="px-4 py-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
                >
                  Annuler la modification
                </button>
              )}
            </div>

            <div className="p-8 lg:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 min-w-0">
                  {/* Basic Info Group */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Nom du produit" icon={<Info size={16} />}>
                      <input
                        placeholder="ex. Vanne industrielle premium"
                        className="custom-input dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </FormInput>

                    <FormInput label="Type d'actif" icon={<Layers size={16} />}>
                      <select
                        className="custom-input appearance-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        value={form.type}
                        onChange={(e) =>
                          setForm({ ...form, type: e.target.value })
                        }
                      >
                        <option value="material">Matière première</option>
                        <option value="composite">Composite / Assemblage</option>
                        <option value="service">Service</option>
                      </select>
                    </FormInput>
                  </div>

                  {/* Price & Tax Group */}
                  <div className="bg-gray-50/50 dark:bg-slate-800/40 p-6 rounded-3xl border border-gray-100 dark:border-slate-700/50 grid grid-cols-1 gap-4">
                    <FormInput
                      label="Prix de vente de base"
                      icon={<DollarSign size={16} />}
                    >
                      <input
                        type="number"
                        placeholder="0.00"
                        className="custom-input dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                        value={form.sellingPrice}
                        onChange={(e) =>
                          setForm({ ...form, sellingPrice: e.target.value })
                        }
                      />
                    </FormInput>

                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <Percent
                          size={14}
                          className="text-indigo-500 dark:text-indigo-400"
                        />
                        <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase">
                          Taxe incluse
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={form.includeTax}
                          onChange={(e) =>
                            setForm({ ...form, includeTax: e.target.checked })
                          }
                        />
                        <div className="w-10 h-5 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-slate-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* Secondary Inputs */}
                  <FormInput label="TVA" icon={<Percent size={16} />}>
                    <select
                      className="custom-input appearance-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={form.vat}
                      onChange={(e) =>
                        setForm({ ...form, vat: e.target.value })
                      }
                    >
                      <option value="">TVA</option>
                      {vat && <option value={vat._id}>{vat.value}%</option>}
                    </select>
                  </FormInput>

                  <FormInput label="Taxe" icon={<Percent size={16} />}>
                    <select
                      className="custom-input appearance-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={form.tax}
                      onChange={(e) =>
                        setForm({ ...form, tax: e.target.value })
                      }
                    >
                      <option value="">Aucune taxe</option>
                      {taxes
                        .filter((t) => t.name.toLowerCase() !== "timbre fiscal")
                        .map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name}
                          </option>
                        ))}
                    </select>
                  </FormInput>

                  <FormInput
                    label="Emplacement de l'entrepôt"
                    icon={<Warehouse size={16} />}
                  >
                    <select
                      className="custom-input appearance-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={form.warehouse}
                      onChange={(e) =>
                        setForm({ ...form, warehouse: e.target.value })
                      }
                    >
                      <option value="">Inventaire global</option>
                      {warehouses.map((w) => (
                        <option key={w._id} value={w._id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </FormInput>

                  <FormInput label="Catégorie" icon={<Box size={16} />}>
                    <select
                      className="custom-input appearance-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    >
                      <option value="">Non catégorisé</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </FormInput>

                  <FormInput label="Marque" icon={<Tag size={16} />}>
                    <select
                      className="custom-input appearance-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={form.brand}
                      onChange={(e) =>
                        setForm({ ...form, brand: e.target.value })
                      }
                    >
                      <option value="">OEM / Générique</option>
                      {brands.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </FormInput>

                  <FormInput
                    label="Stock actuel"
                    icon={<Activity size={16} />}
                  >
                    <input
                      type="number"
                      placeholder="Quantité"
                      className="custom-input dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={form.stock}
                      onChange={(e) =>
                        setForm({ ...form, stock: e.target.value })
                      }
                    />
                  </FormInput>

                  <FormInput
                    label="Unité de mesure"
                    icon={<Layers size={16} />}
                  >
                    <select
                      className="custom-input appearance-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={form.unit}
                      onChange={(e) =>
                        setForm({ ...form, unit: e.target.value })
                      }
                    >
                      <option value="">N/A</option>
                      {units.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </FormInput>

                  {/* Dimension Group */}
                  <FormInput
                    label="Hauteur (cm)"
                    icon={<ArrowUpDown size={16} />}
                  >
                    <input
                      type="number"
                      className="custom-input dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={form.height}
                      onChange={(e) =>
                        setForm({ ...form, height: e.target.value })
                      }
                    />
                  </FormInput>

                  <FormInput
                    label="Largeur (cm)"
                    icon={<ArrowLeftRight size={16} />}
                  >
                    <input
                      type="number"
                      className="custom-input dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={form.width}
                      onChange={(e) =>
                        setForm({ ...form, width: e.target.value })
                      }
                    />
                  </FormInput>

                  <FormInput label="Poids (kg)" icon={<Weight size={16} />}>
                    <input
                      type="number"
                      className="custom-input dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={form.weight}
                      onChange={(e) =>
                        setForm({ ...form, weight: e.target.value })
                      }
                    />
                  </FormInput>

                  <FormInput
                    label="Description détaillée"
                    icon={<Briefcase size={16} />}
                    className="md:col-span-3"
                  >
                    <textarea
                      placeholder="Entrez les spécifications techniques..."
                      className="custom-input min-h-[100px] resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </FormInput>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="w-full md:w-auto bg-slate-900 dark:bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-100/50 dark:shadow-none flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {editingId ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <Plus size={18} />
                    )}
                    {editingId ? "Valider les modifications" : "Enregistrer le produit"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
  {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          {/* Section liste des produits */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  Catalogue de produits actifs
                </h3>
              </div>
              <span className="text-[10px] font-black text-indigo-600 dark:text-gray-500 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100 uppercase tracking-widest">
                {filteredProducts.length} ENREGISTREMENTS TROUVÉS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {currentProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full flex flex-col items-center justify-center py-32 dark:bg-gray-900 bg-white rounded-[2.5rem] border-2 border-dashed dark:border-gray-800 border-gray-100"
                  >
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                      <AlertCircle size={32} className="text-gray-900" />
                    </div>
                    <p className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                      Aucune entrée ne correspond à votre recherche
                    </p>
                  </motion.div>
                ) : (
                  currentProducts.map((p) => (
                    <motion.div
                      layout
                      key={p._id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className={`group relative p-6 rounded-[2rem] border transition-all duration-300 ${
                        p.inStock
                          ? "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-indigo-100 dark:hover:border-indigo-900 hover:shadow-2xl hover:shadow-indigo-500/5"
                          : "bg-gray-50/50 border-transparent opacity-80"
                      }`}
                    >
                      <div className="flex items-start gap-5">
                        <div
                          className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                            p.inStock
                              ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          <Package size={24} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase truncate max-w-[150px]">
                              {p.name}
                            </h4>
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 bg-gray-50 px-2 py-1 rounded-lg uppercase tracking-tighter">
                              #{p._id?.slice(-4) || "SKU"}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            <div
                              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                p.inStock
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                  : "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                              }`}
                            >
                              {p.inStock ? `Stock : ${p.stock}` : "Alerte de stock"}
                            </div>

                            <div className="px-3 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-100 text-[9px] font-black uppercase tracking-widest dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
                              {p.type}
                            </div>
                          </div>

                          <div className="mt-5 pt-5 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                                Prix du marché
                              </span>
                              <span className="font-bold text-gray-800 dark:text-gray-200">
                                {p.price} TND
                              </span>
                              <span className="text-[10px] font-bold text-indigo-600 mt-0.5">
                                Après TVA : {calculateFinalPrice(p)} TND
                              </span>
                              <span className="text-[10px] font-bold text-indigo-600 mt-0.5">
                                Après taxes et TVA : {p.priceWithTax} TND
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                              <button
                                onClick={() => startEdit(p)}
                                className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                title="Modification rapide"
                              >
                                <Edit3 size={18} />
                              </button>
                              <button
                                onClick={async () => {
                                  if (
                                    confirm(
                                      "Supprimer définitivement cet article du catalogue ?",
                                    )
                                  ) {
                                    await deleteProduct(p._id);
                                    fetchProducts();
                                  }
                                }}
                                className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 pt-10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-900 dark:text-zinc-100 uppercase tracking-widest">
                    Page
                  </span>
                  <div className="px-3 py-1 bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-[10px] font-black">
                    {currentPage}
                  </div>
                  <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                    sur {totalPages}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 text-gray-400 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 transition-all hover:shadow-xl hover:shadow-indigo-500/10"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 text-gray-400 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 transition-all hover:shadow-xl hover:shadow-indigo-500/10"
                  >
                    <ChevronRight size={20} />
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
        :is(.dark .custom-input) {
          background: #1e293b;
          border-color: #334155;
          color: #f1f5f9;
        }
        .custom-input:focus { 
          border-color: #6366F1; 
          background: white; 
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.05); 
        }
        :is(.dark .custom-input:focus) {
          background: #0f172a;
          border-color: #818cf8;
        }
        .custom-input::placeholder { color: #94A3B8; font-weight: 400; }
      `}</style>
    </div>
  );
};

const FormInput = ({ label, children, icon, className = "" }) => (
  <div className={`space-y-2.5 ${className}`}>
    <div className="flex items-center gap-2 px-1">
      {icon && (
        <span className="text-indigo-500 dark:text-indigo-400 transition-colors duration-300">
          {icon}
        </span>
      )}
      <label className="text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest transition-colors duration-300">
        {label}
      </label>
    </div>
    <div className="relative group">
      {/* Note: This wrapper ensures that whatever input/select is passed 
          as 'children' benefits from the dark mode logic if you apply 
          the classes to them as well.
      */}
      {children}
    </div>
  </div>
);

const StatCard = ({ title, value, icon, color, label }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-start gap-6 group hover:border-indigo-100 dark:hover:border-indigo-900 transition-all"
  >
    <div
      className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0`}
    >
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest">
        {title}
      </p>
      <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
        {value}
      </h3>
      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
        {label}
      </p>
    </div>
  </motion.div>
);

export default ProductDashboard;
