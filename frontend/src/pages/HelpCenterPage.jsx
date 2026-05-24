import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Search,
  MessageSquare,
  Mail,
  BookOpen,
  Phone,
  ChevronDown,
  ExternalLink,
  ArrowRight,
  LifeBuoy
} from "lucide-react";

const faqData = [
  {
    q: "Comment créer un profil d'entreprise ?",
    a: "Accédez à Paramètres > Tableau de bord de l'entreprise, puis remplissez les détails de votre société et téléversez votre logo et votre code QR avant de sauvegarder.",
  },
  {
    q: "Pourquoi mon logo ne se met-il pas à jour ?",
    a: "Assurez-vous de téléverser un fichier image valide et de cliquer sur Enregistrer les modifications. Le backend utilise Cloudinary pour stocker les images, la mise à jour peut donc prendre quelques secondes.",
  },
  {
    q: "Comment les factures sont-elles générées ?",
    a: "Les factures sont générées automatiquement en utilisant les paramètres fiscaux de votre entreprise, vos clients et les données de vos produits.",
  },
];

const HelpCenterPage = () => {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const filteredFaq = faqData.filter((f) =>
    f.q.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/40 selection:text-indigo-700">
      
      {/* 🚀 HERO SECTION */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-16 pb-24 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
          <HelpCircle size={600} className="mx-auto" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-8"
          >
            <LifeBuoy size={14} /> Base de connaissances
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6"
          >
            Comment pouvons-nous <span className="text-indigo-600">vous aider</span> aujourd'hui ?
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-w-2xl mx-auto group shadow-2xl shadow-indigo-500/10"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher des articles d'aide, guides et FAQ..."
              className="w-full pl-12 pr-6 py-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
            />
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20">
        {/* 🔗 QUICK LINKS */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { title: "Documentation", desc: "Lire les guides complets du système", icon: <BookOpen className="text-indigo-600" />, color: "indigo" },
            { title: "Communauté", desc: "Poser des questions et partager des idées", icon: <MessageSquare className="text-emerald-500" />, color: "emerald" },
            { title: "Ticket de support", desc: "Contacter le support technique", icon: <Mail className="text-amber-500" />, color: "amber" }
          ].map((link, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="mb-6 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 w-fit group-hover:scale-110 transition-transform">
                {React.cloneElement(link.icon, { size: 28 })}
              </div>
              <h3 className="font-black text-xl mb-2 text-slate-900 dark:text-white">{link.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">{link.desc}</p>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 group-hover:gap-4 transition-all">
                Explorer <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ❓ FAQ SECTION */}
        <div className="py-20 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Questions fréquemment posées</h2>
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {filteredFaq.length} résultats
            </div>
          </div>

          <div className="space-y-4">
            {filteredFaq.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className={`border rounded-3xl transition-all overflow-hidden ${
                  openIndex === index 
                    ? "bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/50 shadow-lg shadow-indigo-500/5" 
                    : "bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`font-bold transition-colors ${openIndex === index ? "text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"}`}>
                    {item.q}
                  </span>
                  <div className={`p-2 rounded-xl transition-all ${openIndex === index ? "bg-indigo-600 text-white rotate-180" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                          {item.a}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 📞 CONTACT SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 p-10 lg:p-14 bg-slate-900 dark:bg-indigo-950/40 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
             <LifeBuoy size={180} className="text-indigo-400" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Vous cherchez encore des réponses ?</h2>
            <p className="text-slate-400 font-medium mb-10 max-w-xl">
              Notre équipe de support dédiée est disponible 24h/24 et 7j/7 pour vous aider avec tout défi technique ou configuration système.
            </p>

            <div className="flex flex-col md:flex-row gap-6">
              {[
                { label: "Appeler le support", val: "+216 24 671 400", icon: <Phone size={20} />, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                { label: "Support par e-mail", val: "adam.thabet36@gmail.com", icon: <Mail size={20} />, color: "text-emerald-400", bg: "bg-emerald-500/10" }
              ].map((contact, i) => (
                <div key={i} className="flex items-center gap-5 p-6 bg-white/5 dark:bg-black/20 backdrop-blur-md rounded-[2rem] border border-white/10 hover:border-white/20 transition-all flex-1 group/item">
                  <div className={`p-4 rounded-2xl ${contact.bg} ${contact.color} group-hover/item:scale-110 transition-transform`}>
                    {contact.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{contact.label}</p>
                    <p className="text-white font-bold tracking-tight">{contact.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 🏁 FOOTER */}
        <div className="pb-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-200 dark:border-slate-800 pt-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <p>© 2026 EXPERT ERP SYSTEMS. Tous droits réservés.</p>
          <div className="flex gap-8">
            <a href="/Privacy-Policy" className="hover:text-indigo-600 transition-colors">Politique de confidentialité</a>
            <a href="/About-us" className="hover:text-indigo-600 transition-colors">À propos</a>
            <a href="#" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">État du système <ExternalLink size={10} /></a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpCenterPage;