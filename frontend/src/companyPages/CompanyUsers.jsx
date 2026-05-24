import React, { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
import {
  Users,
  Mail,
  Shield,
  Phone,
  Menu,
  Search,
  AlertCircle,
  Trash2,
} from "lucide-react";
import CompanySidebar from "./CompanySidebar";

const CompanyUsers = () => {
  const { fetchCompanyUsers, deleteUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // search + pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchCompanyUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // filtering
  const filteredUsers = useMemo(
    () =>
      users.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [users, searchQuery],
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  return (
<div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950 transition-colors duration-300">
  {/* Sidebar */}
  <CompanySidebar
    activeItem="Utilisateurs"
    isOpen={isSidebarOpen}
    setIsOpen={setIsSidebarOpen}
  />

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
            Utilisateurs de l'entreprise
          </h1>
          <p className="hidden sm:block text-xs text-gray-500 dark:text-slate-400 font-medium">
            Gérez les membres de votre équipe et leurs rôles
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative hidden md:block">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
          size={16}
        />
        <input
          type="text"
          placeholder="Rechercher des utilisateurs..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 outline-none w-64 transition-all"
        />
      </div>
    </header>

    {/* Content */}
    <div className="p-4 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200">
            Membres de l'équipe
          </h3>

          <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest px-3 py-1 bg-gray-50 dark:bg-slate-800 rounded-full border border-gray-100 dark:border-slate-700">
            {filteredUsers.length} Utilisateurs
          </span>
        </div>

        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/30 dark:bg-slate-800/30">
              <AlertCircle
                size={32}
                className="text-gray-300 dark:text-slate-700"
              />
              <p className="mt-2 text-sm font-bold text-gray-400 dark:text-slate-600 italic">
                Aucun utilisateur trouvé
              </p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Téléphone</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((u) => (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition"
                  >
                    {/* User */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-indigo-600">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {u.name}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-500 dark:text-slate-400 flex items-center gap-2">
                      <Mail size={14} />
                      {u.email}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                      {u.phone ? (
                        <div className="flex items-center gap-2">
                          <Phone size={14} />
                          {u.phone}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4 text-gray-700 dark:text-slate-300 font-medium">
                      {u.role}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                          u.isVerified
                            ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                            : "bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-500"
                        }`}
                      >
                        {u.isVerified ? "Vérifié" : "Non vérifié"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={async () => {
                          if (
                            !confirm(
                              "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
                            )
                          )
                            return;

                          await deleteUser(u._id);
                          await loadUsers(); // refresh table
                        }}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4">
            <p className="text-xs text-gray-400 dark:text-slate-500">
              Page {currentPage} sur {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded text-gray-900 dark:text-white"
              >
                Précédent
              </button>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="px-3 py-1 rounded text-gray-900 dark:text-white"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  </main>
</div>
  );
};

export default CompanyUsers;
