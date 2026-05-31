import React from "react";
import { motion } from "framer-motion";
import { Loader, Lock, Mail, User, Building2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
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
      {/* Top logo */}
      <div style={styles.brandTop}>
        <div style={styles.logoMark}>
          <Building2 size={22} color="#fff" />
        </div>
        <span style={styles.brandName}>EXPERT-ERP</span>
      </div>

      {/* Hero block */}
      <div style={styles.heroBlock}>
        <div style={styles.tagline}>Onboarder. Configurer. Lancer.</div>
        <h1 style={styles.heroTitle}>
          Configurez votre<br />espace de travail aujourd’hui.
        </h1>
        <p style={styles.heroSub}>
          Rejoignez des milliers d’entreprises qui gèrent leurs opérations, finances et équipes
          depuis une seule plateforme ERP sécurisée.
        </p>

        {/* Steps */}
        <div style={styles.stepsList}>
          {[
            { n: "01", text: "Créer votre compte sécurisé" },
            { n: "02", text: "Vérifier votre adresse email" },
            { n: "03", text: "Configurer votre organisation" },
          ].map((s) => (
            <div key={s.n} style={styles.stepItem}>
              <span style={styles.stepNum}>{s.n}</span>
              <span style={styles.stepText}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.leftFooter}>
        <ShieldCheck size={14} color="#6ee7b7" style={{ marginRight: 6 }} />
        <span style={styles.leftFooterText}>
          SOC 2 Type II · Conforme au RGPD · Chiffrement de bout en bout
        </span>
      </div>
    </motion.div>

    {/* Right Panel — Form */}
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
          <div style={styles.cardHeaderBadge}>NOUVEAU COMPTE</div>
          <h2 style={styles.cardTitle}>Créer votre espace de travail</h2>
          <p style={styles.cardSubtitle}>
            Remplissez vos informations pour demander l’accès à la plateforme ERP.
          </p>
        </div>

        <div style={styles.dividerLine} />

        <form onSubmit={handleSignUp} style={styles.form}>
          {/* Full Name */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>NOM COMPLET</label>
            <div style={styles.inputWrapper}>
              <User size={15} color="#6b7280" style={styles.inputIcon} />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Error */}
          {error && (
            <div style={styles.alertError}>
              <span style={styles.alertDot} />
              {error}
            </div>
          )}

          {/* Password strength meter — preserved as-is */}
          <div style={styles.strengthWrap}>
            <PasswordStrengthMeter password={password} />
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            style={styles.primaryBtn}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={20} />
            ) : (
              <span style={styles.primaryBtnText}>Créer un compte</span>
            )}
          </motion.button>
        </form>

        <div style={styles.cardFooter}>
          <span style={styles.cardFooterText}>Vous avez déjà un compte ? </span>
          <Link to="/login" style={styles.loginLink}>
            Se connecter
          </Link>
        </div>
      </motion.div>

      <p style={styles.disclaimer}>
        En créant un compte, vous acceptez les{" "}
        <a href="#" style={styles.disclaimerLink}>
          Conditions d’utilisation
        </a>{" "}
        et la{" "}
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

  /* Steps list */
  stepsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
  },
  stepItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.85rem",
  },
  stepNum: {
    fontSize: "0.65rem",
    fontWeight: 800,
    color: "#6ee7b7",
    letterSpacing: "0.1em",
    width: 28,
    height: 28,
    border: "1px solid rgba(110,231,183,0.35)",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    background: "rgba(110,231,183,0.08)",
  },
  stepText: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.65)",
    fontWeight: 400,
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
    boxShadow:
      "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
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
  },

  /* ── Form ── */
  form: {
    padding: "1.6rem 2rem 1rem",
    display: "flex",
    flexDirection: "column",
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

  /* ── Alert ── */
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
  alertDot: {
    display: "inline-block",
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#dc2626",
    flexShrink: 0,
  },

  /* Password strength meter spacing */
  strengthWrap: {
    marginBottom: "1.2rem",
  },

  /* ── Primary button ── */
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
  },
  primaryBtnText: {
    letterSpacing: "0.04em",
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
  loginLink: {
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

export default SignUpPage;