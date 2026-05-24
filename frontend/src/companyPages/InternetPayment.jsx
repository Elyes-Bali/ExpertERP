import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Menu, Search, Plus, Trash2 } from "lucide-react";

import { useInternetPaymentStore } from "../store/useInternetPaymentStore";
import { useInternetClientStore } from "../store/internetClientStore";
import { useContractTypeStore } from "../store/contractTypeStore";
import CompanySidebar from "./CompanySidebar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const InternetPayment = () => {
  const {
    payments,
    history,
    fetchPayments,
    fetchClientHistory,
    createPayment,
    downloadPaymentPDF,
    deletePayment,
  } = useInternetPaymentStore();

  const { internetClients, fetchInternetClients } = useInternetClientStore();

  const { contractTypes, fetchContractTypes } = useContractTypeStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const clientDropdownRef = useRef(null);

  const [form, setForm] = useState({
    client: "",
    contractType: "",
    contractCode: "",
    month: "",
    year: "",
    paidPrice: "",
    notes: "",
  });

  useEffect(() => {
    fetchPayments();
    fetchInternetClients();
    fetchContractTypes();
  }, []);

  const handleClientChange = async (clientId) => {
    setForm({
      client: clientId,
      contractType: "",
      contractCode: "",
      month: "",
      year: "",
      paidPrice: "",
      notes: "",
    });

    if (!clientId) return;

    const history = await fetchClientHistory(clientId);

    if (history && history.length > 0) {
      const lastPayment = history[0];

      setForm((prev) => ({
        ...prev,
        contractType: lastPayment.contractType?._id || "",
        contractCode: lastPayment.contractCode || "",
        paidPrice: lastPayment.paidPrice || "",
      }));
    }
  };

  const handleContractChange = (contractId) => {
    const contract = contractTypes.find((c) => c._id === contractId);

    setForm({
      ...form,
      contractType: contractId,
      paidPrice: contract ? contract.price : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPayment = await createPayment(form);

    // 🔥 refresh history if same client is selected
    if (form.client) {
      await fetchClientHistory(form.client);
    }

    setForm({
      client: "",
      contractType: "",
      contractCode: "",
      month: "",
      year: "",
      paidPrice: "",
      notes: "",
    });
  };

  const filteredPayments = payments.filter((p) => {
    const query = searchQuery.trim().toLowerCase();

    const clientName = p.client?.name?.toLowerCase() || "";
    const contractCode = p.contractCode?.toLowerCase() || "";

    return clientName.includes(query) || contractCode.includes(query);
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / rowsPerPage),
  );

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        clientDropdownRef.current &&
        !clientDropdownRef.current.contains(event.target)
      ) {
        setShowClientDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const exportToExcel = () => {
    const data = filteredPayments.map((p) => ({
      Client: p.client?.name || "",
      "Contract Code": p.contractCode || "",
      "Plan (Mbps)": p.contractType?.value || "",
      Month: p.month,
      Year: p.year,
      Price: p.paidPrice,
      "Payment Date": p.paymentDate
        ? new Date(p.paymentDate).toLocaleString()
        : "",
      Notes: p.notes || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, `internet-payments.xlsx`);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors antialiased">
      {/* SIDEBAR */}
      <CompanySidebar
        activeItem="Internet Payments"
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Paiements Internet
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Gérer les abonnements et la facturation des clients
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-xl px-3.5 py-2 w-72 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
            <Search
              size={18}
              className="text-slate-400 dark:text-slate-500 flex-shrink-0"
            />
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Rechercher un client..."
              className="bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none w-full"
            />
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-6xl mx-auto w-full space-y-8">
          {/* TOP GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FORM */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden h-fit">
              <div className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2.5 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Plus size={18} />
                </div>
                <h2 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200">
                  Créer un paiement
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="relative" ref={clientDropdownRef}>
                  {/* SEARCH INPUT */}
                  <input
                    value={clientSearch}
                    onChange={(e) => {
                      setClientSearch(e.target.value);
                      setShowClientDropdown(true);
                    }}
                    onFocus={() => setShowClientDropdown(true)}
                    placeholder="Rechercher un client..."
                    className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />

                  {/* SELECTED CLIENT LABEL */}
                  {form.client && !clientSearch && (
                    <div className="mt-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 pl-1">
                      Sélectionné :{" "}
                      <span className="font-semibold">
                        {
                          internetClients.find((c) => c._id === form.client)
                            ?.name
                        }
                      </span>
                    </div>
                  )}

                  {/* DROPDOWN */}
                  {showClientDropdown && (
                    <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl max-h-60 overflow-y-auto shadow-xl ring-1 ring-black/5 dark:ring-white/5 divide-y divide-slate-100 dark:divide-slate-800">
                      {internetClients
                        .filter((c) =>
                          c.name
                            .toLowerCase()
                            .includes(clientSearch.toLowerCase()),
                        )
                        .map((c) => (
                          <div
                            key={c._id}
                            onClick={() => {
                              handleClientChange(c._id);
                              setClientSearch(c.name);
                              setShowClientDropdown(false);
                            }}
                            className="p-3 text-sm text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                          >
                            {c.name}
                          </div>
                        ))}

                      {internetClients.filter((c) =>
                        c.name
                          .toLowerCase()
                          .includes(clientSearch.toLowerCase()),
                      ).length === 0 && (
                        <div className="p-3 text-slate-400 dark:text-slate-500 text-sm italic">
                          Aucun client trouvé
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <select
                  value={form.contractType}
                  onChange={(e) => handleContractChange(e.target.value)}
                  className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="">Sélectionner un contrat</option>
                  {contractTypes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.value} Mbps - {c.price} TND
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Code du contrat"
                  value={form.contractCode}
                  onChange={(e) =>
                    setForm({ ...form, contractCode: e.target.value })
                  }
                  className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />

                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Mois"
                    value={form.month}
                    onChange={(e) =>
                      setForm({ ...form, month: e.target.value })
                    }
                    className="w-1/2 p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />

                  <input
                    type="number"
                    placeholder="Année"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className="w-1/2 p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                <input
                  type="number"
                  placeholder="Prix payé"
                  value={form.paidPrice}
                  onChange={(e) =>
                    setForm({ ...form, paidPrice: e.target.value })
                  }
                  className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />

                <textarea
                  placeholder="Notes"
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                />

                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium text-sm transition-all shadow-sm shadow-indigo-500/10">
                  Créer le paiement
                </button>
              </form>
            </div>

            {/* HISTORY TABLE */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-800/10">
                  <h3 className="font-bold text-slate-800 dark:text-white text-base tracking-tight">
                    Historique client
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase border-b border-slate-200/60 dark:border-slate-800/60">
                        <th className="p-4 text-left tracking-wider">Client</th>
                        <th className="p-4 text-left tracking-wider">Plan</th>
                        <th className="p-4 text-left tracking-wider">Date</th>
                        <th className="p-4 text-left tracking-wider">Prix</th>
                        <th className="p-4 text-left tracking-wider">
                          Date de paiement
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {history.map((p) => (
                        <tr
                          key={p._id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                        >
                          <td className="p-4 font-semibold text-slate-900 dark:text-white">
                            {p.client?.name}
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                            <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs font-mono">
                              {p.contractType?.value} Mbps
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">
                            {p.month}/{p.year}
                          </td>
                          <td className="p-4 text-slate-900 dark:text-slate-100 font-mono font-semibold">
                            {p.paidPrice} TND
                          </td>
                          <td className="p-4 text-slate-900 dark:text-slate-100 font-mono font-semibold">
                            {p.paymentDate
                              ? new Date(p.paymentDate).toLocaleString([], {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })
                              : "—"}
                          </td>
                        </tr>
                      ))}
                      {history.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-8 text-center text-slate-400 dark:text-slate-500 italic"
                          >
                            Sélectionnez un client pour voir l'historique des
                            transactions
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ALL PAYMENTS TABLE */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-800/10 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white text-base tracking-tight">
                Tous les paiements
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase border-b border-slate-200/60 dark:border-slate-800/60">
                    <th className="p-4 text-left tracking-wider">Client</th>
                    <th className="p-4 text-left tracking-wider">Période</th>
                    <th className="p-4 text-left tracking-wider">Prix</th>
                    <th className="p-4 text-left tracking-wider">PDF</th>
                    <th className="p-4 text-left tracking-wider">Action</th>
                    <th className="p-4 text-left tracking-wider">
                      <button
                        onClick={exportToExcel}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg"
                      >
                        Export Excel
                      </button>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {paginatedPayments.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">
                        {p.client?.name}
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">
                        {p.month}/{p.year}
                      </td>
                      <td className="p-4 text-slate-900 dark:text-slate-100 font-mono font-semibold">
                        {p.paidPrice} TND
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => downloadPaymentPDF(p._id)}
                          className="text-indigo-600 hover:underline text-xs font-semibold"
                        >
                          PDF
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => deletePayment(p._id)}
                          className="text-red-600 hover:underline text-xs font-semibold"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedPayments.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-8 text-center text-slate-400 dark:text-slate-500 italic"
                      >
                        Aucun enregistrement financier ne correspond aux
                        critères actuels
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/20 dark:bg-slate-800/5">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Page {currentPage} sur {totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:pointer-events-none"
                  >
                    Précédent
                  </button>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:pointer-events-none"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InternetPayment;
