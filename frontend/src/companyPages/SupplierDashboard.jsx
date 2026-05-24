import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  Menu,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  Globe,
  Navigation,
  Hash,
  ArrowRight,
  Building,
} from "lucide-react";

import { useSupplierStore } from "../store/supplierStore";
import CompanySidebar from "./CompanySidebar";

const SupplierDashboard = () => {
  const {
    suppliers = [],
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  } = useSupplierStore();

  const [form, setForm] = useState({
    type: "individual",
    name: "",
    email: "",
    civility: "Mr",
    phone: "",
    companyname: "",
    taxnumber: "",
    website: "",
    address: {
      country: "",
      region: "",
      addressLine: "",
      zipCode: "",
    },
  });

  const [editing, setEditing] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() =>
    suppliers.filter(s =>
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [suppliers, searchQuery]
  );

  const totalPages = Math.max(1, Math.ceil(filteredSuppliers.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

  const currentSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateSupplier(editing, form);
      setEditing(null);
    } else {
      await createSupplier(form);
    }
    setForm({
      type: "individual", name: "", email: "", civility: "Mr", phone: "", companyname: "", website: "", taxnumber: "",
      address: { country: "", region: "", addressLine: "", zipCode: "" },
    });
    fetchSuppliers();
  };

  const startEdit = (c) => {
    setEditing(c._id);
    setForm(c);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
  <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950 transition-colors duration-300">
      <CompanySidebar activeItem="Fournisseurs" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 flex flex-col min-w-0">
        {/* EN-TÊTE */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-5">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-gray-900 dark:text-slate-100 tracking-tight">Relations fournisseurs</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Annuaire actif</span>
              </div>
            </div>
          </div>

          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Rechercher un contact..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-11 pr-4 py-2.5 bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 dark:focus:ring-blue-500/10 focus:bg-white dark:focus:bg-slate-800 outline-none w-72 transition-all text-gray-900 dark:text-slate-100"
            />
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
          
          {/* GRILLE DE STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard title="Fournisseurs totaux" value={suppliers.length} icon={<Users size={20} className="text-blue-600 dark:text-blue-400" />} color="bg-blue-50 dark:bg-blue-900/20" label="Réseau global" />
            <StatCard title="Particuliers" value={suppliers.filter(s=>s.type==="individual").length} icon={<User size={20} className="text-indigo-600 dark:text-indigo-400" />} color="bg-indigo-50 dark:bg-indigo-900/20" label="Clients B2C" />
            <StatCard title="Professionnels" value={suppliers.filter(s=>s.type==="professional").length} icon={<Building2 size={20} className="text-amber-600 dark:text-amber-400" />} color="bg-amber-50 dark:bg-amber-900/20" label="Partenaires corporatifs" />
          </div>

          {/* SECTION FORMULAIRE */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/30 dark:shadow-none overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-white dark:from-slate-800/50 dark:to-slate-900">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gray-900 dark:bg-blue-600 flex items-center justify-center text-white">
                  {editing ? <Edit3 size={18} /> : <Plus size={18} />}
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-900 dark:text-slate-100 uppercase tracking-wider">{editing ? "Modifier le compte" : "Enregistrer un nouveau contact"}</h2>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tighter">Saisir les détails du profil et de l'adresse</p>
                </div>
              </div>
              {editing && (
                <button onClick={() => setEditing(null)} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all">
                  <X size={20} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
                <FormGroup label="Type" icon={<Users size={14} />}>
                  <select className="custom-input" value={form.type} onChange={(e)=>setForm({...form, type: e.target.value})}>
                    <option value="individual">Compte particulier</option>
                    <option value="professional">Professionnel / Entreprise</option>
                  </select>
                </FormGroup>

                <FormGroup label="Nom complet" icon={<User size={14} />} className="md:col-span-2">
                  <input placeholder="ex. John Doe ou Tech Solutions LLC" className="custom-input" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
                </FormGroup>

                <FormGroup label="Civilité" icon={<Hash size={14} />}>
                  <select className="custom-input" value={form.civility} onChange={(e)=>setForm({...form, civility: e.target.value})}>
                    <option>M.</option><option>Mme</option>
                  </select>
                </FormGroup>

                <FormGroup label="Nom de l'entreprise" icon={<Building size={14} />} className="md:col-span-2">
                  <input placeholder="ex. Tech Solutions LLC" className="custom-input" value={form.companyname} onChange={(e)=>setForm({...form, companyname: e.target.value})} />
                </FormGroup>

                <FormGroup label="Site web" icon={<Globe size={14} />} className="md:col-span-2">
                  <input type="url" placeholder="ex. https://www.techsolutions.com" className="custom-input" value={form.website} onChange={(e)=>setForm({...form, website: e.target.value})} />
                </FormGroup>

                <FormGroup label="Numéro fiscal" icon={<Hash size={14} />} className="md:col-span-2">
                  <input placeholder="ex. 123456789" className="custom-input" value={form.taxnumber} onChange={(e)=>setForm({...form, taxnumber: e.target.value})} />
                </FormGroup>

                <FormGroup label="Adresse e-mail" icon={<Mail size={14} />} className="md:col-span-2">
                  <input type="email" placeholder="contact@exemple.com" className="custom-input" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} />
                </FormGroup>

                <FormGroup label="Numéro de téléphone" icon={<Phone size={14} />} className="md:col-span-2">
                  <input type="number" placeholder="+21600000000" className="custom-input" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} />
                </FormGroup>

                <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-50/50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700">
                  <FormGroup label="Pays" icon={<Globe size={14} />}>
                    <input placeholder="Pays" className="custom-input" value={form.address.country} onChange={(e)=>setForm({...form, address:{...form.address, country:e.target.value}})} />
                  </FormGroup>
                  <FormGroup label="Région" icon={<MapPin size={14} />}>
                    <input placeholder="État/Région" className="custom-input" value={form.address.region} onChange={(e)=>setForm({...form, address:{...form.address, region:e.target.value}})} />
                  </FormGroup>
                  <FormGroup label="Adresse" icon={<Navigation size={14} />} className="md:col-span-2">
                    <input placeholder="Rue, bâtiment, etc." className="custom-input" value={form.address.addressLine} onChange={(e)=>setForm({...form, address:{...form.address, addressLine:e.target.value}})} />
                  </FormGroup>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="w-full md:w-auto bg-gray-900 dark:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-100 dark:shadow-none flex items-center justify-center gap-3">
                   {editing ? <Edit3 size={16}/> : <Plus size={16}/>}
                   {editing ? "Mettre à jour le membre" : "Créer le membre"}
                </button>
              </div>
            </form>
          </motion.div>

          {/* SECTION LISTE */}
       <div className="space-y-6">
  <div className="flex items-center justify-between px-2">
    <h3 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
      <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
      Affichage de {currentSuppliers.length} sur {filteredSuppliers.length} contacts
    </h3>
  </div>

  {filteredSuppliers.length === 0 ? (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-gray-200 dark:border-slate-800 py-20 flex flex-col items-center">
      <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-300 dark:text-slate-600 mb-4">
        <Users size={32} />
      </div>
      <p className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
        Aucun enregistrement correspondant trouvé
      </p>
    </div>
  ) : (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 overflow-hidden">

      <div className="overflow-x-auto">
        <table className="w-full text-left">

          {/* HEADER */}
          <thead className="bg-gray-50 dark:bg-slate-800/50">
            <tr className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">
              <th className="px-6 py-4">Fournisseur</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Téléphone</th>
              <th className="px-6 py-4">Pays</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            <AnimatePresence>
              {currentSuppliers.map((s) => (
                <motion.tr
                  key={s._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors group"
                >

                  {/* SUPPLIER */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          s.type === "professional"
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                            : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        }`}
                      >
                        {s.type === "professional" ? (
                          <Building2 size={18} />
                        ) : (
                          <User size={18} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase">
                          {s.civility || "Client"}
                        </p>
                        <p className="text-sm font-black text-gray-900 dark:text-slate-100 uppercase truncate">
                          {s.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4 text-xs text-gray-500 dark:text-slate-400 truncate max-w-[180px]">
                    {s.email || "Aucun e-mail enregistré"}
                  </td>

                  {/* PHONE */}
                  <td className="px-6 py-4 text-xs text-gray-500 dark:text-slate-400">
                    {s.phone || "Aucun téléphone enregistré"}
                  </td>

                  {/* COUNTRY */}
                  <td className="px-6 py-4 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">
                    {s.address?.country || "International"}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                      <button
                        onClick={() => startEdit(s)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        onClick={async () => {
                          await deleteSupplier(s._id);
                          fetchSuppliers();
                        }}
                        className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
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
    <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-8 py-5 rounded-3xl border border-gray-100 dark:border-slate-800">
      <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">
        Page {currentPage} sur {totalPages}
      </span>

      <div className="flex gap-3">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className={`p-2 rounded-xl border transition-all ${
            currentPage === 1
              ? "text-gray-200 dark:text-slate-800 border-gray-50 dark:border-slate-800"
              : "text-gray-600 dark:text-slate-400 border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() =>
            setCurrentPage((p) => Math.min(totalPages, p + 1))
          }
          className={`p-2 rounded-xl border transition-all ${
            currentPage === totalPages
              ? "text-gray-200 dark:text-slate-800 border-gray-50 dark:border-slate-800"
              : "text-gray-600 dark:text-slate-400 border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
          }`}
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
          border-color: #3B82F6; 
          background: white; 
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.05); 
        }
        .dark .custom-input:focus {
          background: #1e293b;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
        }
        .custom-input::placeholder { color: #94A3B8; font-weight: 400; }
      `}</style>
    </div>
  );
};

const FormGroup = ({ label, children, icon, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    <div className="flex items-center gap-2 px-1">
      {icon && <span className="text-gray-400 dark:text-slate-500">{icon}</span>}
      <label className="text-[10px] font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest">{label}</label>
    </div>
    {children}
  </div>
);

const StatCard = ({ title, value, icon, color, label }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm flex items-start gap-6 group hover:border-blue-100 dark:hover:border-blue-900 transition-colors">
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 mb-1 uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tighter">{value}</h3>
      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 mt-1 uppercase tracking-tighter">{label}</p>
    </div>
  </div>
);

export default SupplierDashboard;