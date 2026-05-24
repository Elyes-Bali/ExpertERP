import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { Toaster, toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LoadingSpinner from "./components/LoadingSpinner";
import DashboardPage from "./pages/DashboardPage";
import { useAuthStore } from "./store/authStore";
import HomePage from "./pages/HomePage";
import SummarizePDFPage from "./pages/SummarizePDFPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import TestPage from "./components/TestPage";
import PlansPage from "./pages/PlansPage";
import AdminFinance from "./Admin/AdminFinance";
import AdminUsers from "./Admin/AdminUsers";
import Faq from "./pages/Faq";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import NotFound from "./pages/NotFound";
import ContactUsPage from "./pages/ContactUsPage";
import CompanyDashboard from "./companyPages/CompanyDashboard";
import TaxDashboard from "./companyPages/TaxDashboard";
import ProjectsDashboard from "./companyPages/ProjectsDashboard";
import CatalogDashboard from "./companyPages/CatalogDashboard";
import WrahousesDashboard from "./companyPages/WrahousesDashboard";
import ProductDashboard from "./companyPages/ProductDashboard";
import CustomerDashboard from "./companyPages/CustomerDashboard";
import InvoiceDashboard from "./companyPages/InvoiceDashboard";
import AllSalesInvoices from "./companyPages/AllSalesInvoices";
import ClientOrdersDashboard from "./companyPages/ClientOrdersDashboard";
import AllClientOrders from "./companyPages/AllClientOrders";
import SupplierDashboard from "./companyPages/SupplierDashboard";
import SupplierInvoiceDashboard from "./companyPages/SupplierInvoiceDashboard";
import AllPlanComptable from "./companyPages/AllPlanComptable";
import SupplierOrderDashboard from "./companyPages/SupplierOrderDashboard";
import AllSupplierOrders from "./companyPages/AllSupplierOrders";
import AllSupplierInvoice from "./companyPages/AllSupplierInvoice";
import { Sun, Moon } from "lucide-react";
import TypeCompte from "./Admin/TypeCompte";
import JournalComptable from "./Admin/JournalComptable";
import CompteFinancier from "./companyPages/CompteFinancier";
import WorkersPage from "./companyPages/WorkersPage";
import AboutPage from "./pages/AboutPage";
import RegisterWorker from "./pages/RegisterWorker";
import CompanyUsers from "./companyPages/CompanyUsers";
import ProductsGuide from "./companyPages/ProductsGuide";
import Documentation from "./pages/Documentation";
import HelpCenterPage from "./pages/HelpCenterPage";
import MaterialsDashboard from "./companyPages/MaterialsDashboard";
import MachineTypeDashboard from "./companyPages/MachineTypeDashboard";
import TechnicalService from "./companyPages/TechnicalService";
import ContractTypeDashboard from "./companyPages/ContractTypeDashboard";
import InternetClientDashboard from "./companyPages/InternetClientDashboard";
import InternetPayment from "./companyPages/InternetPayment";
import LanguageSwitcher from "./components/LanguageSwitcher";
import NoteDashboard from "./companyPages/NoteDashboard";
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  // 1. Check for Authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check for Email Verification
  if (user && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // 3. Check for Admin Role
  if (user && user.role !== "admin") {
    // Show an error and redirect unauthorized users to the home page
    toast.error("Access Denied: Admin privileges required.");
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the child component
  return children;
};

const PremiumProRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const requiredPlan = "Premium Pro";

  // First, apply general protection checks (Authentication & Verification)
  if (!isAuthenticated) {
    toast.error("Please log in to access this feature.");
    return <Navigate to="/login" replace />;
  }

  if (user && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Second, check for the specific plan requirement
  // Check if user exists and if the paidPlan is NOT the required plan
  if (!user || user.paidPlan !== requiredPlan) {
    // Use toast to notify the user why they were redirected
    toast.error(`Access restricted. Requires the "${requiredPlan}" plan.`);
    // Redirect to the plans page where they can upgrade
    return <Navigate to="/plans" replace />;
  }

  // If all checks pass, render the child component
  return children;
};
// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  const [isDark, setIsDark] = useState(false);
  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    checkAuth();
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, [checkAuth]);
  if (isCheckingAuth) return <LoadingSpinner />;
  return (
    <>
      {isAuthenticated && user && (
        <button
          onClick={toggleDarkMode}
          className="fixed bottom-6 right-6 z-50 p-3 bg-black text-white dark:bg-white dark:text-black rounded-full shadow-lg hover:scale-110 transition-all"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      )}
      <Routes>
        {/* FULL SCREEN PAGES */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/summarizePDF"
          element={
            <ProtectedRoute>
              <SummarizePDFPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatAI"
          element={
            <PremiumProRoute>
              <ChatPage />
            </PremiumProRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company"
          element={
            <ProtectedRoute>
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/taxes"
          element={
            <ProtectedRoute>
              <TaxDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Materials"
          element={
            <ProtectedRoute>
              <MaterialsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Machine-Types"
          element={
            <ProtectedRoute>
              <MachineTypeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brands-and-categories"
          element={
            <ProtectedRoute>
              <CatalogDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warehouses"
          element={
            <ProtectedRoute>
              <WrahousesDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Products"
          element={
            <ProtectedRoute>
              <ProductDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <InvoiceDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/All-Sales-Invoices"
          element={
            <ProtectedRoute>
              <AllSalesInvoices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Client-orders"
          element={
            <ProtectedRoute>
              <ClientOrdersDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/All-Client-Orders"
          element={
            <ProtectedRoute>
              <AllClientOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Suppliers"
          element={
            <ProtectedRoute>
              <SupplierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Supplier-invoice"
          element={
            <ProtectedRoute>
              <SupplierInvoiceDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Supplier-order"
          element={
            <ProtectedRoute>
              <SupplierOrderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/All-Supplier-orderS"
          element={
            <ProtectedRoute>
              <AllSupplierOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/All-Supplier-invoices"
          element={
            <ProtectedRoute>
              <AllSupplierInvoice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Plan-Comptable"
          element={
            <ProtectedRoute>
              <AllPlanComptable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Financial-accounting"
          element={
            <ProtectedRoute>
              <CompteFinancier />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Workers-Payments"
          element={
            <ProtectedRoute>
              <WorkersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Technical-Services"
          element={
            <ProtectedRoute>
              <TechnicalService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Contract-Types"
          element={
            <ProtectedRoute>
              <ContractTypeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Internet-Clients"
          element={
            <ProtectedRoute>
              <InternetClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Internet-Payments"
          element={
            <ProtectedRoute>
              <InternetPayment />
            </ProtectedRoute>
          }
        />
           <Route
          path="/Notes"
          element={
            <ProtectedRoute>
              <NoteDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔥 ADMIN ROUTES using AdminRoute */}
        <Route
          path="/Type-Comptes"
          element={
            <AdminRoute>
              <TypeCompte />
            </AdminRoute>
          }
        />
        <Route
          path="/Journal-Comptable"
          element={
            <AdminRoute>
              <JournalComptable />
            </AdminRoute>
          }
        />
        <Route
          path="/finance"
          element={
            <AdminRoute>
              <AdminFinance />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        {/* END ADMIN ROUTES */}

        <Route path="/About-us" element={<AboutPage />} />
        <Route path="/Privacy-Policy" element={<PrivacyPolicyPage />} />
        <Route path="/Contact-us" element={<ContactUsPage />} />
        <Route
          path="/New-Worker"
          element={
            <ProtectedRoute>
              <RegisterWorker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Company-workers"
          element={
            <ProtectedRoute>
              <CompanyUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Products-Guide"
          element={
            <ProtectedRoute>
              <ProductsGuide />
            </ProtectedRoute>
          }
        />

        <Route path="/Documentation" element={<Documentation />} />
        <Route path="/Help-Center" element={<HelpCenterPage />} />
        {/* AUTH PAGES (with background + floating shapes) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AuthLayout>
                <DashboardPage />
              </AuthLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <AuthLayout>
                <SignUpPage />
              </AuthLayout>
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <AuthLayout>
                <ForgotPasswordPage />
              </AuthLayout>
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <AuthLayout>
                <ResetPasswordPage />
              </AuthLayout>
            </RedirectAuthenticatedUser>
          }
        />

        <Route
          path="/verify-email"
          element={
            <AuthLayout>
              <EmailVerificationPage />
            </AuthLayout>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
    </>
  );
}

/* ------------------ AUTH PAGE LAYOUT ------------------ */
function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen bg-gradient-to-br 
      from-gray-900 via-green-900 to-emerald-900
      flex items-center justify-center relative overflow-hidden"
    >
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      {children}
    </div>
  );
}

export default App;
