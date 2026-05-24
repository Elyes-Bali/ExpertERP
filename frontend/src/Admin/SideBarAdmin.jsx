import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  LayoutDashboard,
  Package,
  Settings,
  ChevronDown,
  Users,
  ShoppingCart,
  X,
  Hash,
  Percent,
  Banknote,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { FiLogOut } from "react-icons/fi";

const SideBarAdmin = ({ activeItem = "Paramètres", isOpen, setIsOpen }) => {
  const { user, logout } = useAuthStore();

  const sidebarContent = (
    <div className="w-72 h-full bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 flex flex-col overflow-y-auto transition-colors duration-300">
      {/* Logo */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3 bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none">
          <Building2 className="text-white w-6 h-6" />
          <span className="text-white font-bold text-xl tracking-tight">ExpertERP</span>
        </div>

        {/* Mobile close */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 space-y-2 pb-8">
        <Link to="/dashboard" onClick={() => setIsOpen(false)}>
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Tableau de bord" 
            active={activeItem === "Dashboard"}
          />
        </Link>

        {/* Example of how to use Dropdowns if needed */}
        <SidebarDropdown label="Gestion">
          <Link to="/dashboard" onClick={() => setIsOpen(false)}>
           <SidebarSubItem label="Utilisateurs" icon={<Users size={16} />} />
          </Link>

           <Link to="/Plan-Comptable" onClick={() => setIsOpen(false)}>
             <SidebarSubItem label="Plan Comptable" icon={<Package size={16} />} />
           </Link>

           <Link to="/Type-Comptes" onClick={() => setIsOpen(false)}>
             <SidebarSubItem label="Types de comptes" icon={<CreditCard  size={16} />} />
           </Link>

            <Link to="/Journal-Comptable" onClick={() => setIsOpen(false)}>
             <SidebarSubItem label="Journal comptable" icon={<Hash size={16} />} />
           </Link>
        </SidebarDropdown>

        {/* SETTINGS */}
        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800">
          <Link to="/profile" onClick={() => setIsOpen(false)}>
            <SidebarItem
              icon={<Settings size={20} />}
              label="Paramètres"
              active={activeItem === "Settings"}
            />
          </Link>
        </div>
      </nav>

      {/* FOOTER */}
      <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
            <img
              src={user?.profileImage || "https://placehold.co/40x40/4F46E5/ffffff?text=User"}
              alt={user?.name || "Avatar utilisateur"}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all duration-200"
        >
          <FiLogOut className="w-4 h-4" />
          <span className="text-sm">Déconnexion</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden lg:flex lg:sticky lg:top-0 h-screen">
        {sidebarContent}
      </div>

      {/* MOBILE */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * SIDEBAR ITEM
 */
const SidebarItem = ({ icon, label, active }) => (
  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
      active
        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm shadow-indigo-100/50 dark:shadow-none"
        : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
    }`}
  >
    <span className={active ? "text-indigo-600 dark:text-indigo-400" : ""}>{icon}</span>
    <span className="text-sm font-bold">{label}</span>
  </div>
);

/**
 * DROPDOWN
 */
const SidebarDropdown = ({ label, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 text-sm font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all"
      >
        <span className="flex items-center gap-3">{label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="ml-4 mt-1 border-l-2 border-gray-100 dark:border-slate-800 pl-2 space-y-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarSubItem = ({ label, icon }) => (
  <div className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 rounded-lg cursor-pointer transition-all">
    {icon && <span>{icon}</span>}
    {label}
  </div>
);

export default SideBarAdmin;