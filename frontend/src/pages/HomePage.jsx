import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
// --- Framer Motion Variants for Staggered Animations ---

import {
  LayoutDashboard,
  Users,
  Settings,
  PieChart,
  ShoppingCart,
  Package,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Globe,
  Briefcase,
  Zap,
  CheckCircle,
  Truck,
  Database,
  Layers,
  Activity,
  GraduationCap,
  BarChart3,
  TrendingUp,
  Cpu,
  PlayCircle,
  Building2,
} from "lucide-react";

// --- Framer Motion Animation Variants ---
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const hoverScale = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };
  // Animated Button Component
  const AnimatedButton = ({
    children,
    className = "",
    href = "#",
    delay = 0.5,
  }) => (
    <motion.a
      href={href}
      className={`px-10 py-4 font-extrabold text-lg rounded-full transition-all duration-300 transform inline-flex items-center justify-center space-x-3 ${className}`}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 15px 30px rgba(79, 70, 229, 0.6)",
        y: -4,
      }}
      whileTap={{ scale: 0.95, y: 0 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.a>
  );

  // Navigation Component
const Nav = () => (
  <motion.header
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 100, damping: 15 }}
    className="sticky top-0 z-50 bg-white/98 backdrop-blur-lg shadow-xl border-b border-gray-100"
  >
    <div className="w-full px-8 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      {/* Logo / Marque */}
      <div className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
        <Building2 className="w-8 h-8 mr-2 text-indigo-700" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-500">
          <NavLink to="/">ExpertERP</NavLink>
        </span>
      </div>

      {/* Menu bureau */}
      {user?.role !== "admin" ? (
        <nav className="hidden md:flex space-x-10">
          <a
            href="/"
            className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
          >
            Accueil
            <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
          </a>
          {isAuthenticated ? (
            <>
              <a
                href="/profile"
                className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
              >
                Profil
                <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
              </a>
              {user?.role == "owner" && (
                <a
                  href="/company"
                  className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
                >
                  Entreprise
                  <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
                </a>
              )}
              {user?.role == "seller" && (
                <a
                  href="/All-Client-Orders"
                  className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
                >
                  Ventes
                  <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
                </a>
              )}

              {user?.role == "buyer" && (
                <a
                  href="/All-Supplier-orders"
                  className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
                >
                  Achats
                  <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
                </a>
              )}

              {user?.role == "hr" && (
                <a
                  href="/Workers-Payments"
                  className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
                >
                  Ressources humaines
                  <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
                </a>
              )}

              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
              >
                Déconnexion
                <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
            >
              Connexion
              <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
            </a>
          )}
        </nav>
      ) : (
        <nav className="hidden md:flex space-x-10">
          {isAuthenticated ? (
            <>
              <a
                href="/dashboard"
                className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
              >
                Tableau de bord
                <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
              </a>

              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
              >
                Déconnexion
                <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
            >
              Connexion
              <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
            </a>
          )}
        </nav>
      )}

      {/* Bouton menu mobile */}
      <button
        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-indigo-50 transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Basculer le menu mobile"
      >
        {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
      </button>
    </div>

    {/* Contenu du menu mobile */}
    <motion.div
      className="md:hidden overflow-hidden"
      initial={false}
      animate={isMenuOpen ? "open" : "closed"}
      variants={{
        open: {
          height: "auto",
          opacity: 1,
          transition: { type: "spring", stiffness: 200, damping: 20 },
        },
        closed: { height: 0, opacity: 0, transition: { duration: 0.3 } },
      }}
    >
      {user?.role !== "admin" ? (
        <div className="flex flex-col space-y-2 p-4 border-t border-gray-100">
          <NavLink
            to="/"
            className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Accueil
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/profile"
                className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Profil
              </NavLink>
              {user?.role == "owner" && (
                <NavLink
                  to="/company"
                  className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entreprise
                </NavLink>
              )}

              {user?.role == "seller" && (
                <NavLink
                  to="/All-Client-Orders"
                  className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ventes
                </NavLink>
              )}

              {user?.role == "buyer" && (
                <NavLink
                  to="/All-Supplier-orders"
                  className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Achats
                </NavLink>
              )}

              {user?.role == "hr" && (
                <NavLink
                  to="/Workers-Payments"
                  className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ressources humaines
                </NavLink>
              )}

              <button
                onClick={handleLogout}
                className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
              >
                Déconnexion
                <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Connexion
            </NavLink>
          )}
        </div>
      ) : (
        <div className="flex flex-col space-y-2 p-4 border-t border-gray-100">
          <NavLink
            to="/dashboard"
            className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Tableau de bord
          </NavLink>
        </div>
      )}
    </motion.div>
  </motion.header>
);

  // Hero Section - Ultra Enhanced, Split Layout
 const Hero = () => (
  <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
    {/* Bulles d’arrière-plan animées */}
    <div className="absolute top-0 right-0 -z-10 opacity-20">
      <div className="w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[120px] animate-blob"></div>
    </div>
    <div className="absolute bottom-0 left-0 -z-10 opacity-20">
      <div className="w-[400px] h-[400px] bg-blue-400 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
    </div>

    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-8 border border-indigo-100"
          >
            <Zap className="w-4 h-4 fill-indigo-600" /> Inspiré par l’écosystème ERPNext
          </motion.div>

          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-8">
            Le système d’exploitation de votre <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Entreprise entière
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
            Automatisez la comptabilité, optimisez les chaînes d’approvisionnement et
            donnez plus de puissance à votre équipe avec un ERP cloud unifié.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {user?.role == "owner" && (
              <Link to="/company">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
                >
                  Commencer le parcours <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            )}

            {user?.role == "seller" && (
              <Link to="/All-Client-Orders">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
                >
                  Commencer le parcours <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            )}

            {user?.role == "buyer" && (
              <Link to="/All-Supplier-orders">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
                >
                  Commencer le parcours <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            )}

            {user?.role == "hr" && (
              <Link to="/Workers-Payments">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
                >
                  Commencer le parcours <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            )}

              {user?.role == "tsm" && (
              <Link to="/Technical-Services">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
                >
                  Commencer le parcours <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            )}

             {user?.role == "asm" && (
              <Link to="/Internet-Payments">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
                >
                  Commencer le parcours <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            )}

            <button className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-bold text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all">
              Voir la démo
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="lg:w-1/2 relative"
        >
          <div className="relative z-10 bg-white p-3 rounded-3xl shadow-2xl border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
              alt="Tableau de bord EXPERT-ERP"
              className="rounded-2xl w-full h-auto"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute -bottom-8 -left-8 bg-white p-5 rounded-2xl shadow-xl border border-gray-50 hidden md:block"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Croissance du chiffre d’affaires
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900">+24.8%</div>
              <div className="text-xs text-green-600 font-bold mt-1">
                Mise à jour en temps réel
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const ModuleGrid = () => {
  const modules = [
    {
      icon: <PieChart />,
      color: "from-blue-600 to-blue-400",
      label: "Finances",
      desc: "Grand livre, fiscalité et actifs",
    },
    {
      icon: <Package />,
      color: "from-amber-600 to-amber-400",
      label: "Inventaire",
      desc: "Stock, numéros de série et lots",
    },
    {
      icon: <Users />,
      color: "from-purple-600 to-purple-400",
      label: "GRH",
      desc: "Paie, RH et KPI",
    },
    {
      icon: <ShoppingCart />,
      color: "from-emerald-600 to-emerald-400",
      label: "Commerce",
      desc: "CRM, ventes et point de vente",
    },
    {
      icon: <Activity />,
      color: "from-rose-600 to-rose-400",
      label: "Fabrication",
      desc: "Nomenclature, en-cours et ordres de fabrication",
    },
    {
      icon: <Cpu />,
      color: "from-indigo-600 to-indigo-400",
      label: "Support",
      desc: "Tickets et maintenance",
    },
  ];

  return (
    <section
      id="modules"
      className="py-40 w-full bg-[#f8fafc] relative overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-black text-gray-900 mb-8 tracking-tighter"
          >
            Cœur unifié. <br />
            Possibilités infinies.
          </motion.h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            Chaque module communique en temps réel. Aucune API requise pour les flux de données internes.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {modules.map((m, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -15 }}
              className="group relative bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer"
            >
              <div
                className={`w-20 h-20 bg-gradient-to-br ${m.color} text-white rounded-3xl flex items-center justify-center mb-10 shadow-xl group-hover:rotate-6 transition-transform`}
              >
                {React.cloneElement(m.icon, { size: 40 })}
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">
                {m.label}
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed mb-10">
                {m.desc}. Intégré et prêt pour des opérations à l’échelle de l’entreprise.
              </p>
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ArrowRight size={20} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const PerformanceSection = () => (
  <section className="py-40 w-full bg-gray-900 text-white relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
      <div className="flex flex-col lg:flex-row gap-32 items-center">
        <div className="lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <h2 className="text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter">
              La vitesse <br />
              est une stratégie.
            </h2>
            <p className="text-gray-400 text-xl lg:text-2xl leading-relaxed">
              Expérimentez une propagation des données en moins d’une seconde à travers votre structure d’entités globale.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-10">
              {[
                {
                  icon: <BarChart3 className="text-indigo-400" />,
                  title: "BI en direct",
                  desc: "Rapports sans latence.",
                },
                {
                  icon: <ShieldCheck className="text-indigo-400" />,
                  title: "Conforme",
                  desc: "Prêt pour SOC2 & RGPD.",
                },
                {
                  icon: <Globe className="text-indigo-400" />,
                  title: "Multi-entités",
                  desc: "Plus de 100 entités juridiques.",
                },
                {
                  icon: <Zap className="text-indigo-400" />,
                  title: "Opérations ouvertes",
                  desc: "Accès API REST complet.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="p-3 bg-white/5 rounded-xl">{item.icon}</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="lg:w-1/2 w-full relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 relative z-10 shadow-3xl"
          >
            <div className="flex items-center justify-between mb-12">
              <h3 className="font-black text-2xl tracking-tighter">
                État du grand livre mondial
              </h3>
              <div className="px-4 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                Opérationnel
              </div>
            </div>

            <div className="space-y-10">
              {[
                {
                  label: "Trésorerie",
                  val: "$12.4M",
                  percent: 90,
                  color: "bg-indigo-500",
                },
                {
                  label: "Rotation des stocks",
                  val: "4.2x",
                  percent: 60,
                  color: "bg-blue-500",
                },
                {
                  label: "Marge EBITDA",
                  val: "28.5%",
                  percent: 75,
                  color: "bg-indigo-400",
                },
              ].map((bar, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-4 text-xs font-black uppercase tracking-widest text-gray-400">
                    <span>{bar.label}</span>
                    <span className="text-white">{bar.val}</span>
                  </div>
                  <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.percent}%` }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                      className={`h-full ${bar.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Éclat d’arrière-plan visuel */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-600/20 blur-[150px] -z-10 rounded-full"></div>
        </div>
      </div>
    </div>
  </section>
);

const Modules = () => {
  const coreModules = [
    {
      icon: <PieChart />,
      title: "Comptabilité",
      desc: "Multi-devises, prêt pour la fiscalité et rapprochement bancaire automatisé.",
    },
    {
      icon: <Package />,
      title: "Stock & Actifs",
      desc: "Suivi des numéros de série, gestion des lots et niveaux de réapprovisionnement automatiques.",
    },
    {
      icon: <Users />,
      title: "RH & Paie",
      desc: "Suivi des présences, notes de frais et structures salariales personnalisées.",
    },
    {
      icon: <ShoppingCart />,
      title: "CRM & Ventes",
      desc: "Gestion du pipeline, intégration e-mail et génération instantanée de devis.",
    },
    {
      icon: <Activity />,
      title: "Fabrication",
      desc: "Ordres de fabrication, nomenclature multi-niveaux et outil de planification de production.",
    },
    {
      icon: <Briefcase />,
      title: "Projets",
      desc: "Suivi des tâches, feuilles de temps et analyse de rentabilité pour les entreprises de services.",
    },
  ];

  return (
    <section id="modules" className="py-24 bg-gray-50/50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Le cœur modulaire
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Avancez à votre rythme. Commencez par la comptabilité et ajoutez des modules au fur et à mesure que votre entreprise évolue.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {coreModules.map((m, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                {React.cloneElement(m.icon, { size: 28 })}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {m.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {m.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const FeatureHighlights = () => (
  <section id="features" className="py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:w-1/2 grid grid-cols-2 gap-6"
        >
          <div className="space-y-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl"
            >
              <Globe className="w-10 h-10 mb-4 opacity-80" />
              <h4 className="text-lg font-bold">Prêt pour l’international</h4>
              <p className="text-indigo-100 text-sm mt-2">
                Localisation intégrée pour plus de 100 pays.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-8 rounded-3xl border border-gray-100"
            >
              <ShieldCheck className="w-10 h-10 text-indigo-600 mb-4" />
              <h4 className="text-lg font-bold">Souveraineté des données</h4>
              <p className="text-gray-500 text-sm mt-2">
                Hébergez sur votre propre cloud ou notre infrastructure sécurisée.
              </p>
            </motion.div>
          </div>

          <div className="space-y-6 mt-12">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-900 p-8 rounded-3xl text-white shadow-xl"
            >
              <Database className="w-10 h-10 mb-4 text-indigo-400" />
              <h4 className="text-lg font-bold">100% extensible</h4>
              <p className="text-gray-400 text-sm mt-2">
                Types de documents et champs personnalisés via notre éditeur UI.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100"
            >
              <LayoutDashboard className="w-10 h-10 text-indigo-600 mb-4" />
              <h4 className="text-lg font-bold">BI en temps réel</h4>
              <p className="text-gray-600 text-sm mt-2">
                Tableaux de bord avancés pour des insights exécutifs.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:w-1/2"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
            Conçu pour <br />
            la scalabilité et la simplicité
          </h2>

          <div className="space-y-8">
            {[
              {
                title: "Indépendance financière",
                desc: "Contrôle total de vos écritures comptables sans verrouillage propriétaire.",
              },
              {
                title: "Automatisation sans code",
                desc: "Créez des règles métiers complexes et des workflows d’approbation via des flux visuels.",
              },
              {
                title: "Excellence mobile",
                desc: "Toutes les fonctionnalités ERP dans votre poche via notre application native.",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5"
              >
                <div className="mt-1 flex-shrink-0 w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-600 w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-lg font-bold text-gray-900 mb-1">
                    {f.title}
                  </h5>
                  <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ x: 10 }}
            className="mt-12 flex items-center gap-2 text-indigo-600 font-bold group"
          >
            Explorer toutes les fonctionnalités{" "}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  </section>
);

const Industries = () => (
  <section
    id="industries"
    className="py-24 bg-gray-900 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-extrabold text-white mb-4">
          Solutions par secteur
        </h2>
        <p className="text-gray-400">
          Configurations préconfigurées pour votre domaine spécifique.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { name: "Commerce de détail", icon: <ShoppingCart /> },
          { name: "Services", icon: <Briefcase /> },
          { name: "Production", icon: <Settings /> },
          { name: "Logistique", icon: <Truck /> },
        ].map((ind, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
            className="flex flex-col items-center gap-4 p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm cursor-pointer transition-all"
          >
            <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-2">
              {React.cloneElement(ind.icon, { size: 32 })}
            </div>
            <span className="text-white font-bold text-lg">{ind.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white">
              <Layers size={18} />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              ExpertERP
            </span>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Donner aux entreprises un logiciel de gestion flexible, ouvert et automatisé.
          </p>

          <div className="flex gap-4">
            {["E", "R", "P"].map((social) => (
              <div
                key={social}
                className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer text-gray-400"
              >
                <div className="text-[10px] font-bold uppercase">
                  {social[0]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-xs">
            Modules
          </h5>
          <ul className="space-y-4 text-gray-500 text-sm font-medium">
            {user?.role == "owner" && (
              <li>
                <a
                  href="/Financial-accounting"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Comptabilité
                </a>
              </li>
            )}
            {user?.role == "hr" && (
              <li>
                <a
                  href="/Customers"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Clients
                </a>
              </li>
            )}
            <li>
              <a
                href="/Products"
                className="hover:text-indigo-600 transition-colors"
              >
                Inventaire
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-xs">
            Support
          </h5>
          <ul className="space-y-4 text-gray-500 text-sm font-medium">
            <li>
              <a href="/Documentation" className="hover:text-indigo-600 transition-colors">
                Documentation
              </a>
            </li>
            <li>
              <a href="/Help-Center" className="hover:text-indigo-600 transition-colors">
                Centre d’aide
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-xs">
            Entreprise
          </h5>
          <ul className="space-y-4 text-gray-500 text-sm font-medium">
            <li>
              <a
                href="/About-us"
                className="hover:text-indigo-600 transition-colors"
              >
                À propos
              </a>
            </li>
            <li>
              <a
                href="/Contact-us"
                className="hover:text-indigo-600 transition-colors"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="/Privacy-Policy"
                className="hover:text-indigo-600 transition-colors"
              >
                Confidentialité
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-xs font-medium">
          &copy; {new Date().getFullYear()} EXPERT-ERP Opérations globales. Tous droits réservés. Conçu pour la scalabilité.
        </p>
      </div>
    </div>
  </footer>
);

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-800 scroll-smooth">
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
      <Nav />
      <main>
        <Hero />
        <ModuleGrid />
        <PerformanceSection />
        {/* <Modules /> */}
        <FeatureHighlights />
        <Industries />

    {/* Section CTA */}
<section className="py-24 bg-gradient-to-b from-white to-indigo-50 relative overflow-hidden">
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="max-w-4xl mx-auto px-4 text-center relative z-10"
  >
    <h2 className="text-5xl font-black text-gray-900 mb-8 leading-tight">
      Prêt à moderniser vos opérations ?
    </h2>

    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
      Rejoignez des milliers d’entreprises axées sur la croissance qui font confiance à EXPERT-ERP
      pour alimenter leurs activités quotidiennes.
    </p>

    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200"
      >
        Créer une instance
      </motion.button>

      <button className="text-indigo-600 font-bold text-lg hover:underline underline-offset-8">
        Contacter les ventes
      </button>
    </div>

    <p className="mt-10 text-sm text-gray-400 font-semibold uppercase tracking-widest">
      Auto-hébergé ou Cloud géré
    </p>
  </motion.div>
</section>
      </main>
      <Footer />
    </div>
  );
};
export default HomePage;
