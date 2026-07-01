"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Shield, Users, ArrowRight, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<"contributor" | "admin">(
    "contributor",
  );
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === "adminsirga" && adminPassword === "#Awokwokkk69") {
      login("admin");
      toast.success(t("loginAdminSuccess") || "Admin access granted.");
    } else {
      setAdminError(t("wrongKey") || "Invalid credentials");
      toast.error(t("wrongKey") || "Invalid credentials");
    }
  };

  const handleContributorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(t("fillAllFields") || "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success(t("loginSuccess") || "Login successful!");
      login("contributor", data.user);
    } catch (error: any) {
      toast.error(t("loginFailed") || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-background w-full">
      <div className="max-w-4xl w-full bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Left Side: Branding */}
        <div className="w-full md:w-5/12 bg-primary p-8 md:p-12 flex flex-col justify-center text-primary-foreground relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

          <h1 className="text-4xl font-black mb-4 relative z-10 tracking-tight">
            {t("appTitle")}
          </h1>
          <p className="text-xl opacity-90 mb-8 relative z-10 font-medium">
            Sistem Informasi Silsilah Keluarga
          </p>
          <div className="space-y-4 relative z-10">
            <div className="flex items-center text-primary-foreground/80 text-sm font-medium">
              <Shield className="w-5 h-5 mr-3" /> Privasi Terjaga
            </div>
            <div className="flex items-center text-primary-foreground/80 text-sm font-medium">
              <Users className="w-5 h-5 mr-3" /> Koneksi Keluarga
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-card">
          <div className="flex space-x-4 mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab("contributor")}
              className={`pb-4 px-2 font-bold text-sm tracking-wide uppercase transition-colors relative ${activeTab === "contributor" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t("contributor")}
              {activeTab === "contributor" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`pb-4 px-2 font-bold text-sm tracking-wide uppercase transition-colors relative ${activeTab === "admin" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t("developerAdmin")}
              {activeTab === "admin" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>
              )}
            </button>
          </div>

          {activeTab === "contributor" ? (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {t("loginTitle")}
              </h2>
              <p className="text-muted-foreground mb-6">{t("loginDesc")}</p>

              <form onSubmit={handleContributorLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    {t("emailOrUsername")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t("placeholderEmail")}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    {t("password")}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={t("placeholderPassword")}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {t("loginNow")} <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">
                  {t("notRegistered")}{" "}
                  <Link
                    href="/register"
                    className="text-primary font-bold hover:underline"
                  >
                    {t("registerNow")}
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mr-3">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {t("developerAccess")}
                  </h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    Restricted Area
                  </p>
                </div>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => {
                      setAdminUsername(e.target.value);
                      setAdminError("");
                    }}
                    placeholder="Enter admin username..."
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none font-mono mb-4"
                  />
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setAdminError("");
                    }}
                    placeholder="Enter admin password..."
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none font-mono"
                  />
                  {adminError && (
                    <p className="text-red-500 text-xs font-bold mt-2">
                      {adminError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 dark:bg-white dark:text-black hover:opacity-90 hover:scale-105 active:scale-95 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md"
                >
                  {t("authorizeAccess")}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
