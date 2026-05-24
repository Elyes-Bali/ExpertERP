import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  FileText,
  AlertCircle,
  Info,
  CheckCircle2,
  Table as TableIcon,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import CompanySidebar from "./CompanySidebar";

const ProductsGuide = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  const tableData = {
    name: "Industrial Valve",
    type: "material",
    price: "124000",
    stock: "45",
    description: "Grade-A Steel...",
    height: "120",
    width: "80",
    weight: "15.5",
  };

  return (
  <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] dark:bg-gray-950 transition-colors duration-300 font-sans">
      <CompanySidebar
        activeItem="Guide Produits"
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-slate-200 dark:border-gray-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex p-2 bg-indigo-600 rounded-lg text-white">
                <FileText size={20} />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Guide Excel des produits
                </h1>
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Protocole de standardisation
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-gray-800 rounded-full border border-slate-200 dark:border-gray-700">
            <HelpCircle size={14} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Centre de support
            </span>
          </div>
        </header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-4 lg:p-10 max-w-7xl mx-auto w-full space-y-8"
        >
          {/* 🔹 INTRO CARD */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-white dark:bg-gray-900 p-6 lg:p-8 rounded-[2rem] border border-slate-200 dark:border-gray-800 shadow-sm"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <Info
                    className="text-indigo-600 dark:text-indigo-400"
                    size={20}
                  />
                </div>
                <h2 className="font-bold text-xl text-slate-900 dark:text-white">
                  Structurez vos données pour un traitement instantané.
                </h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed text-sm lg:text-base">
                Notre moteur d’analyse nécessite un schéma strict pour éviter la corruption des données. Suivez les définitions des cartes ci-dessous pour garantir que votre
                <span className="text-indigo-600 font-bold italic ml-1">
                  fichier Excel
                </span>{" "}
                soit accepté par le validateur
                <span className="text-indigo-600 font-bold italic ml-1">
                  {" "}
                  EXPERT ERP
                </span>{" "}
                .
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 🔹 RESPONSIVE TABLE STRUCTURE */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 lg:p-8 rounded-[2rem] border border-slate-200 dark:border-gray-800 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TableIcon size={20} className="text-slate-400" /> Colonnes
                  requises
                </h3>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                  Définitions du schéma de données
                </span>
              </div>

              {/* 🖥️ Desktop View: Fixed Table with tight spacing */}
              <div className="hidden xl:block overflow-hidden rounded-2xl border border-slate-100 dark:border-gray-800">
                <table className="w-full table-fixed text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-gray-800/50">
                      {Object.keys(tableData).map((col) => (
                        <th
                          key={col}
                          className="p-3 border-b border-slate-100 dark:border-gray-800 text-slate-500 dark:text-slate-400 font-black uppercase tracking-tighter"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-slate-700 dark:text-slate-300">
                      <td className="p-3 font-bold text-indigo-600 truncate">
                        {tableData.name}
                      </td>
                      <td className="p-3">{tableData.type}</td>
                      <td className="p-3 font-mono">{tableData.price}</td>
                      <td className="p-3 font-mono">{tableData.stock}</td>
                      <td className="p-3 italic text-slate-400 truncate">
                        {tableData.description}
                      </td>
                      <td className="p-3">{tableData.height}</td>
                      <td className="p-3">{tableData.width}</td>
                      <td className="p-3">{tableData.weight}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 📱 Tablet/Mobile View: Grid-based "Card" Table (Always visible without scrolling) */}
              <div className="xl:hidden grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(tableData).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-4 bg-slate-50 dark:bg-gray-800/40 rounded-2xl border border-slate-100 dark:border-gray-700"
                  >
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                      {key}
                    </p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-[11px] text-slate-400 font-medium italic flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Dimensions traitées en unités SI (mm/kg)
              </p>
            </motion.div>

            {/* 🔹 SIDEBAR INFO */}
            <div className="space-y-6">
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-slate-200 dark:border-gray-800 shadow-sm"
              >
                <h3 className="font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Entités système
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {["material", "composite", "service"].map((type) => (
                    <div
                      key={type}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800/50 rounded-xl border border-transparent hover:border-indigo-200 transition-all"
                    >
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">
                        {type}
                      </span>
                      <ChevronRight size={12} className="text-slate-300" />
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-slate-900 dark:bg-indigo-950 p-6 rounded-[2rem] shadow-xl text-white"
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="text-rose-400" size={18} />
                  <h3 className="font-bold text-sm">Contraintes</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Clés sensibles à la casse",
                    "Aucun symbole de devise",
                    "Types d'entités valides",
                  ].map((note, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-1 h-1 rounded-full bg-rose-400" />
                      <span className="text-[11px] font-medium text-slate-300">
                        {note}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProductsGuide;
