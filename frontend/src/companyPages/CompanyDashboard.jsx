import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  LayoutDashboard,
  FileText,
  Package,
  Settings,
  ChevronDown,
  Users,
  ShoppingCart,
  Wallet,
  Globe,
  Phone,
  MapPin,
  Hash,
  ArrowRight,
  UploadCloud,
  X,
  Menu,
} from "lucide-react";
import { useCompanyStore } from "../store/companyStore";
import CompanySidebar from "./CompanySidebar";
import { useCompteStore } from "../store/compteStore";
import { useTaxStore } from "../store/taxStore";
import { useCustomerStore } from "../store/customerStore";
/**
 * MAIN DASHBOARD COMPONENT
 */
const CompanyDashboard = () => {
  const { company, fetchCompany, saveCompany, loading } =
    typeof useCompanyStore !== "undefined"
      ? useCompanyStore()
      : { company: {}, loading: false };

  const [activeTab, setActiveTab] = useState("general");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    taxNumber: "",
    website: "",
    phone: "",
    country: "",
    region: "",
    addressLine: "",
    zipCode: "",
  });
  const { comptes, fetchComptes } = useCompteStore();
  const { vat, fetchVAT } = useTaxStore();
  const { customers, fetchCustomers } = useCustomerStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [qrFile, setQrFile] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);

  useEffect(() => {
    if (fetchCompany) fetchCompany();
  }, []);

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name || "",
        taxNumber: company.taxNumber || "",
        website: company.website || "",
        phone: company.phone || "",
        country: company.address?.country || "",
        region: company.address?.region || "",
        addressLine: company.address?.addressLine || "",
        zipCode: company.address?.zipCode || "",
        image: company.image || "",
        qrImage: company.qrImage || "",
      });
      if (company.image) setPreview(company.image);
      setQrPreview(company.qrImage || null);
    }
  }, [company]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleQrChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setQrFile(file);
    setQrPreview(URL.createObjectURL(file));
  };

  const removeFile = (e) => {
    e.preventDefault();
    setFile(null);
    setPreview(null);
  };

  const removeQr = (e) => {
    e.preventDefault();
    setQrFile(null);
    setQrPreview(null);
  };

  const handleLogoDragOver = (e) => {
    e.preventDefault();
    setIsDraggingLogo(true);
  };

  const handleLogoDragLeave = () => {
    setIsDraggingLogo(false);
  };

  const handleLogoDrop = (e) => {
    e.preventDefault();
    setIsDraggingLogo(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    setQrFile(file);
    setQrPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const { image, qrImage, ...rest } = form;

    Object.keys(rest).forEach((key) => {
      formData.append(key, rest[key]);
    });
    if (file) formData.append("image", file);
    if (qrFile) formData.append("qrImage", qrFile);
    if (saveCompany) await saveCompany(formData);
  };
  useEffect(() => {
    if (fetchCompany) fetchCompany();
    fetchComptes?.();
    fetchVAT?.();
    fetchCustomers?.();
  }, []);

  const totalBalance = comptes?.reduce((sum, c) => {
    return sum + (c.currentBalance || 0);
  }, 0);

  const vatValue = vat?.value ?? vat?.rate ?? vat?.percentage ?? 0;

  const customerCount = customers?.length || 0;
  return (
  <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFE] dark:bg-gray-950 transition-colors duration-300">
      <CompanySidebar
        activeItem="Paramètres"
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 transition-colors">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate">
                Paramètres de l’entreprise
              </h1>
              <p className="hidden sm:block text-xs text-gray-500 dark:text-slate-400 font-medium">
                Gérer le profil de l’organisation et les informations fiscales
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 lg:gap-4">
            <button className="bg-gray-900 dark:bg-indigo-600 text-white px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-medium hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors whitespace-nowrap">
              Voir le profil
            </button>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-6xl mx-auto w-full space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <StatCard
              title="Solde actuel"
              value={`${totalBalance.toLocaleString()} TND`}
              icon={
                <Wallet className="text-emerald-600 dark:text-emerald-400" />
              }
              color="bg-emerald-50 dark:bg-emerald-500/10"
              // trend="+0.0%"
            />

            <StatCard
              title="Taux de TVA actif"
              value={`${vatValue}%`}
              icon={<Hash className="text-amber-600 dark:text-amber-400" />}
              color="bg-amber-50 dark:bg-amber-500/10"
              trend="Standard"
            />

            <StatCard
              title="Nombre total de clients"
              value={customerCount}
              icon={<Users className="text-indigo-600 dark:text-indigo-400" />}
              color="bg-indigo-50 dark:bg-indigo-500/10"
              // trend="No activity"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="flex flex-wrap border-b border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-900/50 p-1.5 lg:p-2">
              {[
                {
                  id: "general",
                  label: "Général",
                  icon: <Building2 size={16} />,
                },
                {
                  id: "address",
                  label: "Localisation",
                  icon: <MapPin size={16} />,
                },
                { id: "tax", label: "Infos fiscales", icon: <Hash size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl text-xs lg:text-sm font-semibold transition-all duration-300 flex-1 sm:flex-none justify-center ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5"
                      : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"
                  >
                    {activeTab === "general" && (
                      <>
                        <div className="flex-shrink-0 relative">
                          <img
                            className="h-28 w-28 rounded-full object-cover ring-4 ring-indigo-500 dark:ring-indigo-600 shadow-xl"
                            src={
                              form.image ||
                              "https://placehold.co/112x112/4F46E5/ffffff?text=User"
                            }
                            alt={`Profile of ${form.name}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/112x112/4F46E5/ffffff?text=User";
                            }}
                          />
                        </div>
                        <InputField
                          label="Nom de l’entreprise"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="ex. Nexus Corp"
                          icon={<Building2 size={18} />}
                        />
                        <InputField
                          label="Site web officiel"
                          name="website"
                          value={form.website}
                          onChange={handleChange}
                          placeholder="https://..."
                          icon={<Globe size={18} />}
                        />
                        <InputField
                          label="Numéro de téléphone"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+216 ..."
                          icon={<Phone size={18} />}
                        />

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">
                            Logo de l’entreprise
                          </label>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            id="logo-upload"
                            accept="image/*"
                          />
                          <label
                            htmlFor="logo-upload"
                            onDragOver={handleLogoDragOver}
                            onDragLeave={handleLogoDragLeave}
                            onDrop={handleLogoDrop}
                            className="relative border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-6 lg:p-8 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-slate-800/30 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group min-h-[160px] lg:min-h-[200px]"
                          >
                            {preview ? (
                              <div className="relative group/preview w-full flex flex-col items-center">
                                <img
                                  src={preview}
                                  alt="Aperçu du logo"
                                  className="max-h-24 lg:max-h-32 object-contain rounded-lg shadow-sm"
                                />
                                <button
                                  onClick={removeFile}
                                  className="absolute -top-3 -right-3 lg:-top-4 lg:-right-4 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-1.5 lg:p-2 rounded-full hover:bg-red-200 dark:hover:bg-red-900/80 transition-colors shadow-sm"
                                >
                                  <X size={14} />
                                </button>
                                <p className="text-xs text-gray-400 dark:text-slate-500 mt-4">
                                  Cliquer pour modifier l’image
                                </p>
                              </div>
                            ) : (
                              <>
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-gray-400 dark:text-slate-400 mb-3 group-hover:scale-110 transition-transform">
                                  <UploadCloud size={20} />
                                </div>
                                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-slate-300 text-center">
                                  Cliquez pour téléverser ou glisser-déposer
                                </p>
                                <p className="text-[10px] lg:text-xs text-gray-400 dark:text-slate-500 mt-1 text-center">
                                  SVG, PNG, JPG ou GIF (max. 800x400px)
                                </p>
                              </>
                            )}
                          </label>
                        </div>
                      </>
                    )}

                    {activeTab === "address" && (
                      <>
                        <InputField
                          label="Pays"
                          name="country"
                          value={form.country}
                          onChange={handleChange}
                          placeholder="Tunisie"
                        />
                        <InputField
                          label="Région / État"
                          name="region"
                          value={form.region}
                          onChange={handleChange}
                          placeholder="Tunis"
                        />
                        <div className="md:col-span-2">
                          <InputField
                            label="Adresse"
                            name="addressLine"
                            value={form.addressLine}
                            onChange={handleChange}
                            placeholder="123 rue professionnelle"
                          />
                        </div>
                        <InputField
                          label="Code postal"
                          name="zipCode"
                          value={form.zipCode}
                          onChange={handleChange}
                          placeholder="1000"
                        />
                      </>
                    )}

                    {activeTab === "tax" && (
                      <div className="md:col-span-2">
                        <InputField
                          label="Numéro de TVA / fiscal"
                          name="taxNumber"
                          value={form.taxNumber}
                          onChange={handleChange}
                          placeholder="Identification fiscale"
                          icon={<Hash size={18} />}
                        />

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1 mt-4">
                            Image du QR code de l’entreprise
                          </label>
                          <input
                            type="file"
                            onChange={handleQrChange}
                            className="hidden"
                            id="qr-upload"
                            accept="image/*"
                          />
                          <label
                            htmlFor="qr-upload"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className="relative border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl p-6 lg:p-8 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-slate-800/30 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group min-h-[160px] lg:min-h-[200px]"
                          >
                            {qrPreview ? (
                              <div className="relative group/preview w-full flex flex-col items-center">
                                <img
                                  src={qrPreview}
                                  alt="Aperçu du QR code"
                                  className="max-h-24 lg:max-h-32 object-contain rounded-lg shadow-sm"
                                />
                                <button
                                  onClick={removeQr}
                                  className="absolute -top-3 -right-3 lg:-top-4 lg:-right-4 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-1.5 lg:p-2 rounded-full hover:bg-red-200 dark:hover:bg-red-900/80 transition-colors shadow-sm"
                                >
                                  <X size={14} />
                                </button>
                                <p className="text-xs text-gray-400 dark:text-slate-500 mt-4">
                                  Cliquer pour modifier l’image
                                </p>
                              </div>
                            ) : (
                              <>
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-gray-400 dark:text-slate-400 mb-3 group-hover:scale-110 transition-transform">
                                  <UploadCloud size={20} />
                                </div>
                                <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-slate-300 text-center">
                                  Cliquez pour téléverser
                                </p>
                                <p className="text-[10px] lg:text-xs text-gray-400 dark:text-slate-500 mt-1 text-center">
                                  SVG, PNG, JPG ou GIF (max. 800x400px)
                                </p>
                              </>
                            )}
                          </label>
                        </div>

                        <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl flex gap-3">
                          <div className="text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0">
                            <FileText size={18} />
                          </div>
                          <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                            Assurez-vous que votre numéro fiscal et votre image QR code sont corrects. Ils seront automatiquement appliqués à toutes les factures et commandes clients générées.
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4 justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 dark:bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-600 dark:hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-xl shadow-gray-200 dark:shadow-none order-1 sm:order-2"
                  >
                    {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                    {!loading && <ArrowRight size={18} />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const InputField = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative group">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full bg-gray-50/50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl py-3.5 px-4 ${
          icon ? "pl-12" : ""
        } text-sm font-medium text-gray-700 dark:text-slate-200 outline-none transition-all focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500`}
      />
    </div>
  </div>
);

const StatCard = ({ title, value, icon, color, trend }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white dark:bg-slate-900 p-5 lg:p-6 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-start gap-4 relative overflow-hidden group transition-colors"
  >
    <div
      className={`p-3 rounded-2xl ${color} transition-transform group-hover:scale-110 duration-300 shrink-0`}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs lg:text-sm font-semibold text-gray-400 dark:text-slate-500 mb-1 truncate">
        {title}
      </p>
      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
        {value}
      </h3>
      <div className="mt-2 text-[10px] lg:text-[11px] font-bold text-gray-500 dark:text-slate-400 flex items-center gap-1 uppercase tracking-widest truncate">
        {trend}
      </div>
    </div>
  </motion.div>
);

export default CompanyDashboard;
