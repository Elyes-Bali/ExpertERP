import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  Plus,
  Menu,
  AlertCircle,
  Search,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  CreditCard,
  Building2,
  Globe,
  Coins,
  Calendar,
  User,
  MapPin,
  Hash,
  BookOpen,
  ArrowRightLeft,
  Wallet,
} from "lucide-react";

import { useCompteStore } from "../store/compteStore";
import { useTypeCompteStore } from "../store/typeCompteStore";
import { useJournalComptableStore } from "../store/journalComptableStore";
import { usePlanStore } from "../store/planComptableStore";
import CompanySidebar from "./CompanySidebar";

const CompteFinancier = () => {
  const { comptes, fetchComptes, createCompte, deleteCompte, updateCompte } =
    useCompteStore();

  const { typeComptes, fetchTypeComptes } = useTypeCompteStore();
  const { journals, fetchJournals } = useJournalComptableStore();
  const { plans, fetchPlans } = usePlanStore();
const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("general"); // Navigation within the form
 const hasCompte = !loading && comptes.length > 0;
  const canCreate = !hasCompte || editingId;

  const initialForm = {
    label: "",
    typeCompte: "",
    devise: "TND",
    country: "Tunisia",
    initialBalance: 0,
    date: "",
    minAuthorizedBalance: 0,
    desiredMinBalance: 0,
    bankName: "",
    accountNumber: "",
    iban: "",
    bic: "",
    ownerName: "",
    ownerAddress: "",
    compteComptable: "",
    journal: "",
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
     const load = async () => {
    setLoading(true);
    await fetchComptes();
    await fetchTypeComptes();
    await fetchJournals();
    await fetchPlans();
    setLoading(false);
  };

  load();
  }, []);

  const filteredPlans = plans.filter((p) => p.code.startsWith("53"));

  const filteredComptes = useMemo(() => {
    return comptes.filter((c) =>
      c.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [comptes, searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateCompte(editingId, form);
      setEditingId(null);
    } else {
      await createCompte(form);
    }
    setForm(initialForm);
    fetchComptes();
    setActiveTab("general");
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setForm({
      ...initialForm,
      ...c,
      typeCompte: c.typeCompte?._id || c.typeCompte,
      compteComptable: c.compteComptable?._id || c.compteComptable,
      journal: c.journal?._id || c.journal,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Custom Modal for confirmation since we can't use alert/confirm directly
  const [confirmDelete, setConfirmDelete] = useState(null);

  return (
<div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] dark:bg-gray-950 transition-colors duration-300 font-sans">
  <CompanySidebar
    activeItem="Comptes"
    isOpen={isSidebarOpen}
    setIsOpen={setIsSidebarOpen}
  />

  <main className="flex-1 flex flex-col min-w-0">
    {/* HEADER */}
    <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-gray-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
      <div className="flex items-center gap-5">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-all"
        >
          <Menu size={22} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Trésorerie financière
            </h1>
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase rounded-md tracking-wider">
              Actifs
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 dark:text-gray-500">
            Gestion centralisée des banques et de la trésorerie
          </p>
        </div>
      </div>

      <div className="relative hidden md:block group">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
          size={18}
        />
        <input
          placeholder="Rechercher des comptes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 outline-none w-72 transition-all font-medium dark:text-gray-200"
        />
      </div>
    </header>

    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* STAT CARDS (Subtle enhancement) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm flex items-center gap-5">
          <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total des comptes
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">
              {comptes.length}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm flex items-center gap-5">
          <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shrink-0">
            <Coins size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Solde initial
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">
              {comptes
                .reduce(
                  (acc, c) => acc + (parseFloat(c.initialBalance) || 0),
                  0,
                )
                .toLocaleString()}{" "}
              <span className="text-sm font-bold text-slate-400">TND</span>
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-sm flex items-center gap-5">
          <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Solde actuel
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">
              {comptes
                .reduce(
                  (acc, c) => acc + (parseFloat(c.currentBalance) || 0),
                  0,
                )
                .toLocaleString()}{" "}
              <span className="text-sm font-bold text-slate-400">TND</span>
            </h3>
          </div>
        </div>
      </div>

      {/* FORM SECTION */}
      {!loading && (!hasCompte || editingId) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-[32px] border border-slate-200 dark:border-gray-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-slate-100 dark:border-gray-800 flex items-center justify-between bg-slate-50/50 dark:bg-gray-800/50">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${editingId ? "bg-amber-100 text-amber-600" : "bg-indigo-600 text-white"}`}
              >
                {editingId ? <Edit3 size={18} /> : <Plus size={18} />}
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-gray-200">
                {editingId
                  ? "Modifier les détails du compte"
                  : "Enregistrer un nouvel actif financier"}
              </h2>
            </div>

            <div className="flex bg-slate-100 dark:bg-gray-700 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("general")}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === "general" ? "bg-white dark:bg-gray-600 text-indigo-600 shadow-sm" : "text-slate-500"}`}
              >
                Général
              </button>
              <button
                onClick={() => setActiveTab("bank")}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === "bank" ? "bg-white dark:bg-gray-600 text-indigo-600 shadow-sm" : "text-slate-500"}`}
              >
                Banque
              </button>
              <button
                onClick={() => setActiveTab("accounting")}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === "accounting" ? "bg-white dark:bg-gray-600 text-indigo-600 shadow-sm" : "text-slate-500"}`}
              >
                Comptabilité
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === "general" && (
                <motion.div
                  key="tab-gen"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  <InputGroup
                    label="Libellé du compte"
                    icon={<Folder size={14} />}
                  >
                    <Input
                      value={form.label}
                      placeholder="ex. Compte principal d'exploitation"
                      onChange={(e) =>
                        setForm({ ...form, label: e.target.value })
                      }
                    />
                  </InputGroup>

                  <InputGroup
                    label="Type de compte"
                    icon={<CreditCard size={14} />}
                  >
                    <Select
                      value={form.typeCompte}
                      onChange={(e) =>
                        setForm({ ...form, typeCompte: e.target.value })
                      }
                    >
                      <option value="">Sélectionner le type</option>
                      {typeComptes.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>

                  <InputGroup label="Devise" icon={<Coins size={14} />}>
                    <Select
                      value={form.devise}
                      onChange={(e) =>
                        setForm({ ...form, devise: e.target.value })
                      }
                    >
                      <option value="TND">TND - Dinar tunisien</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="USD">USD - Dollar américain</option>
                    </Select>
                  </InputGroup>

                  <InputGroup label="Localisation" icon={<Globe size={14} />}>
                    <Select
                      value={form.country}
                      onChange={(e) =>
                        setForm({ ...form, country: e.target.value })
                      }
                    >
                      <option value="Tunisia">Tunisie</option>
                      <option value="France">France</option>
                      <option value="USA">USA</option>
                    </Select>
                  </InputGroup>

                  <InputGroup
                    label="Solde initial"
                    icon={<ArrowRightLeft size={14} />}
                  >
                    <Input
                      type="number"
                      value={form.initialBalance}
                      placeholder="0.00"
                      onChange={(e) =>
                        setForm({ ...form, initialBalance: e.target.value })
                      }
                    />
                  </InputGroup>

                  <InputGroup
                    label="Date d'effet"
                    icon={<Calendar size={14} />}
                  >
                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                    />
                  </InputGroup>
                </motion.div>
              )}

              {activeTab === "bank" && (
                <motion.div
                  key="tab-bank"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  <InputGroup label="Nom de la banque" icon={<Building2 size={14} />}>
                    <Input
                      value={form.bankName}
                      placeholder="Bank of Tunisia"
                      onChange={(e) =>
                        setForm({ ...form, bankName: e.target.value })
                      }
                    />
                  </InputGroup>

                  <InputGroup label="Numéro de compte" icon={<Hash size={14} />}>
                    <Input
                      value={form.accountNumber}
                      placeholder="1234..."
                      onChange={(e) =>
                        setForm({ ...form, accountNumber: e.target.value })
                      }
                    />
                  </InputGroup>

                  <InputGroup label="IBAN" icon={<Hash size={14} />}>
                    <Input
                      value={form.iban}
                      placeholder="TN59..."
                      onChange={(e) =>
                        setForm({ ...form, iban: e.target.value })
                      }
                    />
                  </InputGroup>

                  <InputGroup label="BIC/SWIFT" icon={<Hash size={14} />}>
                    <Input
                      value={form.bic}
                      placeholder="BCTUTN..."
                      onChange={(e) =>
                        setForm({ ...form, bic: e.target.value })
                      }
                    />
                  </InputGroup>

                  <InputGroup label="Titulaire légal" icon={<User size={14} />}>
                    <Input
                      value={form.ownerName}
                      placeholder="Nom légal complet"
                      onChange={(e) =>
                        setForm({ ...form, ownerName: e.target.value })
                      }
                    />
                  </InputGroup>

                  <InputGroup label="Adresse du titulaire" icon={<MapPin size={14} />}>
                    <Input
                      value={form.ownerAddress}
                      placeholder="Adresse officielle"
                      onChange={(e) =>
                        setForm({ ...form, ownerAddress: e.target.value })
                      }
                    />
                  </InputGroup>
                </motion.div>
              )}

              {activeTab === "accounting" && (
                <motion.div
                  key="tab-acc"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  <InputGroup
                    label="Seuil : minimum autorisé"
                    icon={<AlertCircle size={14} />}
                  >
                    <Input
                      type="number"
                      value={form.minAuthorizedBalance}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          minAuthorizedBalance: e.target.value,
                        })
                      }
                    />
                  </InputGroup>

                  <InputGroup
                    label="Seuil : minimum souhaité"
                    icon={<AlertCircle size={14} />}
                  >
                    <Input
                      type="number"
                      value={form.desiredMinBalance}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          desiredMinBalance: e.target.value,
                        })
                      }
                    />
                  </InputGroup>

                  <InputGroup
                    label="Compte du grand livre"
                    icon={<BookOpen size={14} />}
                  >
                    <Select
                      value={form.compteComptable}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          compteComptable: e.target.value,
                        })
                      }
                    >
                      <option value="">Choisir compte GL</option>
                      {filteredPlans.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.code} - {p.label}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>

                  <InputGroup
                    label="Journal comptable"
                    icon={<BookOpen size={14} />}
                  >
                    <Select
                      value={form.journal}
                      onChange={(e) =>
                        setForm({ ...form, journal: e.target.value })
                      }
                    >
                      <option value="">Choisir journal</option>
                      {journals.map((j) => (
                        <option key={j._id} value={j._id}>
                          {j.code} - {j.label}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex gap-3 pt-6 border-t border-slate-100 dark:border-gray-800">
              <button
                type="submit"
                disabled={hasCompte && !editingId}
                className={`flex-1 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 active:scale-[0.98]
${
  hasCompte && !editingId
    ? "bg-gray-400 cursor-not-allowed text-white"
    : "bg-slate-900 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-500"
}
`}
              >
                {editingId ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Plus size={18} />
                )}
                {editingId ? "Confirmer les modifications" : "Créer le compte"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                    setActiveTab("general");
                  }}
                  className="px-6 bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 rounded-2xl hover:bg-slate-200 dark:hover:bg-gray-700 transition-all active:scale-95"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </form>
        </motion.div>
      )}

      {/* LIST SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Comptes disponibles
          </h2>
          <div className="h-px bg-slate-200 dark:border-gray-800 flex-1 mx-6 hidden sm:block" />
          <span className="text-xs font-bold text-slate-400">
            {filteredComptes.length} comptes actifs
          </span>
        </div>

        {filteredComptes.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-[32px] p-20 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-slate-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-slate-300">
              <Folder size={32} />
            </div>
            <h3 className="font-black text-slate-900 dark:text-white">
              Aucune trésorerie trouvée
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mt-1">
              Affinez votre recherche ou créez un nouveau compte
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence >
              {filteredComptes.map((c) => (
                <motion.div
                  key={c._id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-white dark:bg-gray-900 p-6 rounded-[28px] border border-slate-200 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-slate-50 dark:bg-gray-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 text-slate-400 group-hover:text-indigo-600 transition-all rounded-2xl flex items-center justify-center">
                        <Building2 size={22} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                          {c.label}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {c.bankName || "Compte interne"}
                          </span>
                          <span className="h-1 w-1 bg-slate-300 rounded-full" />
                          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                            {c.devise}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => startEdit(c)}
                        className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl transition-all active:scale-90 shadow-sm"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm("Supprimer définitivement ce compte ?")) {
                            await deleteCompte(c._id);
                            fetchComptes();
                          }
                        }}
                        className="p-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all active:scale-90 shadow-sm"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50/80 dark:bg-gray-800/50 p-3 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Solde disponible
                      </p>
                      <div className="flex items-end gap-1">
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                          {(parseFloat(c.currentBalance) || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 mb-1">
                          {c.devise}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50/80 dark:bg-gray-800/50 p-3 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Numéro de compte
                      </p>
                      <p className="text-xs font-bold text-slate-700 dark:text-gray-300 mt-1 truncate">
                        {c.accountNumber
                          ? `•••• ${c.accountNumber.slice(-4)}`
                          : "Non fourni"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${c.isVerified !== false ? "bg-emerald-500" : "bg-amber-500"}`}
                      />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {c.compteComptable
                          ? "Lié au grand livre"
                          : "Détaché"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Globe size={10} />
                      <span className="text-[9px] font-bold tracking-tight uppercase">
                        {c.country}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  </main>
</div>
  );
};

/* UI COMPONENTS */
const InputGroup = ({ label, icon, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-wider ml-1">
      {icon}
      {label}
    </label>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl p-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all dark:text-gray-200"
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl p-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-700 transition-all cursor-pointer dark:text-gray-200"
  >
    {children}
  </select>
);

export default CompteFinancier;
