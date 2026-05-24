import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, UserCheck } from 'lucide-react';
import NavBar from '../components/NavBar';

const PRIVACY_POLICY_CONTENT = {
  title: "Politique de confidentialité",
  lastUpdated: "11 avril 2026",
  sections: [
    {
      id: "info-collect",
      icon: FileText,
      title: "1. Informations que nous collectons",
      items: [
        {
          title: "1.1 Informations que vous fournissez",
          text:
            "Lorsque vous créez un compte dans ERY, nous collectons des informations telles que votre adresse e-mail, votre mot de passe (haché de manière sécurisée), les informations de votre entreprise et vos données de profil. Nous collectons également les données financières et comptables que vous saisissez, y compris les comptes bancaires, les transactions, les journaux, les plans comptables, les factures et les enregistrements ERP associés.",
          color: "text-blue-500",
        },
        {
          title: "1.2 Informations collectées automatiquement",
          text:
            "Nous collectons des données techniques telles que l’adresse IP, les informations sur l’appareil, le type de navigateur et l’activité d’utilisation sur la plateforme (par exemple : comptes créés, enregistrements modifiés et modules consultés) afin d’améliorer les performances et la sécurité.",
          color: "text-blue-500",
        },
      ],
    },
    {
      id: "info-use",
      icon: UserCheck,
      title: "2. Comment nous utilisons vos informations",
      items: [
        {
          title: "Fournir les services ERP",
          text:
            "Pour gérer vos comptes financiers, écritures comptables, données bancaires, factures, rapports et toutes les fonctionnalités principales de la plateforme ERP ERY.",
          color: "text-green-500",
        },
        {
          title: "Amélioration du système",
          text:
            "Pour améliorer les performances, la fiabilité et l’expérience utilisateur dans les modules de comptabilité, trésorerie et gestion.",
          color: "text-green-500",
        },
        {
          title: "Sécurité et communication",
          text:
            "Pour détecter les fraudes, empêcher les accès non autorisés, garantir l’intégrité des données et envoyer des notifications ou mises à jour importantes du système.",
          color: "text-green-500",
        },
      ],
    },
    {
      id: "data-processing",
      icon: Shield,
      title: "3. Traitement des données d’entreprise",
      items: [
        {
          title: "Isolation des données",
          text:
            "Les données de votre entreprise sont strictement isolées et ne sont pas partagées avec d’autres utilisateurs. Chaque organisation fonctionne dans un environnement sécurisé et séparé.",
          color: "text-purple-500",
        },
        {
          title: "Traitement interne uniquement",
          text:
            "Toutes les données financières et comptables sont traitées uniquement au sein du système ERY afin de fournir des fonctionnalités ERP telles que les rapports, les analyses et la comptabilité.",
          color: "text-purple-500",
        },
      ],
    },
    {
      id: "data-sharing",
      icon: Lock,
      title: "4. Partage et divulgation des données",
      items: [
        {
          title: "Fournisseurs de services",
          text:
            "Nous pouvons utiliser des fournisseurs tiers de confiance (hébergement cloud, bases de données, sauvegardes) qui sont liés par des accords stricts de confidentialité et de sécurité.",
          color: "text-red-500",
        },
        {
          title: "Exigences légales",
          text:
            "Nous pouvons divulguer des informations si la loi l’exige ou pour répondre à des procédures juridiques ou des demandes gouvernementales.",
          color: "text-red-500",
        },
        {
          title: "Transferts d’entreprise",
          text:
            "En cas de fusion, acquisition ou restructuration, vos données peuvent être transférées dans le cadre des actifs de l’entreprise sous les mêmes normes de protection.",
          color: "text-red-500",
        },
      ],
    },
    {
      id: "retention-rights",
      icon: Lock,
      title: "5. Sécurité des données, conservation et vos droits",
      items: [
        {
          title: "Sécurité et conservation des données",
          text:
            "Nous utilisons le chiffrement, des serveurs sécurisés et des systèmes de contrôle d’accès pour protéger vos données. Les données sont conservées uniquement le temps nécessaire pour fournir le service ou respecter les obligations légales.",
          color: "text-yellow-500",
        },
        {
          title: "Vos droits",
          text:
            "Vous pouvez accéder, mettre à jour, exporter ou demander la suppression de vos données à tout moment, sous réserve des exigences légales et comptables de conservation.",
          color: "text-yellow-500",
        },
      ],
    },
  ],
};

const PolicySection = ({ section, index }) => {
  const SectionIcon = section.icon;

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.2 + index * 0.1 },
    },
  };

  return (
<motion.div
  variants={sectionVariants}
  className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg dark:shadow-black/40 hover:shadow-2xl transition-shadow duration-300 border border-gray-100 dark:border-slate-800"
>
  <div className="flex items-center mb-6">
    <SectionIcon className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-4" />

    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
      {section.title}
    </h2>
  </div>

  <div className="space-y-6 border-l-4 border-purple-200 dark:border-purple-900 pl-6">
    {section.items.map((item, itemIndex) => (
      <motion.div
        key={itemIndex}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1 + itemIndex * 0.05,
        }}
        className="relative"
      >
        <div
          className={`absolute -left-9 top-1 w-4 h-4 rounded-full ${item.color.replace(
            "text-",
            "bg-"
          )} ring-4 ring-white dark:ring-slate-900`}
        />

        <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">
          {item.title}
        </h3>

        <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-base">
          {item.text}
        </p>
      </motion.div>
    ))}
  </div>
</motion.div>
  );
};

const PrivacyPolicyPage = () => {
  return (
 <>
  <NavBar />

  <div className="min-h-screen p-4 sm:p-10 font-sans bg-gray-50 dark:bg-slate-950">
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-16 mb-12 bg-white dark:bg-slate-900 rounded-xl shadow-xl dark:shadow-black/40 border-t-4 border-purple-600 dark:border-purple-500"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
          {PRIVACY_POLICY_CONTENT.title}
        </h1>

        <p className="text-md text-gray-500 dark:text-slate-400 font-medium">
          Dernière mise à jour : {PRIVACY_POLICY_CONTENT.lastUpdated}
        </p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-gray-700 dark:text-slate-300 max-w-3xl mx-auto px-4"
        >
          Cette politique de confidentialité explique comment ERY collecte, utilise et protège
          vos données professionnelles, comptables et financières lors de l’utilisation de notre
          plateforme ERP.
        </motion.p>
      </motion.header>

      {/* Sections */}
      <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {PRIVACY_POLICY_CONTENT.sections.map((section, index) => (
          <PolicySection
            key={section.id}
            section={section}
            index={index}
          />
        ))}
      </motion.div>

      {/* Footer */}
      <footer className="text-center mt-16 text-gray-500 dark:text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} EXPERT ERP. Tous droits réservés.
      </footer>

    </div>
  </div>
</>
  );
};

export default PrivacyPolicyPage;