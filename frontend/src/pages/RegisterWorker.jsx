import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader,
  Lock,
  Mail,
  User,
  CheckCircle,
  Menu,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import CompanySidebar from "../companyPages/CompanySidebar";


const RegisterWorker = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [success, setSuccess] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const { createUser, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await createUser(email, password, name, role);

      setSuccess("User created successfully 🎉");

      setName("");
      setEmail("");
      setPassword("");
      setRole("buyer");

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950 transition-colors duration-300">
      
      {/* Sidebar */}
      <CompanySidebar
        activeItem="Utilisateurs"
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu size={24} />
            </button>

            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                Gestion des utilisateurs
              </h1>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Créer et gérer les utilisateurs de l'entreprise
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 lg:p-8 max-w-3xl mx-auto w-full space-y-6">

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-50 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white">
                <Plus size={18} />
              </div>
              <h2 className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-widest">
                Créer un nouvel utilisateur
              </h2>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={handleSignUp} className="space-y-5">

                {/* Name */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                    Nom complet
                  </label>
                  <Input
                    icon={User}
                    type="text"
                    placeholder="Entrez le nom complet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                    Adresse e-mail
                  </label>
                  <Input
                    icon={Mail}
                    type="email"
                    placeholder="Entrez l'email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                    Mot de passe
                  </label>
                  <Input
                    icon={Lock}
                    type="password"
                    placeholder="Entrez le mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                    Rôle de l'utilisateur
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full mt-1 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl py-3 px-4 text-sm font-medium text-gray-900 dark:text-slate-100 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  >
                    <option value="buyer">Acheteur</option>
                    <option value="seller">Vendeur</option>
                    <option value="hr">RH</option>
                    <option value="asm">Responsable service ADSL</option>
                    <option value="tsm">Responsable service technique</option>
                  </select>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-red-500 text-sm font-semibold">
                    {error}
                  </p>
                )}

                {/* Success */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-2 rounded-xl"
                  >
                    <CheckCircle size={18} />
                    <span className="text-sm font-medium">{success}</span>
                  </motion.div>
                )}

                <PasswordStrengthMeter password={password} />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-900 dark:bg-indigo-600 text-white py-3.5 rounded-2xl font-bold hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Plus size={18} />
                      Créer l'utilisateur
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default RegisterWorker;