import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";
import {
  Download,
  Menu,
  Search,
  CheckCircle2,
  Receipt,
  ShoppingCart,
  Wallet,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import CompanySidebar from "./CompanySidebar";

import { useClientOrderStore } from "../store/clientOrderStore";
import { useInvoiceStore } from "../store/invoiceStore";
import { useSupplierOrderStore } from "../store/supplierOrderStore";
import { useSupplierInvoiceStore } from "../store/supplierInvoiceStore";

/* ================= PAGINATION HOOK ================= */

const usePagination = (data, pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever data changes (e.g. search filter)
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  const paginatedData = useMemo(
    () => data.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [data, currentPage, pageSize]
  );

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return { paginatedData, currentPage, totalPages, goToPage };
};

/* ================= PAGINATION CONTROLS ================= */

const Pagination = ({ currentPage, totalPages, goToPage, totalItems }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i);
      }
    }

    // Insert ellipsis
    const withEllipsis = [];
    for (let i = 0; i < pages.length; i++) {
      if (i > 0 && pages[i] - pages[i - 1] > 1) {
        withEllipsis.push("...");
      }
      withEllipsis.push(pages[i]);
    }

    return withEllipsis;
  };

  return (
    <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/30 dark:bg-slate-800/20">
      {/* Info */}
      <p className="text-xs font-semibold text-gray-400 dark:text-slate-500">
        Page{" "}
        <span className="text-gray-700 dark:text-slate-300">{currentPage}</span>{" "}
        sur{" "}
        <span className="text-gray-700 dark:text-slate-300">{totalPages}</span>{" "}
        &mdash;{" "}
        <span className="text-gray-700 dark:text-slate-300">{totalItems}</span>{" "}
        transaction{totalItems !== 1 ? "s" : ""}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:border-indigo-500/30 dark:hover:text-indigo-400 disabled:opacity-40 disabled:pointer-events-none transition-all"
        >
          <ChevronLeft size={15} />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-8 h-8 flex items-center justify-center text-xs text-gray-400 dark:text-slate-500"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all border ${
                page === currentPage
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30"
                  : "border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:border-indigo-500/30 dark:hover:text-indigo-400"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:border-indigo-500/30 dark:hover:text-indigo-400 disabled:opacity-40 disabled:pointer-events-none transition-all"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

const PaidTransactions = () => {
  /* ================= SALES ================= */
  const {
    orders: clientOrders,
    fetchOrders: fetchClientOrders,
  } = useClientOrderStore();

  const { invoices, fetchInvoices } = useInvoiceStore();

  /* ================= PURCHASES ================= */
  const {
    orders: supplierOrders,
    fetchOrders: fetchSupplierOrders,
  } = useSupplierOrderStore();

  const {
    invoices: supplierInvoices,
    fetchInvoices: fetchSupplierInvoices,
  } = useSupplierInvoiceStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchClientOrders();
    fetchInvoices();
    fetchSupplierOrders();
    fetchSupplierInvoices();
  }, []);

  /* ================= FILTER ONLY PAID ================= */

  const paidClientOrders = useMemo(
    () =>
      clientOrders.filter(
        (order) =>
          order.isPaid &&
          !order.isCanceled &&
          (order.orderNumber
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
            order.customer?.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()))
      ),
    [clientOrders, searchQuery]
  );

  const paidInvoices = useMemo(
    () =>
      invoices.filter(
        (invoice) =>
          invoice.isPaid &&
          (invoice.invoiceNumber
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
            invoice.customer?.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()))
      ),
    [invoices, searchQuery]
  );

  const paidSupplierOrders = useMemo(
    () =>
      supplierOrders.filter(
        (order) =>
          order.isPaid &&
          (order.orderNumber
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
            order.supplier?.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()))
      ),
    [supplierOrders, searchQuery]
  );

  const paidSupplierInvoices = useMemo(
    () =>
      supplierInvoices.filter(
        (invoice) =>
          invoice.isPaid &&
          (invoice.invoiceNumber
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
            invoice.supplier?.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()))
      ),
    [supplierInvoices, searchQuery]
  );

  /* ================= TOTALS ================= */

  const totalPaidTransactions =
    paidClientOrders.length +
    paidInvoices.length +
    paidSupplierOrders.length +
    paidSupplierInvoices.length;

  const totalAmount = [
    ...paidClientOrders,
    ...paidInvoices,
    ...paidSupplierOrders,
    ...paidSupplierInvoices,
  ].reduce((acc, item) => acc + (item.netPay || 0), 0);

  /* ================= EXCEL EXPORT ================= */

  const exportToExcel = (data, fileName, type) => {
    const mappedData = data.map((item) => {
      if (type === "sales-orders") {
        return {
          Commande: item.orderNumber,
          Client: item.customer?.name || "-",
          Date: new Date(item.date).toLocaleDateString(),
          Montant: item.netPay,
          Statut: item.isPaid ? "Payée" : "Non payée",
        };
      }
      if (type === "sales-invoices") {
        return {
          Facture: item.invoiceNumber,
          Client: item.customer?.name || "-",
          Date: new Date(item.date).toLocaleDateString(),
          Montant: item.netPay,
          Statut: item.isPaid ? "Payée" : "Non payée",
        };
      }
      if (type === "purchase-orders") {
        return {
          Commande: item.orderNumber,
          Fournisseur: item.supplier?.name || "-",
          Date: new Date(item.date).toLocaleDateString(),
          Montant: item.netPay,
          Statut: item.isPaid ? "Payée" : "Non payée",
        };
      }
      if (type === "purchase-invoices") {
        return {
          Facture: item.invoiceNumber,
          Fournisseur: item.supplier?.name || "-",
          Date: new Date(item.date).toLocaleDateString(),
          Montant: item.netPay,
          Statut: item.isPaid ? "Payée" : "Non payée",
        };
      }
      return {};
    });

    const worksheet = XLSX.utils.json_to_sheet(mappedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(fileData, `${fileName}.xlsx`);
  };

  /* ================= TABLE COMPONENT ================= */

  const TableSection = ({
    title,
    data,
    exportType,
    exportName,
    isSupplier = false,
    isInvoice = false,
    icon,
    pageSize = 10,
  }) => {
    const { paginatedData, currentPage, totalPages, goToPage } = usePagination(
      data,
      pageSize
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden"
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-50 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-50/30 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              {icon}
            </div>

            <div>
              <h2 className="text-sm lg:text-base font-black text-gray-900 dark:text-white tracking-tight">
                {title}
              </h2>

              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 font-bold mt-1">
                {data.length} transactions payées
              </p>
            </div>
          </div>

          <button
            onClick={() => exportToExcel(data, exportName, exportType)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all shadow-lg shadow-emerald-100 dark:shadow-none"
          >
            <Download size={17} />
            Export Excel
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 font-black">
                  {isInvoice ? "Facture" : "Commande"}
                </th>

                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 font-black">
                  {isSupplier ? "Fournisseur" : "Client"}
                </th>

                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 font-black">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 font-black">
                  Montant
                </th>

                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 font-black">
                  Statut
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {isInvoice ? item.invoiceNumber : item.orderNumber}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="text-sm font-medium text-gray-600 dark:text-slate-300">
                      {isSupplier
                        ? item.supplier?.name || "-"
                        : item.customer?.name || "-"}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-gray-500 dark:text-slate-400">
                    {new Date(item.date).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-sm font-black text-gray-900 dark:text-white">
                      {item.netPay?.toLocaleString()} TND
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <CheckCircle2 size={12} />
                      Payée
                    </span>
                  </td>
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Receipt
                        size={34}
                        className="text-gray-300 dark:text-slate-700"
                      />
                      <p className="mt-3 text-sm font-bold text-gray-400 dark:text-slate-500 italic">
                        Aucun paiement trouvé
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          totalItems={data.length}
        />
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950 transition-colors duration-300">
      {/* SIDEBAR */}
      <CompanySidebar
        activeItem="Transactions"
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
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
                Transactions Payées
              </h1>

              <p className="hidden sm:block text-xs text-gray-500 dark:text-slate-400 font-medium tracking-tight">
                Historique des ventes et achats réglés
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative hidden md:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
              size={16}
            />

            <input
              type="text"
              placeholder="Rechercher une transaction..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500/20 outline-none w-72 transition-all"
            />
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-4 lg:p-8 max-w-[1700px] mx-auto w-full space-y-6 lg:space-y-8">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
            <StatCard
              title="Transactions payées"
              value={totalPaidTransactions}
              icon={<Wallet className="text-indigo-600 dark:text-indigo-400" />}
              color="bg-indigo-50 dark:bg-indigo-500/10"
              trend="Toutes catégories"
            />

            <StatCard
              title="Commandes clients"
              value={paidClientOrders.length}
              icon={
                <ShoppingCart className="text-emerald-600 dark:text-emerald-400" />
              }
              color="bg-emerald-50 dark:bg-emerald-500/10"
              trend="Ventes"
            />

            <StatCard
              title="Factures"
              value={paidInvoices.length + paidSupplierInvoices.length}
              icon={
                <FileText className="text-amber-600 dark:text-amber-400" />
              }
              color="bg-amber-50 dark:bg-amber-500/10"
              trend="Documents payés"
            />

            <StatCard
              title="Montant total"
              value={`${totalAmount.toLocaleString()} TND`}
              icon={<Receipt className="text-blue-600 dark:text-blue-400" />}
              color="bg-blue-50 dark:bg-blue-500/10"
              trend="Encaissements"
            />
          </div>

          {/* SALES ORDERS */}
          <TableSection
            title="Commandes Clients Payées"
            data={paidClientOrders}
            exportType="sales-orders"
            exportName="commandes-clients-payees"
            icon={<ShoppingCart size={20} />}
            pageSize={10}
          />

          {/* SALES INVOICES */}
          <TableSection
            title="Factures de Vente Payées"
            data={paidInvoices}
            exportType="sales-invoices"
            exportName="factures-vente-payees"
            isInvoice
            icon={<FileText size={20} />}
            pageSize={10}
          />

          {/* PURCHASE ORDERS */}
          <TableSection
            title="Commandes Fournisseurs Payées"
            data={paidSupplierOrders}
            exportType="purchase-orders"
            exportName="commandes-fournisseurs-payees"
            isSupplier
            icon={<ShoppingCart size={20} />}
            pageSize={10}
          />

          {/* PURCHASE INVOICES */}
          <TableSection
            title="Factures d'Achat Payées"
            data={paidSupplierInvoices}
            exportType="purchase-invoices"
            exportName="factures-achat-payees"
            isSupplier
            isInvoice
            icon={<FileText size={20} />}
            pageSize={10}
          />
        </div>
      </main>
    </div>
  );
};

/* ================= STAT CARD ================= */

const StatCard = ({ title, value, icon, color, trend }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white dark:bg-slate-900 p-5 lg:p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-start gap-4 transition-all"
  >
    <div className={`p-3.5 rounded-2xl ${color} shrink-0`}>{icon}</div>

    <div className="min-w-0">
      <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 mb-1 truncate uppercase tracking-widest">
        {title}
      </p>

      <h3 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-white tracking-tight truncate">
        {value}
      </h3>

      <div className="mt-2 text-[10px] font-bold text-gray-500 dark:text-slate-400 flex items-center gap-1 uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
        {trend}
      </div>
    </div>
  </motion.div>
);

export default PaidTransactions;