import React, { useEffect, useState } from "react";
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
  Percent,
  Gauge,
  Laptop,
  Wrench,
  Wallet,
  CreditCard
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { FiLogOut } from "react-icons/fi";
import { useCompanyStore } from "../store/companyStore";

const DEFAULT_MENUS = {
  documents: true,
  cards: false,
  company: false,
  teches: false,
  internet: false,
  taxes: false,
  ventes: false,
  achats: false,
  parametres: false,
};

const CompanySidebar = ({ activeItem = "Settings", isOpen, setIsOpen }) => {
  const { company, fetchCompany } = useCompanyStore();
  const { user, logout } = useAuthStore();

  const [openMenus, setOpenMenus] = useState(() => {
    try {
      const saved = localStorage.getItem("sidebarOpenMenus");
      return saved ? JSON.parse(saved) : DEFAULT_MENUS;
    } catch {
      return DEFAULT_MENUS;
    }
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => {
      const updated = { ...prev, [menu]: !prev[menu] };
      localStorage.setItem("sidebarOpenMenus", JSON.stringify(updated));
      return updated;
    });
  };

  // Only close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const sidebarContent = (
    <div className="w-72 h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3 bg-indigo-600 p-3 rounded-2xl shadow-lg">
          <Building2 className="text-white w-6 h-6" />
          <Link to="/" onClick={handleLinkClick}>
            <span className="text-white font-bold text-xl">ExpertERP</span>
          </Link>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 space-y-2 pb-8">
        <SidebarItem icon={<LayoutDashboard size={20} />} label="Tableau de bord" />

        {/* ENTREPRISE */}
        <div>
          <button
            onClick={() => toggleMenu("company")}
            className="w-full flex justify-between items-center p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"
          >
            Entreprise
            <ChevronDown size={14} className={`transition ${openMenus.company ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {openMenus.company && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1 overflow-hidden"
              >
                <SidebarDropdown
                  label="Paramètres"
                  open={openMenus.parametres}
                  onToggle={() => toggleMenu("parametres")}
                >
                  {!company ? (
                    <Link to="/company" onClick={handleLinkClick}>
                      <SidebarSubItem label="Profil de l'entreprise" />
                    </Link>
                  ) : (
                    <>
                      {user?.role === "owner" && (
                        <>
                          <Link to="/company" onClick={handleLinkClick}>
                            <SidebarSubItem label="Profil de l'entreprise" />
                          </Link>
                          <Link to="/Financial-accounting" onClick={handleLinkClick}>
                            <SidebarSubItem label="Comptes financiers" />
                          </Link>
                          <Link to="/projects" onClick={handleLinkClick}>
                            <SidebarSubItem label="Projets" />
                          </Link>
                          <Link to="/brands-and-categories" onClick={handleLinkClick}>
                            <SidebarSubItem label="Marques, catégories et unités" />
                          </Link>
                          <Link to="/warehouses" onClick={handleLinkClick}>
                            <SidebarSubItem label="Entrepôts" />
                          </Link>
                          <Link to="/New-Worker" onClick={handleLinkClick}>
                            <SidebarSubItem label="Nouvel employé" />
                          </Link>
                          <Link to="/Company-workers" onClick={handleLinkClick}>
                            <SidebarSubItem label="Employés de l'entreprise" />
                          </Link>
                        </>
                      )}
                    </>
                  )}
                </SidebarDropdown>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* DOCUMENTS */}
        {company && (
          <div>
            <button
              onClick={() => toggleMenu("documents")}
              className="w-full flex justify-between items-center p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase"
            >
              Documents
              <ChevronDown size={14} className={`transition ${openMenus.documents ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {openMenus.documents && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  {(user?.role === "owner" || user?.role === "seller") && (
                    <SidebarDropdown
                      label="Ventes"
                      open={openMenus.ventes}
                      onToggle={() => toggleMenu("ventes")}
                    >
                      <Link to="/Client-orders" onClick={handleLinkClick}>
                        <SidebarSubItem label="Commande client" />
                      </Link>
                      <Link to="/All-Client-Orders" onClick={handleLinkClick}>
                        <SidebarSubItem label="Toutes les commandes clients" />
                      </Link>
                      <Link to="/invoices" onClick={handleLinkClick}>
                        <SidebarSubItem label="Facture" />
                      </Link>
                      <Link to="/All-Sales-Invoices" onClick={handleLinkClick}>
                        <SidebarSubItem label="Toutes les factures de vente" />
                      </Link>
                    </SidebarDropdown>
                  )}
                  {(user?.role === "owner" || user?.role === "buyer") && (
                    <SidebarDropdown
                      label="Achats"
                      open={openMenus.achats}
                      onToggle={() => toggleMenu("achats")}
                    >
                      <Link to="/Supplier-order" onClick={handleLinkClick}>
                        <SidebarSubItem label="Commande fournisseur" />
                      </Link>
                      <Link to="/All-Supplier-orders" onClick={handleLinkClick}>
                        <SidebarSubItem label="Toutes les commandes fournisseurs" />
                      </Link>
                      <Link to="/Supplier-invoice" onClick={handleLinkClick}>
                        <SidebarSubItem label="Facture fournisseur" />
                      </Link>
                      <Link to="/All-Supplier-invoices" onClick={handleLinkClick}>
                        <SidebarSubItem label="Toutes les factures fournisseurs" />
                      </Link>
                    </SidebarDropdown>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* DATA CARDS */}
        {company && (
          <div>
            <button
              onClick={() => toggleMenu("cards")}
              className="w-full flex justify-between items-center p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-4"
            >
              Cartes de données
              <ChevronDown size={14} className={`transition ${openMenus.cards ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {openMenus.cards && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  {(user?.role === "owner" || user?.role === "hr") && (
                    <>
                      <Link to="/customers" onClick={handleLinkClick}>
                        <SidebarItem icon={<Users size={18} />} label="Clients" />
                      </Link>
                      <Link to="/Suppliers" onClick={handleLinkClick}>
                        <SidebarItem icon={<ShoppingCart size={18} />} label="Fournisseurs" />
                      </Link>
                      <Link to="/Workers-Payments" onClick={handleLinkClick}>
                        <SidebarItem icon={<Wallet size={18} />} label="Paiements des employés" />
                      </Link>
                    </>
                  )}
                  <Link to="/Products" onClick={handleLinkClick}>
                    <SidebarItem icon={<Package size={18} />} label="Produits et services" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* TECHNICAL SERVICES */}
        {company && (user?.role === "owner" || user?.role === "tsm") && (
          <div>
            <button
              onClick={() => toggleMenu("teches")}
              className="w-full flex justify-between items-center p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-4"
            >
              Services techniques
              <ChevronDown size={14} className={`transition ${openMenus.teches ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {openMenus.teches && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <Link to="/Machine-Types" onClick={handleLinkClick}>
                    <SidebarItem icon={<Laptop size={18} />} label="Types de machines" />
                  </Link>
                  <Link to="/Materials" onClick={handleLinkClick}>
                    <SidebarItem icon={<Package size={18} />} label="Matériaux" />
                  </Link>
                  <Link to="/Notes" onClick={handleLinkClick}>
                    <SidebarItem icon={<Package size={18} />} label="Notes" />
                  </Link>
                  <Link to="/Technical-Services" onClick={handleLinkClick}>
                    <SidebarItem icon={<Wrench size={18} />} label="Services techniques" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* INTERNET */}
        {company && (user?.role === "owner" || user?.role === "asm") && (
          <div>
            <button
              onClick={() => toggleMenu("internet")}
              className="w-full flex justify-between items-center p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-4"
            >
              Internet
              <ChevronDown size={14} className={`transition ${openMenus.internet ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {openMenus.internet && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <Link to="/Contract-Types" onClick={handleLinkClick}>
                    <SidebarItem icon={<Gauge size={18} />} label="Types de contrats" />
                  </Link>
                  <Link to="/Internet-Clients" onClick={handleLinkClick}>
                    <SidebarItem icon={<Users size={18} />} label="Clients Internet" />
                  </Link>
                  <Link to="/Internet-Payments" onClick={handleLinkClick}>
                    <SidebarItem icon={<CreditCard size={18} />} label="Paiements Internet" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* TAXES */}
        {company && user?.role === "owner" && (
          <div>
            <button
              onClick={() => toggleMenu("taxes")}
              className="w-full flex justify-between items-center p-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mt-4"
            >
              Taxes
              <ChevronDown size={14} className={`transition ${openMenus.taxes ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {openMenus.taxes && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <Link to="/taxes" onClick={handleLinkClick}>
                    <SidebarItem icon={<Percent size={18} />} label="Taxes et TVA" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* SETTINGS */}
        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <Link to="/profile" onClick={handleLinkClick}>
            <SidebarItem
              icon={<Settings size={20} />}
              label="Paramètres"
              active={activeItem === "Settings"}
            />
          </Link>
        </div>
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
            <img
              src={user?.profileImage || "https://placehold.co/40x40/4F46E5/ffffff?text=User"}
              alt={user?.name || "Avatar utilisateur"}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Déconnexion</span>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
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

const SidebarItem = ({ icon, label, active }) => (
  <div
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${
      active
        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-700 dark:text-white"
        : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
    }`}
  >
    <span>{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const SidebarDropdown = ({ label, children, open, onToggle }) => (
  <div className="px-2">
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center p-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
    >
      {label}
      <ChevronDown size={14} className={open ? "rotate-180 transition" : "transition"} />
    </button>
    {open && (
      <div className="ml-4 mt-1 border-l border-gray-200 dark:border-gray-700 pl-2 space-y-1">
        {children}
      </div>
    )}
  </div>
);

const SidebarSubItem = ({ label }) => (
  <div className="p-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-800 rounded-lg cursor-pointer">
    {label}
  </div>
);

export default CompanySidebar;