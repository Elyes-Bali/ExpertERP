import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Mail,
  Phone,
  Edit,
  DollarSign,
  Calendar,
  Zap,
  ChevronLeft,
  ChevronRight,
  Upload,
  User,
  ShieldCheck,
  CreditCard,
  X,
  Camera
} from "lucide-react";

import { useAuthStore } from "../store/authStore";
import CompanySidebar from "../companyPages/CompanySidebar";
import SideBarAdmin from "../Admin/SideBarAdmin";

/* ================= STAT CARD ================= */
const StatCard = ({ title, value, icon, colorClass = "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm flex gap-4 items-center transition-all duration-300 hover:shadow-md dark:hover:shadow-indigo-500/5"
  >
    <div className={`p-4 ${colorClass} rounded-2xl flex items-center justify-center`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p className="text-[11px] uppercase tracking-wider font-bold text-gray-400 dark:text-slate-500 mb-0.5">{title}</p>
      <h3 className="font-extrabold text-xl text-gray-900 dark:text-white">{value}</h3>
    </div>
  </motion.div>
);

/* ================= PROFILE CARD ================= */
const UserProfileCard = () => {
  const { user, updateProfile, isLoading, daysRemaining } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone ? String(user.phone) : "",
    profileImage: null,
  });

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    if (formData.profileImage) data.append("profileImage", formData.profileImage);

    await updateProfile(data);
    setIsEditing(false);
  };

  return (
   <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden relative"
      >
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-500/5 dark:via-transparent -z-0" />

        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <User size={18} />
            </div>
            <h3 className="text-base font-bold text-gray-800 dark:text-slate-200">Vue d'ensemble du compte</h3>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="group flex items-center gap-2 bg-gray-900 dark:bg-indigo-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-500/20"
          >
            <Edit size={14} className="group-hover:rotate-12 transition-transform" /> 
            Modifier le profil
          </button>
        </div>

        {/* Content */}
        <div className="p-8 pt-2 flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          {/* Avatar Container */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl relative transition-transform duration-500 group-hover:scale-[1.02]">
              <img
                src={user.profileImage || "https://placehold.co/200x200/4F46E5/ffffff?text=User"}
                className="w-full h-full object-cover"
                alt={user.name}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Camera className="text-white" size={24} />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-900 shadow-sm"></span>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-1">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{user.name}</h2>
                <div className="flex items-center justify-center md:justify-start gap-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                  <ShieldCheck size={12} /> {user.role}
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Gérez vos informations personnelles et vos préférences.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 text-gray-600 dark:text-slate-300">
                <Mail size={16} className="text-indigo-500" />
                <span className="text-xs font-semibold truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 text-gray-600 dark:text-slate-300">
                <Phone size={16} className="text-indigo-500" />
                <span className="text-xs font-semibold">{user.phone || "Aucun téléphone lié"}</span>
              </div>
            </div>
          </div>

          {/* Plan Badge */}
          <div className="w-full md:w-auto">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-indigo-600 dark:to-indigo-800 p-6 rounded-[2rem] text-white shadow-xl shadow-gray-200 dark:shadow-none">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-yellow-400 fill-yellow-400" />
                <span className="font-black text-sm tracking-tight">Plan actif</span>
              </div>
              <div className="mb-4">
                <p className="text-2xl font-bold uppercase tracking-tighter">
                  {user?.hasPaid ? user.paidPlan : "Formule gratuite"}
                </p>
              </div>

              {user?.hasPaid ? (
                <div className="flex items-center gap-2 text-green-400 text-xs font-bold bg-white/10 px-3 py-2 rounded-xl">
                  <Calendar size={14} />
                  {daysRemaining} jours restants
                </div>
              ) : (
                <div className="text-gray-400 dark:text-indigo-200/60 text-[10px] font-bold uppercase tracking-widest">
                  Accès limité
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-gray-900/60 dark:bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-transparent dark:border-slate-800"
            >
              <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Mettre à jour le profil</h2>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 dark:text-slate-500 ml-1 uppercase tracking-wider">Nom complet</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input
                        className="w-full border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                        value={formData.name}
                        placeholder="Votre nom complet"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 dark:text-slate-500 ml-1 uppercase tracking-wider">Adresse e-mail</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input
                        className="w-full border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                        value={formData.email}
                        placeholder="email@exemple.com"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 dark:text-slate-500 ml-1 uppercase tracking-wider">Numéro de téléphone</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input
                        className="w-full border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                        value={formData.phone}
                        placeholder="+216 xx xxx xxx"
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 dark:text-slate-500 ml-1 uppercase tracking-wider">Photo de profil</label>
                    <label className="flex items-center gap-3 px-4 py-3 bg-indigo-50 dark:bg-indigo-500/10 border border-dashed border-indigo-200 dark:border-indigo-500/30 rounded-2xl cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors group">
                      <Upload size={18} className="text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {formData.profileImage ? formData.profileImage.name : "Sélectionner une nouvelle image"}
                      </span>
                      <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-2xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enregistrement..." : "Appliquer les modifications"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ================= MAIN PAGE ================= */
const ProfilePage = () => {
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const payments = user?.paymentHistory || [];

  const totalPages = Math.max(1, Math.ceil(payments.length / rowsPerPage));

  const currentPayments = payments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-500">
       {user?.role !== "admin" ? (
      <CompanySidebar
        activeItem="Profil"
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
       ): (
        <SideBarAdmin
        activeItem="Profil"
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
       )}
      <main className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl text-gray-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Paramètres du compte</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                  Connecté en tant que {user?.role}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl  mx-auto w-full space-y-8">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              title="Transactions"
              value={payments.length}
              icon={<DollarSign />}
              colorClass="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              title="Plan actuel"
              value={user?.hasPaid ? user.paidPlan : "Gratuit"}
              icon={<Zap />}
              colorClass="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
            />
            {/* <StatCard
              title="Plan Validity"
              value={`${user?.hasPaid ? user.daysRemaining : 0} Days`}
              icon={<Calendar />}
              colorClass="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
            /> */}
          </div>

          {/* PROFILE SECTION */}
          <UserProfileCard />

          {/* BILLING HISTORY SECTION */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between bg-gray-50/30 dark:bg-slate-800/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-gray-800 dark:text-slate-200 shadow-sm border border-gray-100 dark:border-slate-700">
                  <CreditCard size={18} />
                </div>
                <h3 className="text-base font-bold text-gray-800 dark:text-slate-200">Historique de facturation</h3>
              </div>
              <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                {payments.length} transactions trouvées
              </span>
            </div>

            <div className="p-8">
              {currentPayments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-gray-300 dark:text-slate-600 mb-4">
                     <CreditCard size={32} />
                  </div>
                  <p className="text-gray-400 dark:text-slate-500 font-bold text-sm">Aucun enregistrement de paiement disponible.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentPayments.map((p, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={i}
                      className="p-5 rounded-[1.75rem] border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-indigo-100 dark:hover:border-indigo-500/30 hover:shadow-lg dark:hover:bg-slate-800/50 transition-all duration-300 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                           <ShieldCheck size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{p.plan}</p>
                          <p className="text-xs font-semibold text-gray-400 dark:text-slate-500">
                            Acheté le {new Date(p.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-lg text-emerald-600 dark:text-emerald-400">
                          ${p.amount.toFixed(2)}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-slate-500">Succès</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-8">
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-500">
                    Page <span className="text-gray-900 dark:text-white">{currentPage}</span> sur {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="p-3 rounded-xl border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="p-3 rounded-xl border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 disabled:opacity-30 transition-all"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;