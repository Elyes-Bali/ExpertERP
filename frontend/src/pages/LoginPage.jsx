import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, ShieldCheck, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState(null);
  const { login, isLoading, error } = useAuthStore();
  const googleLogin = useAuthStore((state) => state.googleLogin);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await login(email, password);

      if (!res?.success) {
        setRemainingAttempts(res?.remainingAttempts ?? null);
        return;
      }

      setRemainingAttempts(null);

      const user = res.user;

      if (user && user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen w-full flex" style={styles.pageWrapper}>
      {/* Left Panel — Branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={styles.leftPanel}
        className="hidden lg:flex flex-col justify-between"
      >
        {/* Top logo area */}
        <div style={styles.brandTop}>
          <div style={styles.logoMark}>
            <Building2 size={22} color="#fff" />
          </div>
          <span style={styles.brandName}>EXPERT-ERP</span>
        </div>

        {/* Center hero text */}
        <div style={styles.heroBlock}>
          <div style={styles.tagline}>Intégré. Intelligent. Sous contrôle.</div>
          <h1 style={styles.heroTitle}>
            Votre entreprise,
            <br />
            unifiée.
          </h1>
          <p style={styles.heroSub}>
            Accédez aux finances, opérations, RH, CRM et analyses — le tout
            depuis une seule plateforme sécurisée conçue pour passer à
            l’échelle.
          </p>

          {/* Stats row */}
          <div style={styles.statsRow}>
            {[
              { val: "99.9%", label: "SLA de disponibilité" },
              { val: "ISO 27001", label: "Certifié" },
              { val: "256-bit", label: "Chiffrement" },
            ].map((s) => (
              <div key={s.label} style={styles.statItem}>
                <span style={styles.statVal}>{s.val}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom footer */}
        <div style={styles.leftFooter}>
          <ShieldCheck size={14} color="#6ee7b7" style={{ marginRight: 6 }} />
          <span style={styles.leftFooterText}>
            SOC 2 Type II · Conforme au RGPD · Chiffrement de bout en bout
          </span>
        </div>
      </motion.div>

      {/* Right Panel — Login Form */}
      <div
        style={styles.rightPanel}
        className="flex flex-col justify-center items-center"
      >
        {/* Mobile logo */}
        <div
          style={styles.mobileLogo}
          className="flex lg:hidden items-center mb-8"
        >
          <div style={{ ...styles.logoMark, background: "#166534" }}>
            <Building2 size={18} color="#fff" />
          </div>
          <span style={{ ...styles.brandName, color: "#166534" }}>
            EXPERT-ERP
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          style={styles.card}
        >
          {/* Card header */}
          <div style={styles.cardHeader}>
            <div style={styles.cardHeaderBadge}>PORTAIL SÉCURISÉ</div>
            <h2 style={styles.cardTitle}>
              Connectez-vous à votre espace de travail
            </h2>
            <p style={styles.cardSubtitle}>
              Entrez vos identifiants pour accéder au tableau de bord ERP.
            </p>
          </div>

          <div style={styles.dividerLine} />

          <form onSubmit={handleLogin} style={styles.form}>
            {/* Field label + Input wrapper for ERP feel */}
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>ADRESSE EMAIL</label>
              <div style={styles.inputWrapper}>
                <Mail size={15} color="#6b7280" style={styles.inputIcon} />
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>MOT DE PASSE</label>
              <div style={styles.inputWrapper}>
                <Lock size={15} color="#6b7280" style={styles.inputIcon} />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.forgotRow}>
              <Link to="/forgot-password" style={styles.forgotLink}>
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Alerts */}
            {error && (
              <div style={styles.alertError}>
                <span style={styles.alertDot} />
                {error}
              </div>
            )}
            {remainingAttempts !== null && remainingAttempts > 0 && (
              <div style={styles.alertWarn}>
                <span style={{ ...styles.alertDot, background: "#f59e0b" }} />
                {remainingAttempts} tentative
                {remainingAttempts !== 1 ? "s" : ""} restante
                {remainingAttempts !== 1 ? "s" : ""} avant verrouillage.
              </div>
            )}
            {remainingAttempts === 0 && (
              <div style={styles.alertError}>
                <span style={styles.alertDot} />
                Le compte sera verrouillé après cette tentative.
              </div>
            )}

            {/* Primary button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              style={styles.primaryBtn}
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <span style={styles.primaryBtnText}>Se connecter</span>
              )}
            </motion.button>

            {/* Divider */}
            <div style={styles.orDivider}>
              <div style={styles.orLine} />
              <span style={styles.orText}>ou continuer avec</span>
              <div style={styles.orLine} />
            </div>

            {/* Google Login */}
            <div style={styles.googleWrap}>
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const res = await googleLogin(credentialResponse.credential);

                  const user = res.user;

                  if (user.role === "admin") navigate("/dashboard");
                  else navigate("/");
                }}
                onError={() => console.log("Google Login Failed")}
              />
            </div>
          </form>

          <div style={styles.cardFooter}>
            <span style={styles.cardFooterText}>
              Vous n'avez pas de compte ?{" "}
            </span>
            <Link to="/signup" style={styles.signupLink}>
              Demander un accès
            </Link>
          </div>
        </motion.div>

        {/* Bottom disclaimer */}
        <p style={styles.disclaimer}>
          En vous connectant, vous acceptez les{" "}
          <a href="#" style={styles.disclaimerLink}>
            Conditions d’utilisation
          </a>{" "}
          et{" "}
          <a href="#" style={styles.disclaimerLink}>
            Politique de confidentialité
          </a>
          .
        </p>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    background: "#f1f5f9",
    fontFamily: "'DM Sans', 'IBM Plex Sans', 'Segoe UI', sans-serif",
    minHeight: "100vh",
  },

  /* ── Left branding panel ── */
  leftPanel: {
    width: "42%",
    minHeight: "100vh",
    background:
      "linear-gradient(160deg, #052e16 0%, #14532d 45%, #166534 100%)",
    padding: "2.5rem 3rem",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
  },
  brandTop: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  brandName: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "0.03em",
  },
  heroBlock: {
    paddingBottom: "2rem",
  },
  tagline: {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: "#6ee7b7",
    textTransform: "uppercase",
    marginBottom: "1rem",
  },
  heroTitle: {
    fontSize: "2.8rem",
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.15,
    marginBottom: "1.2rem",
    letterSpacing: "-0.02em",
  },
  heroSub: {
    fontSize: "0.92rem",
    color: "rgba(255,255,255,0.6)",
    lineHeight: 1.7,
    maxWidth: 340,
    marginBottom: "2.5rem",
  },
  statsRow: {
    display: "flex",
    gap: "2rem",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  statVal: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#a7f3d0",
    letterSpacing: "0.02em",
  },
  statLabel: {
    fontSize: "0.68rem",
    color: "rgba(255,255,255,0.45)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  leftFooter: {
    display: "flex",
    alignItems: "center",
    paddingTop: "1rem",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  leftFooterText: {
    fontSize: "0.7rem",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: "0.04em",
  },

  /* ── Right form panel ── */
  rightPanel: {
    flex: 1,
    padding: "2rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
  },
  mobileLogo: {
    gap: "0.6rem",
  },

  /* ── Card ── */
  card: {
    width: "100%",
    maxWidth: 440,
    background: "#ffffff",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "2rem 2rem 1.5rem",
  },
  cardHeaderBadge: {
    display: "inline-block",
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "#16a34a",
    background: "#dcfce7",
    border: "1px solid #bbf7d0",
    borderRadius: 4,
    padding: "3px 8px",
    marginBottom: "0.9rem",
  },
  cardTitle: {
    fontSize: "1.35rem",
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.02em",
    marginBottom: "0.4rem",
  },
  cardSubtitle: {
    fontSize: "0.83rem",
    color: "#64748b",
    lineHeight: 1.5,
  },
  dividerLine: {
    height: 1,
    background: "#f1f5f9",
    margin: "0",
  },

  /* ── Form ── */
  form: {
    padding: "1.6rem 2rem 1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.1rem",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    marginBottom: "1rem",
  },
  fieldLabel: {
    fontSize: "0.62rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: 12,
  },
  input: {
    width: "100%",
    height: 42,
    paddingLeft: 36,
    paddingRight: 14,
    fontSize: "0.875rem",
    color: "#1e293b",
    background: "#f8fafc",
    border: "1px solid #cbd5e1",
    borderRadius: 7,
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  forgotRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "-0.4rem",
    marginBottom: "1.2rem",
  },
  forgotLink: {
    fontSize: "0.78rem",
    color: "#16a34a",
    textDecoration: "none",
    fontWeight: 500,
  },

  /* ── Alerts ── */
  alertError: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 6,
    padding: "0.55rem 0.9rem",
    fontSize: "0.8rem",
    color: "#dc2626",
    fontWeight: 500,
    marginBottom: "0.8rem",
  },
  alertWarn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: 6,
    padding: "0.55rem 0.9rem",
    fontSize: "0.8rem",
    color: "#b45309",
    fontWeight: 500,
    marginBottom: "0.8rem",
  },
  alertDot: {
    display: "inline-block",
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#dc2626",
    flexShrink: 0,
  },

  /* ── Buttons ── */
  primaryBtn: {
    width: "100%",
    height: 44,
    background: "linear-gradient(135deg, #16a34a 0%, #166534 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 7,
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 700,
    fontSize: "0.875rem",
    letterSpacing: "0.03em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(22,101,52,0.25)",
    marginBottom: "1.2rem",
  },
  primaryBtnText: {
    letterSpacing: "0.04em",
  },

  /* ── Divider ── */
  orDivider: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: "1.1rem",
  },
  orLine: {
    flex: 1,
    height: 1,
    background: "#e2e8f0",
  },
  orText: {
    fontSize: "0.72rem",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  googleWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "0.5rem",
  },

  /* ── Card footer ── */
  cardFooter: {
    borderTop: "1px solid #f1f5f9",
    padding: "1rem 2rem",
    background: "#f8fafc",
    textAlign: "center",
  },
  cardFooterText: {
    fontSize: "0.8rem",
    color: "#64748b",
  },
  signupLink: {
    fontSize: "0.8rem",
    color: "#16a34a",
    fontWeight: 600,
    textDecoration: "none",
    marginLeft: 4,
  },

  /* ── Page disclaimer ── */
  disclaimer: {
    marginTop: "1.5rem",
    fontSize: "0.72rem",
    color: "#94a3b8",
    textAlign: "center",
    maxWidth: 380,
  },
  disclaimerLink: {
    color: "#64748b",
    textDecoration: "underline",
  },
};

export default LoginPage;
