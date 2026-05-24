import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  Edit3,
  Trash2,
  CheckCircle2,
  Search,
  Plus,
  X,
  User,
  Wrench,
  DollarSign,
  Layers,
  Calendar,
} from "lucide-react";

import { useTechnicalServiceStore } from "../store/technicalServiceStore";
import { useMachineTypeStore } from "../store/machineTypeStore";
import { useMaterialStore } from "../store/materialsStore";
import CompanySidebar from "./CompanySidebar";

const TechnicalService = () => {
  const {
    services,
    fetchServices,
    createService,
    deleteService,
    markAsPaid,
    updateService,
    downloadServicePDF,
  } = useTechnicalServiceStore();

  const { machineTypes, fetchMachineTypes } = useMachineTypeStore();
  const { materials, fetchMaterials } = useMaterialStore();

  const [editId, setEditId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const emptyForm = {
    clientName: "",
    clientNumber: "",
    machineType: "",
    serialNumber: "",
    accessories: "",
    observations: "",
    technicianName: "",
    workforcePrice: 0,
    repairStatus: "being repaired",
    depositDate: "",
    materials: [],
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchServices();
    fetchMachineTypes();
    fetchMaterials();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const addMaterial = () => {
    setForm({
      ...form,
      materials: [...form.materials, { material: "", quantityUsed: 1 }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await updateService(editId, form);
    } else {
      await createService(form);
    }

    setForm(emptyForm);
    setEditId(null);
    await fetchServices();
    await fetchMaterials();
  };

  const handleEdit = (service) => {
    setEditId(service._id);

    setForm({
      clientName: service.clientName,
      clientNumber: service.clientNumber,
      machineType: service.machineType?._id,
      serialNumber: service.serialNumber,
      accessories: service.accessories,
      observations: service.observations,
      technicianName: service.technicianName,
      workforcePrice: service.workforcePrice,
      repairStatus: service.repairStatus,
      depositDate: service.depositDate ? service.depositDate.split("T")[0] : "",
      materials:
        service.materials?.map((m) => ({
          material: m.material?._id || m.material,
          quantityUsed: m.quantityUsed,
        })) || [],
    });
  };

  const handleStatusChange = async (id, status) => {
    await updateService(id, { repairStatus: status });
    fetchServices();
  };

  const filteredServices = services.filter((s) => {
    const search = searchTerm.toLowerCase();

    return (
      s.clientName?.toLowerCase().includes(search) ||
      s.clientNumber?.toLowerCase().includes(search) ||
      s.machineType?.name?.toLowerCase().includes(search) ||
      s.serialNumber?.toLowerCase().includes(search) ||
      s.technicianName?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
 <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors antialiased">
  <CompanySidebar
    activeItem="Services techniques"
    isOpen={isSidebarOpen}
    setIsOpen={setIsSidebarOpen}
  />

  <main className="flex-1 flex flex-col min-w-0">
    {/* HEADER */}
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Services techniques
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Gérer les réparations, clients et machines
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-xl px-3.5 py-2 w-72 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
        <Search
          className="text-slate-400 dark:text-slate-500 flex-shrink-0"
          size={18}
        />
        <input
          placeholder="Rechercher des services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none w-full"
        />
      </div>
    </header>

    <div className="p-4 lg:p-8 space-y-8 max-w-6xl w-full mx-auto">
      {/* FORM CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Plus size={18} />
            </div>
            <h2 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200">
              {editId ? "Modifier l'entrée de service" : "Enregistrer un nouveau service"}
            </h2>
          </div>
          {editId && (
            <span className="text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full border border-amber-200/40 dark:border-amber-800/40">
              Mode édition
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* SECTION 1: CLIENT INFORMATION */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <User size={14} />
              <span>Profil client</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Nom du client
                </label>
                <input
                  placeholder="e.g. John Doe"
                  value={form.clientName}
                  className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  onChange={(e) =>
                    setForm({ ...form, clientName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Numéro du client
                </label>
                <input
                  type="number"
                  placeholder="e.g. +1 555-0199"
                  value={form.clientNumber}
                  className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  onChange={(e) =>
                    setForm({ ...form, clientNumber: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: MACHINE HARDWARE DETAILS */}
          <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <Wrench size={14} />
              <span>Matériel et paramètres techniques</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Type de machine
                </label>
                <select
                  value={form.machineType}
                  className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  onChange={(e) =>
                    setForm({ ...form, machineType: e.target.value })
                  }
                >
                  <option value="">Sélectionner un type</option>
                  {machineTypes.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Numéro de série
                </label>
                <input
                  placeholder="e.g. S/N-9942A"
                  value={form.serialNumber}
                  className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  onChange={(e) =>
                    setForm({ ...form, serialNumber: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Accessoires inclus
                </label>
                <input
                  placeholder="e.g. Power adapter, remote"
                  value={form.accessories}
                  className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  onChange={(e) =>
                    setForm({ ...form, accessories: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Technicien assigné
                </label>
                <input
                  placeholder="Nom du technicien"
                  value={form.technicianName}
                  className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  onChange={(e) =>
                    setForm({ ...form, technicianName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Date de dépôt
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={form.depositDate}
                    className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    onChange={(e) =>
                      setForm({ ...form, depositDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Observations et descriptions des pannes
              </label>
              <textarea
                rows={3}
                placeholder="Fournir des informations de diagnostic ou des détails visuels..."
                value={form.observations}
                className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                onChange={(e) =>
                  setForm({ ...form, observations: e.target.value })
                }
              />
            </div>
          </div>

          {/* SECTION 3: REPAIR WORK STATUS & LOGISTICS */}
          <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <DollarSign size={14} />
              <span>Finances et état d'affectation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Coût de la main-d'œuvre
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.workforcePrice}
                  className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  onChange={(e) =>
                    setForm({ ...form, workforcePrice: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Statut initial de réparation
                </label>
                <select
                  value={form.repairStatus}
                  className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  onChange={(e) =>
                    setForm({ ...form, repairStatus: e.target.value })
                  }
                >
                  <option value="being repaired">En cours de réparation</option>
                  <option value="fixed">Réparé</option>
                  <option value="unrepairable">Irréparable</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: INVENTORY / MATERIAL CONSUMPTION */}
          <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Layers size={14} />
                <span>Matériaux de rechange opérationnels alloués</span>
              </div>

              <button
                type="button"
                onClick={addMaterial}
                className="flex items-center gap-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-3 py-2 rounded-xl transition-colors shadow-sm"
              >
                <Plus size={14} />
                Ajouter une ligne de matériel
              </button>
            </div>

            {form.materials.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2">
                Aucun composant ou élément n'est encore associé à ce dossier de service.
              </p>
            ) : (
              <div className="space-y-3">
                {form.materials.map((m, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 items-end sm:items-center bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <div className="w-full sm:flex-1 space-y-1">
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        Référence du matériel
                      </span>
                      <select
                        className="w-full p-2.5 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        value={m.material}
                        onChange={(e) => {
                          const updated = [...form.materials];
                          updated[index].material = e.target.value;
                          setForm({ ...form, materials: updated });
                        }}
                      >
                        <option value="">Sélectionner un matériel</option>
                        {materials.map((mat) => (
                          <option key={mat._id} value={mat._id}>
                            {mat.name} ({mat.quantity} unités restantes)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full sm:w-32 space-y-1">
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        Quantité nécessaire
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={m.quantityUsed}
                        className="w-full p-2.5 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        onChange={(e) => {
                          const updated = [...form.materials];
                          updated[index].quantityUsed = e.target.value;
                          setForm({ ...form, materials: updated });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACTION FOOTER */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60 justify-end">
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm(emptyForm);
                }}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 px-5 py-3 rounded-xl font-medium text-sm transition-colors"
              >
                Annuler la modification
              </button>
            )}

            <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-sm shadow-indigo-500/10">
              {editId
                ? "Enregistrer les modifications"
                : "Créer une entrée de service opérationnelle"}
            </button>
          </div>
        </form>
      </motion.div>

      {/* DATA LOG TABLE LIST */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-800/10">
          <h3 className="font-bold text-slate-800 dark:text-white text-base tracking-tight">
            Historique et journaux
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase border-b border-slate-200/60 dark:border-slate-800/60">
                <th className="p-4 text-left tracking-wider">
                  Identité du client
                </th>
                <th className="p-4 text-left tracking-wider">
                  Classification du matériel
                </th>
                <th className="p-4 text-left tracking-wider">
                  Devis financier
                </th>
                <th className="p-4 text-left tracking-wider">
                  Statut de réparation
                </th>
                <th className="p-4 text-left tracking-wider">Règlement</th>
                <th className="p-4 text-right tracking-wider">
                  Actions administratives
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedServices.map((s) => (
                <tr
                  key={s._id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="p-4 font-semibold text-slate-900 dark:text-white">
                    {s.clientName}
                  </td>

                  <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                    {s.machineType?.name || (
                      <span className="text-slate-400 italic">
                        Non assigné
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-slate-700 dark:text-slate-300 font-mono font-medium">
                    {s.finalPrice} TND
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${
                        s.repairStatus === "fixed"
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/40 dark:border-emerald-800/40"
                          : s.repairStatus === "unrepairable"
                          ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200/40 dark:border-rose-800/40"
                          : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/40 dark:border-amber-800/40"
                      }`}
                    >
                      {s.repairStatus}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        s.paidStatus === "paid"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {s.paidStatus}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() =>
                          handleStatusChange(
                            s._id,
                            s.repairStatus === "fixed"
                              ? "being repaired"
                              : "fixed"
                          )
                        }
                        title="Basculer l'état de réparation"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-all"
                      >
                        <CheckCircle2 size={16} />
                      </button>

                      <button
                        onClick={() => handleEdit(s)}
                        title="Modifier l'enregistrement"
                        className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-all"
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        onClick={() => downloadServicePDF(s._id)}
                        className="p-1.5 text-slate-400 hover:text-blue-600"
                        title="Télécharger PDF"
                      >
                        PDF
                      </button>

                      <button
                        onClick={() => deleteService(s._id)}
                        title="Supprimer l'enregistrement"
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="pl-1 border-l border-slate-200 dark:border-slate-800 ml-1">
                        {s.paidStatus === "unpaid" ? (
                          <button
                            onClick={() => markAsPaid(s._id)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/80 transition-colors"
                          >
                            Payer
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-1">
                            Réglé
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Précédent
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition ${
                      currentPage === num
                        ? "bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  </main>
</div>
  );
};

export default TechnicalService;
