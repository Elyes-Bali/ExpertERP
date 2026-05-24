import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Layers, 
  LineChart,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const AboutPage = () => {
  const coreModules = [
    {
      title: "Personnel et Paie",
      icon: <Users className="text-blue-600" size={24} />,
      description: "Gérez des dossiers complets du personnel et des flux automatisés de paiement des salaires avec une transparence financière intégrée.",
      features: ["Dossiers du personnel", "Décaissement intelligent", "Historique des transactions"]
    },
    {
      title: "Écosystème financier",
      icon: <LineChart className="text-emerald-600" size={24} />,
      description: "Un hub centralisé pour la gestion multi-comptes, le suivi de liquidité en temps réel et les rapports financiers automatisés.",
      features: ["Gestion multi-comptes", "Liquidité en temps réel", "Synthèses financières"]
    }
  ];

  const philosophy = [
    {
      title: "Excellence Frontend",
      detail: "React & Tailwind CSS pour une interface utilisateur haute fidélité et accessible.",
      icon: <Cpu size={20} />
    },
    {
      title: "Gestion d’état",
      detail: "Stores haute performance garantissant la cohérence des données.",
      icon: <Layers size={20} />
    },
    {
      title: "Animations significatives",
      detail: "Framer Motion pour des interactions et retours premium.",
      icon: <Sparkles size={20} />
    }
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900/40 dark:selection:text-blue-100">
  
  {/* Hero Section */}
  <header className="relative py-24 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
    
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none text-slate-900 dark:text-slate-100">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>

    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto px-6 relative z-10 text-center"
    >
      <motion.div
        variants={itemVariants}
        className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-8 border border-blue-100 dark:border-blue-800"
      >
        <Zap size={14} className="fill-current" />
        <span>Excellence d’entreprise</span>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tight"
      >
        La puissance de <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          EXPERT ERP
        </span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10"
      >
        Un écosystème haute performance conçu pour combler le fossé entre la logique métier complexe et les expériences numériques intuitives.
      </motion.p>

      <motion.div variants={itemVariants} className="flex justify-center items-center space-x-4">
        <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/20 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center group">
          Commencer
          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </motion.div>
  </header>

  <main className="max-w-6xl mx-auto px-6 py-24 space-y-32">

    {/* Project Vision */}
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="grid md:grid-cols-2 gap-16 items-center"
    >
      <motion.div variants={itemVariants} className="space-y-8">
        <div className="inline-flex p-4 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-200 dark:shadow-blue-900/30">
          <Target size={32} />
        </div>

        <h2 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight">
          Précision dans chaque processus.
        </h2>

        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
          <strong className="text-slate-900 dark:text-white font-semibold">EXPERT ERP</strong> est plus qu’un simple logiciel de gestion...
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="relative bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-black/40"
      >
        <div className="space-y-6">
          <motion.div initial={{ width: 0 }} whileInView={{ width: "40%" }} className="h-4 bg-blue-100 dark:bg-blue-900/40 rounded-full" />
          <motion.div initial={{ width: 0 }} whileInView={{ width: "90%" }} className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full" />
          <motion.div initial={{ width: 0 }} whileInView={{ width: "70%" }} className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full" />

          <div className="pt-6 grid grid-cols-2 gap-6">
            <div className="h-24 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800 flex flex-col justify-center px-6">
              <span className="text-blue-600 dark:text-blue-300 font-black text-2xl">Temps réel</span>
              <span className="text-blue-400 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-1">Analytique</span>
            </div>

            <div className="h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800 flex flex-col justify-center px-6">
              <span className="text-emerald-600 dark:text-emerald-300 font-black text-2xl">Sécurisé</span>
              <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mt-1">Protocoles</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>

    {/* Core Modules */}
    <section className="space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
          Modules entreprise
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Conçus pour la fiabilité. Pensés pour la croissance.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {coreModules.map((module, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:border-blue-200 dark:hover:border-blue-700 transition-all hover:shadow-2xl hover:shadow-blue-50/20 dark:hover:shadow-black/40 group"
          >
            <div className="mb-8 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800 w-fit group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              {module.icon}
            </div>

            <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              {module.title}
            </h3>

            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              {module.description}
            </p>

            <ul className="space-y-4">
              {module.features.map((feat, fIdx) => (
                <li key={fIdx} className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <ChevronRight size={14} className="text-blue-500" />
                  </div>
                  {feat}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Philosophy */}
    <motion.section
      className="bg-slate-900 dark:bg-black rounded-[4rem] p-16 text-white relative overflow-hidden"
    >
      <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20" />
      <div className="absolute left-0 bottom-0 w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-10" />

      <div className="relative z-10 grid lg:grid-cols-3 gap-16">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Philosophie technique</h2>
          <p className="text-slate-400">
            Nous croyons que les logiciels doivent être puissants et agréables.
          </p>
        </div>

        <div className="lg:col-span-2 grid sm:grid-cols-3 gap-10">
          {philosophy.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="space-y-4 p-4 rounded-2xl hover:bg-white/5 transition-colors"
            >
              <div className="text-blue-400">{item.icon}</div>
              <h4 className="font-bold text-lg">{item.title}</h4>
              <p className="text-sm text-slate-400">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>

  </main>

  {/* Footer */}
  <footer className="py-16 border-t border-slate-200 dark:border-slate-800 text-center bg-white dark:bg-slate-950">
    <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">
      © 2026 EXPERT ERP SYSTEMS • INTELLIGENCE CONÇUE
    </p>
  </footer>
</div>
  );
};

export default AboutPage;