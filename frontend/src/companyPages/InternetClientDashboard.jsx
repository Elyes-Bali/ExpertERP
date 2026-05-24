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

// --- ORIGINAL STORE IMPORTS ---
import { useInternetClientStore } from "../store/internetClientStore";
import CompanySidebar from "./CompanySidebar";

const InternetClientDashboard = () => {
 const {
    internetClients = [],
    fetchInternetClients,
    createInternetClient,
    updateInternetClient,
    deleteInternetClient,
  } = useInternetClientStore();

  const [form, setForm] = useState({

    name: "",
    email: "",
    phone: "",
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
    fetchInternetClients();
  }, []);

  const filteredInternetClients = useMemo(() =>
    internetClients.filter(c =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [internetClients, searchQuery]
  );

  const totalPages = Math.max(1, Math.ceil(filteredInternetClients.length / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

  const currentInternetClients = filteredInternetClients.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateInternetClient(editing, form);
      setEditing(null);
    } else {
      await createInternetClient(form);
    }
    setForm({
     name: "", email: "",  phone: "", address: { country: "", region: "", addressLine: "", zipCode: "" },
    });
    fetchInternetClients();
  };

  const startEdit = (c) => {
    setEditing(c._id);
    setForm(c);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
<div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950 transition-colors duration-300">
      <CompanySidebar activeItem="Clients" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 flex flex-col min-w-0">
        {/* ENHANCED HEADER */}
        <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-5">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Relations clients</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Annuaire actif</span>
              </div>
            </div>
          </div>

          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher un contact..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-11 pr-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-medium dark:text-white focus:ring-4 focus:ring-blue-500/5 focus:bg-white dark:focus:bg-gray-800 outline-none w-72 transition-all"
            />
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
          
          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard title="Total Internet Clients" value={internetClients.length} icon={<Users size={20} className="text-blue-600 dark:text-blue-400" />} color="bg-blue-50 dark:bg-blue-900/30" label="Réseau global" />
          </div>

          {/* FORM SECTION */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/30 dark:shadow-none overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-white dark:from-gray-80₀/5₀ dark:to-gray-9₀">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900">
                  {editing ? <Edit3 size={18} /> : <Plus size={18} />}
                </div>
                <div>
                  <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">{editing ? "Modifier le compte" : "Enregistrer un nouveau client"}</h2>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">Saisissez les informations du profil et de l'adresse</p>
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

                <FormGroup label="Nom complet" icon={<User size={14} />} className="md:col-span-2">
                  <input placeholder="e.g. John Doe or Tech Solutions LLC" className="custom-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
                </FormGroup>
    
                <FormGroup label="Adresse e-mail" icon={<Mail size={14} />} className="md:col-span-2">
                  <input type="email" placeholder="contact@example.com" className="custom-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} />
                </FormGroup>

                <FormGroup label="Numéro de téléphone" icon={<Phone size={14} />} className="md:col-span-2">
                  <input type="number" placeholder="+21600000000" className="custom-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} />
                </FormGroup>

                <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <FormGroup label="Pays" icon={<Globe size={14} />}>
                    <input placeholder="Country" className="custom-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={form.address.country} onChange={(e)=>setForm({...form, address:{...form.address, country:e.target.value}})} />
                  </FormGroup>
                  <FormGroup label="Région" icon={<MapPin size={14} />}>
                    <input placeholder="State/Province" className="custom-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={form.address.region} onChange={(e)=>setForm({...form, address:{...form.address, region:e.target.value}})} />
                  </FormGroup>
                  <FormGroup label="Ligne d'adresse" icon={<Navigation size={14} />} className="md:col-span-2">
                    <input placeholder="Street address, building, etc." className="custom-input dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={form.address.addressLine} onChange={(e)=>setForm({...form, address:{...form.address, addressLine:e.target.value}})} />
                  </FormGroup>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="w-full md:w-auto bg-gray-900 dark:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-xl shadow-blue-100 dark:shadow-none flex items-center justify-center gap-3">
                   {editing ? <Edit3 size={16}/> : <Plus size={16}/>}
                   {editing ? "Mettre à jour le client" : "Créer un client"}
                </button>
              </div>
            </form>
          </motion.div>

          {/* LIST SECTION */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                Affichage de {currentInternetClients.length} sur {filteredInternetClients.length} contacts
              </h3>
            </div>

            {filteredInternetClients.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-800 py-20 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600 mb-4">
                  <Users size={32} />
                </div>
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Aucun enregistrement correspondant trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence >
                  {currentInternetClients.map((c) => (
                    <motion.div key={c._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="group bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 hover:border-blue-100 dark:hover:border-blue-900 hover:shadow-2xl hover:shadow-blue-500/5 transition-all">
                      <div className="flex items-start gap-5">
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 ${c.type === 'professional' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'}`}>
                          {c.type === 'professional' ? <Building2 size={24} /> : <User size={24} />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>

                              <h3 className="text-base font-black text-gray-900 dark:text-white uppercase truncate pr-4">{c.name}</h3>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={()=>startEdit(c)} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors"><Edit3 size={16}/></button>
                              <button onClick={async()=>{ await deleteInternetClient(c._id); fetchInternetClients(); }} className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-colors"><Trash2 size={16}/></button>
                            </div>
                          </div>

                          <div className="mt-5 grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                              <div className="w-7 h-7 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500"><Mail size={12}/></div>
                              <span className="truncate">{c.email || "Aucun e-mail enregistré"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                              <div className="w-7 h-7 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500"><Phone size={12}/></div>
                              <span>{c.phone || "Aucun téléphone enregistré"}</span>
                            </div>
                          </div>

                          <div className="mt-5 pt-5 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MapPin size={12} className="text-gray-300 dark:text-gray-600" />
                              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{c.address?.country || 'International'}</span>
                            </div>
                            <button onClick={()=>startEdit(c)} className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase flex items-center gap-1 group/btn">
                              Voir le profil <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white dark:bg-gray-900 px-8 py-5 rounded-3xl border border-gray-100 dark:border-gray-800">
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Page {currentPage} sur {totalPages}</span>
                <div className="flex gap-3">
                  <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} className={`p-2 rounded-xl border transition-all ${currentPage === 1 ? 'text-gray-200 border-gray-50 dark:border-gray-800 dark:text-gray-700' : 'text-gray-600 border-gray-100 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    <ChevronLeft size={20}/>
                  </button>
                  <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} className={`p-2 rounded-xl border transition-all ${currentPage === totalPages ? 'text-gray-200 border-gray-50 dark:border-gray-800 dark:text-gray-700' : 'text-gray-600 border-gray-100 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    <ChevronRight size={20}/>
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
          color: #f8fafc;
        }
        .custom-input:focus { border-color: #3B82F6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.05); }
        .dark .custom-input:focus { background: #0f172a; border-color: #3b82f6; }
        .custom-input::placeholder { color: #94A3B8; font-weight: 400; }
        .dark .custom-input::placeholder { color: #64748b; }
      `}</style>
    </div>
  );
};

const FormGroup = ({ label, children, icon, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    <div className="flex items-center gap-2 px-1">
      {icon && <span className="text-gray-400 dark:text-gray-500">{icon}</span>}
      <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</label>
    </div>
    {children}
  </div>
);

const StatCard = ({ title, value, icon, color, label }) => (
  <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-start gap-6 group hover:border-blue-100 dark:hover:border-blue-900 transition-colors">
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{value}</h3>
      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-tighter">{label}</p>
    </div>
  </div>
);


export default InternetClientDashboard
