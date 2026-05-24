import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Menu,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  MapPin,
  DollarSign,
  Briefcase,
  Calendar,
  Wallet,
  Building,
  CreditCard,
  History,
  ArrowRight,
  Heart,
  Trash2,
  Edit3,
} from "lucide-react";

import { useWorkerStore } from "../store/workerStore";
import { useCompteStore } from "../store/compteStore";
import CompanySidebar from "./CompanySidebar";

const WorkersPage = () => {
  const {
    workers = [],
    fetchWorkers,
    createWorker,
    paySalary,
    payments = [],
    fetchPayments,
    updateWorker,
    deleteWorker,
  } = useWorkerStore();

  const { comptes, fetchComptes } = useCompteStore();

  // State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;
  const [editingWorker, setEditingWorker] = useState(null);
  const currentDate = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 7 },
    (_, i) => currentDate.getFullYear() - 3 + i,
  );

  const [form, setForm] = useState({
    fullName: "",
    salary: 0,
    phone: "",
    address: "",
    maritalStatus: "single",
    bankAccountNumber: "",
    iban: "",
    bic: "",
    bankName: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    workerId: "",
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    compteId: "",
  });

  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    fetchWorkers();
    fetchPayments();
    fetchComptes();
  }, []);

  const filteredWorkers = useMemo(
    () =>
      workers.filter((w) =>
        w.fullName?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [workers, searchQuery],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredWorkers.length / rowsPerPage),
  );
  const currentWorkers = filteredWorkers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handleCreateWorker = (e) => {
    e.preventDefault();
    createWorker(form);
    setForm({
      fullName: "",
      salary: 0,
      phone: "",
      address: "",
      maritalStatus: "single",
      bankAccountNumber: "",
      iban: "",
      bic: "",
      bankName: "",
    });
  };

  const handlePaySalary = (e) => {
    e.preventDefault();
    paySalary(paymentForm);
    setPaymentForm({
      workerId: "",
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      compteId: "",
    });
    setSelectedWorker(null);
  };

  const selectWorkerForPayment = (w) => {
    setSelectedWorker(w);
    setPaymentForm({ ...paymentForm, workerId: w._id });
    const paymentSection = document.getElementById("payment-section");
    paymentSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUpdateWorker = (e) => {
    e.preventDefault();

    updateWorker(editingWorker._id, form);

    setEditingWorker(null);
    setForm({
      fullName: "",
      salary: 0,
      phone: "",
      address: "",
      maritalStatus: "single",
      bankAccountNumber: "",
      iban: "",
      bic: "",
      bankName: "",
    });
  };

  return (
  <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950 transition-colors duration-300">
  <CompanySidebar
    activeItem="Travailleurs"
    isOpen={isSidebarOpen}
    setIsOpen={setIsSidebarOpen}
  />

  <main className="flex-1 flex flex-col min-w-0">
    {/* HEADER */}
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
      <div className="flex items-center gap-5">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col">
          <h1 className="text-xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
            Ressources humaines
          </h1>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
              Gestion des travailleurs
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
          placeholder="Rechercher des employés..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-11 pr-4 py-2.5 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/5 outline-none w-72 transition-all text-gray-900 dark:text-slate-100"
        />
      </div>
    </header>

    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Personnel total"
          value={workers.length}
          icon={
            <Users size={20} className="text-emerald-600 dark:text-emerald-400" />
          }
          color="bg-emerald-50 dark:bg-emerald-900/20"
          label="Effectif actif"
        />

        <StatCard
          title="Masse salariale mensuelle"
          value={`${workers.reduce((acc, w) => acc + Number(w.salary), 0)} TND`}
          icon={
            <DollarSign size={20} className="text-blue-600 dark:text-blue-400" />
          }
          color="bg-blue-50 dark:bg-blue-900/20"
          label="Dépenses prévisionnelles"
        />

        <StatCard
          title="Paiements effectués"
          value={payments.length}
          icon={
            <History size={20} className="text-purple-600 dark:text-purple-400" />
          }
          color="bg-purple-50 dark:bg-purple-900/20"
          label="Historique des transactions"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* ADD WORKER FORM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/30 dark:shadow-none overflow-hidden h-fit"
        >
          <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 bg-gradient-to-r from-gray-50/50 to-white dark:from-slate-800/50 dark:to-slate-900 flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gray-900 dark:bg-emerald-600 flex items-center justify-center text-white">
              <Plus size={18} />
            </div>

            <div>
              <h2 className="text-sm font-black text-gray-900 dark:text-slate-100 uppercase tracking-wider">
                Intégrer un employé
              </h2>

              <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tighter">
                Informations personnelles et bancaires
              </p>
            </div>
          </div>

          <form
            onSubmit={editingWorker ? handleUpdateWorker : handleCreateWorker}
            className="p-8 space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup label="Nom complet" icon={<User size={14} />}>
                <input
                  placeholder="Entrer le nom complet"
                  className="custom-input"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup label="Salaire (TND)" icon={<DollarSign size={14} />}>
                <input
                  type="number"
                  placeholder="0.00"
                  className="custom-input"
                  value={form.salary}
                  onChange={(e) =>
                    setForm({ ...form, salary: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup label="Numéro de téléphone" icon={<Phone size={14} />}>
                <input
                  placeholder="+216 -- --- ---"
                  className="custom-input"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup label="État civil" icon={<Heart size={14} />}>
                <select
                  className="custom-input"
                  value={form.maritalStatus}
                  onChange={(e) =>
                    setForm({ ...form, maritalStatus: e.target.value })
                  }
                >
                  <option value="single">Célibataire</option>
                  <option value="married">Marié(e)</option>
                  <option value="divorced">Divorcé(e)</option>
                  <option value="widowed">Veuf/Veuve</option>
                </select>
              </FormGroup>

              <FormGroup
                label="Adresse"
                icon={<MapPin size={14} />}
                className="md:col-span-2"
              >
                <input
                  placeholder="Adresse de résidence"
                  className="custom-input"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </FormGroup>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50/50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700">
                <FormGroup label="Nom de la banque" icon={<Building size={14} />}>
                  <input
                    placeholder="e.g. BIAT, UIB"
                    className="custom-input"
                    value={form.bankName}
                    onChange={(e) =>
                      setForm({ ...form, bankName: e.target.value })
                    }
                  />
                </FormGroup>

                <FormGroup label="Numéro de compte" icon={<Hash size={14} />}>
                  <input
                    placeholder="RIB / Numéro de compte"
                    className="custom-input"
                    value={form.bankAccountNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        bankAccountNumber: e.target.value,
                      })
                    }
                  />
                </FormGroup>

                <FormGroup label="IBAN" icon={<CreditCard size={14} />}>
                  <input
                    placeholder="TN59..."
                    className="custom-input"
                    value={form.iban}
                    onChange={(e) =>
                      setForm({ ...form, iban: e.target.value })
                    }
                  />
                </FormGroup>

                <FormGroup label="BIC / SWIFT" icon={<Globe size={14} />}>
                  <input
                    placeholder="Code bancaire"
                    className="custom-input"
                    value={form.bic}
                    onChange={(e) =>
                      setForm({ ...form, bic: e.target.value })
                    }
                  />
                </FormGroup>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="w-full md:w-auto bg-gray-900 dark:bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 dark:shadow-none flex items-center justify-center gap-3"
              >
                <Plus size={16} /> {editingWorker ? "Mettre à jour" : "Enregistrer"} Employé
              </button>
            </div>
          </form>
        </motion.div>
  {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
            {/* PAY SALARY SECTION */}
            <motion.div
              id="payment-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/30 dark:shadow-none overflow-hidden h-fit"
            >
              <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-900/10 dark:to-slate-900 flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                  <DollarSign size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-900 dark:text-slate-100 uppercase tracking-wider">
                    Paie
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tighter">
                    Traitement du paiement des salaires
                  </p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {selectedWorker ? (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase mb-1">
                      En cours pour
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-slate-100">
                      {selectedWorker.fullName}
                    </p>
                    <p className="text-xs font-medium text-gray-500 dark:text-slate-400">
                      {selectedWorker.salary} TND
                    </p>
                  </div>
                ) : (
                  <div className="p-6 border border-dashed border-gray-200 dark:border-slate-700 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Sélectionnez un employé dans la liste
                    </p>
                  </div>
                )}

                <FormGroup label="Mois cible" icon={<Calendar size={14} />}>
                  <select
                    className="custom-input"
                    value={paymentForm.month}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, month: e.target.value })
                    }
                  >
                    {months.map((m, index) => (
                      <option key={m} value={index + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </FormGroup>

                <FormGroup label="Année" icon={<Calendar size={14} />}>
                  <select
                    className="custom-input"
                    value={paymentForm.year}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, year: e.target.value })
                    }
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </FormGroup>

                <FormGroup label="Depuis le compte" icon={<Wallet size={14} />}>
                  <select
                    className="custom-input"
                    value={paymentForm.compteId}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        compteId: e.target.value,
                      })
                    }
                  >
                    <option value="">Sélectionner la source de financement</option>
                    {comptes?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.nomCompte} ({c.currentBalance} TND)
                      </option>
                    ))}
                  </select>
                </FormGroup>

                <button
                  disabled={!paymentForm.workerId || !paymentForm.compteId}
                  onClick={handlePaySalary}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-30 disabled:grayscale"
                >
                  Exécuter le paiement
                </button>
              </div>
            </motion.div>
          </div>

          {/* WORKERS LIST */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                Annuaire du personnel ({filteredWorkers.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {currentWorkers.map((w) => (
                  <motion.div
                    key={w._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 hover:border-emerald-100 dark:hover:border-emerald-900/50 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all"
                  >
                    {/* 🔥 ACTIONS TOP RIGHT */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* EDIT */}
                      <button
                        onClick={() => {
                          setEditingWorker(w);
                          setForm({
                            fullName: w.fullName,
                            salary: w.salary,
                            phone: w.phone,
                            address: w.address,
                            maritalStatus: w.maritalStatus,
                            bankAccountNumber: w.bankAccountNumber,
                            iban: w.iban,
                            bic: w.bic,
                            bankName: w.bankName,
                          });

                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl hover:scale-105 transition-all"
                      >
                        <Edit3 size={14} />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Êtes-vous sûr de vouloir supprimer cet employé ?",
                            )
                          ) {
                            deleteWorker(w._id);
                          }
                        }}
                        className="p-2 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-xl hover:scale-105 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* CONTENT */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Briefcase size={20} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black text-gray-900 dark:text-slate-100 uppercase truncate">
                          {w.fullName}
                        </h3>

                        <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">
                          {w.salary}{" "}
                          <span className="text-[10px] text-gray-400">TND</span>
                        </p>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase">
                            <Phone size={10} /> {w.phone || "Pas de téléphone"}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase">
                            <MapPin size={10} /> {w.address || "Pas d'adresse"}
                          </div>
                        </div>

                        <button
                          onClick={() => selectWorkerForPayment(w)}
                          className="mt-6 w-full py-3 bg-gray-900 dark:bg-indigo-600 text-white px-8 group-hover:bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                          Traiter la paie <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-8 py-5 rounded-3xl border border-gray-100 dark:border-slate-800">
                <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                  Page {currentPage} sur {totalPages}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={`p-2 rounded-xl border transition-all ${currentPage === 1 ? "opacity-20" : "hover:bg-gray-50 dark:hover:bg-slate-800"}`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className={`p-2 rounded-xl border transition-all ${currentPage === totalPages ? "opacity-20" : "hover:bg-gray-50 dark:hover:bg-slate-800"}`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PAYMENT HISTORY TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 flex items-center gap-4">
              <History size={18} className="text-purple-500" />
              <h2 className="text-sm font-black text-gray-900 dark:text-slate-100 uppercase tracking-wider">
                Historique des transactions
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 dark:bg-slate-800/50 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Employé</th>
                    <th className="px-8 py-4">Montant</th>
                    <th className="px-8 py-4">Statut</th>
                    <th className="px-8 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                  {payments.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-8 py-4 text-xs font-bold text-gray-900 dark:text-slate-100">
                        {p.worker?.fullName}
                      </td>
                      <td className="px-8 py-4 text-xs font-black text-blue-600">
                        {p.salaryAmount} TND
                      </td>
                      <td className="px-8 py-4">
                        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded-full">
                          {p.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-xs font-bold text-gray-900 dark:text-slate-100">
                        {p.month}/{p.year}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-input { 
          width: 100%; 
          background: #F8FAFC; 
          border: 1px solid #E2E8F0; 
          border-radius: 1rem; 
          padding: 0.85rem 1rem; 
          font-size: 0.875rem; 
          font-weight: 500; 
          color: #0F172A; 
          transition: all 0.2s; 
          outline: none; 
        }
        .dark .custom-input {
          background: #1e293b;
          border-color: #334155;
          color: #f1f5f9;
        }
        .custom-input:focus { 
          border-color: #10b981; 
          background: white; 
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.05); 
        }
        .dark .custom-input:focus {
          background: #1e293b;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
        }
      `}</style>
    </div>
  );
};

const FormGroup = ({ label, children, icon, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    <div className="flex items-center gap-2 px-1">
      {icon && (
        <span className="text-gray-400 dark:text-slate-500">{icon}</span>
      )}
      <label className="text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest">
        {label}
      </label>
    </div>
    {children}
  </div>
);

const StatCard = ({ title, value, icon, color, label }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm flex items-start gap-6 group hover:border-emerald-100 dark:hover:border-emerald-900 transition-colors">
    <div
      className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}
    >
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 mb-1 uppercase tracking-widest">
        {title}
      </p>
      <h3 className="text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tighter">
        {value}
      </h3>
      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 mt-1 uppercase tracking-tighter">
        {label}
      </p>
    </div>
  </div>
);

const Hash = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" y1="9" x2="20" y2="9"></line>
    <line x1="4" y1="15" x2="20" y2="15"></line>
    <line x1="10" y1="3" x2="8" y2="21"></line>
    <line x1="16" y1="3" x2="14" y2="21"></line>
  </svg>
);

const Globe = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

export default WorkersPage;
