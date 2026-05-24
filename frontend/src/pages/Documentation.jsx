import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Layers,
  Database,
  Shield,
  FileText,
  Settings,
  Users,
  Wallet,
  Package,
  ChevronRight,
  Menu,
  X,
  Search,
  ExternalLink,
  Sparkles
} from "lucide-react";

const sections = [
  {
    id: "overview",
    title: "Aperçu",
    icon: <BookOpen size={18} />,
    content:
      "Cette application ERP est un système de gestion d’entreprise full-stack construit avec React (frontend), Spring Boot / Node.js (backend) et MongoDB. Elle gère les entreprises, la comptabilité, les clients, les factures, les paramètres fiscaux et les documents.",
  },
  {
    id: "company",
    title: "Module Entreprise",
    icon: <Layers size={18} />,
    content:
      "Le module entreprise permet aux utilisateurs de créer et gérer leur profil d’entreprise, y compris le logo, le code QR, les coordonnées et l’adresse. Toutes les données sont stockées par utilisateur authentifié.",
  },
  {
    id: "accounts",
    title: "Système Comptable",
    icon: <Wallet size={18} />,
    content:
      "Le système gère les comptes, les soldes et le suivi financier. Il s’intègre aux factures et aux transactions pour calculer les soldes en temps réel.",
  },
  {
    id: "tax",
    title: "Gestion Fiscale",
    icon: <Database size={18} />,
    content:
      "Les paramètres de TVA et les règles fiscales sont centralisés. Ces valeurs sont utilisées automatiquement dans la génération des factures et les calculs financiers.",
  },
  {
    id: "customers",
    title: "Gestion des Clients",
    icon: <Users size={18} />,
    content:
      "Gérez les clients, leurs profils et leur historique de transactions. Les clients sont liés aux factures et aux commandes.",
  },
  {
    id: "products",
    title: "Produits & Stock",
    icon: <Package size={18} />,
    content:
      "Les produits peuvent être créés et suivis. La gestion des stocks permet les mises à jour et la catégorisation des produits.",
  },
  {
    id: "security",
    title: "Authentification & Sécurité",
    icon: <Shield size={18} />,
    content:
      "L’authentification basée sur JWT protège les routes. Chaque entreprise est isolée par session utilisateur.",
  },
  {
    id: "invoices",
    title: "Factures & Documents",
    icon: <FileText size={18} />,
    content:
      "Les factures sont générées automatiquement à partir des paramètres fiscaux de l’entreprise, des QR codes et des données clients. Les documents peuvent être exportés et stockés.",
  },
  {
    id: "settings",
    title: "Paramètres",
    icon: <Settings size={18} />,
    content:
      "Les utilisateurs peuvent configurer le profil de l’entreprise, les paramètres fiscaux et les préférences système depuis le tableau de bord des paramètres.",
  },
];

const Documentation = () => {
  const [active, setActive] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const current = sections.find((s) => s.id === active);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/40 selection:text-indigo-700">
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">E</div>
          <span className="font-black tracking-tighter">DOCS EXPERT</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <AnimatePresence>
        {(mobileMenuOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
          <motion.aside
            initial={mobileMenuOpen ? { x: -300 } : false}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={`
              fixed lg:sticky top-0 left-0 bottom-0 z-40
              w-72 lg:w-80 h-screen overflow-y-auto
              bg-white dark:bg-[#020617] lg:bg-transparent
              border-r border-slate-200 dark:border-slate-800 lg:border-none
              p-6 lg:pt-10 transition-transform duration-300
              ${mobileMenuOpen ? 'block' : 'hidden lg:block'}
            `}
          >
            <div className="hidden lg:flex items-center gap-3 mb-10 px-2">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/30">E</div>
              <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">DOCS EXPERT</span>
            </div>

            <nav className="space-y-1.5">
              <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-4">
                Modules de documentation
              </p>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActive(s.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-all group
                    ${active === s.id
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 lg:hover:shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                    }
                  `}
                >
                  <span className="flex items-center gap-3">
                    <span className={`${active === s.id ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-indigo-500"}`}>
                      {s.icon}
                    </span>
                    {s.title}
                  </span>
                  <ChevronRight size={14} className={`${active === s.id ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`} />
                </button>
              ))}
            </nav>

            <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-900 px-2">
              <div className="flex items-center gap-3 text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer group">
                <ExternalLink size={16} />
                <span className="text-xs font-bold">Référence API</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* CONTENT AREA */}
      <main className="flex-1 lg:h-screen lg:overflow-y-auto pt-8 lg:pt-20 px-6 lg:px-20 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* BREADCRUMBS */}
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
              <span>Docs</span>
              <ChevronRight size={10} />
              <span className="text-indigo-600 dark:text-indigo-400">{current.title}</span>
            </div>

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/5">
                  {React.cloneElement(current.icon, { size: 32 })}
                </div>
                <div>
                  <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                    {current.title}
                  </h2>
                  <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">Spécification du module & guides</p>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT CARD */}
            <div className="bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute -right-10 -top-10 opacity-[0.03] pointer-events-none dark:opacity-[0.05]">
                 {React.cloneElement(current.icon, { size: 300 })}
              </div>

              <div className="relative z-10">
                <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-10">
                  {current.content}
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 group hover:border-indigo-500/30 transition-all">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-indigo-500 transition-colors">Implémentation</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Intégration REST standard avec support CRUD complet.</p>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 group hover:border-indigo-500/30 transition-all">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-indigo-500 transition-colors">Niveau d’accès</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Privilèges utilisateur standard / administrateur requis.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CALLOUT */}
            <div className="mt-10 group cursor-default">
              <div className="relative p-8 rounded-[2rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20 transform group-hover:rotate-12 transition-transform duration-500">
                  <Sparkles size={100} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center flex-shrink-0">
                    <Info size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Note développeur</h4>
                    <p className="text-indigo-100 text-sm leading-relaxed max-w-xl font-medium opacity-90">
                      Cette section fait partie de la documentation du système <span className="font-black text-white">EXPERT ERP</span>. Plus de détails API et architecture sont disponibles dans le dépôt technique.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER NAV */}
            <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-slate-400">
              <p>© 2026 Expert Systems. Documentation v1.0.4</p>
              <div className="flex gap-6 uppercase tracking-widest">
                <a href="#" className="hover:text-indigo-500 transition-colors">Confidentialité</a>
                <a href="#" className="hover:text-indigo-500 transition-colors">Support</a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// Simple Helper for Info icon
const Info = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
  </svg>
);

export default Documentation;