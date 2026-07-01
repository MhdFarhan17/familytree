"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Info,
  ZoomIn,
  Hand,
  MousePointerClick,
  Code2,
  Heart,
  Shield,
  Users,
} from "lucide-react";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 w-full animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="bg-card shadow-xl rounded-3xl overflow-hidden border border-border mb-10">
        <div className="bg-gradient-to-br from-primary to-primary/80 p-10 md:p-16 text-primary-foreground text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white p-6 rounded-3xl shadow-2xl mb-8 flex items-center justify-center">
              <img
                src="https://pjsuotdulrodtiddbawr.supabase.co/storage/v1/object/public/logo/Logo%20SIRGA.png"
                alt="Logo SIRGA"
                className="w-40 h-40 md:w-56 md:h-56 object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              {t("aboutTitle")}
            </h1>
            <p className="text-xl md:text-2xl font-medium opacity-90 max-w-2xl mx-auto">
              {t("aboutDesc")}
            </p>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <div className="bg-card shadow-lg rounded-3xl border border-border p-8 md:p-12 mb-10">
        <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
          {t("howToUse")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-secondary/10 p-5 rounded-3xl mb-6 text-secondary">
              <Hand className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              {t("navigation")}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t("instruction1")}
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-secondary/10 p-5 rounded-3xl mb-6 text-secondary">
              <ZoomIn className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              {t("zooming")}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t("instruction2")}
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-secondary/10 p-5 rounded-3xl mb-6 text-secondary">
              <MousePointerClick className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              {t("memberDetail")}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {t("instruction3")}
            </p>
          </div>
        </div>
      </div>

      {/* Developer Profile Section */}
      <div className="bg-card shadow-lg rounded-3xl border border-border p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-8 flex items-center justify-center">
          <Code2 className="w-5 h-5 mr-2" /> {t("developedBy")}
        </h2>

        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
            <img
              src="/farhan.png"
              alt="Muhammad Farhan"
              className="w-32 h-32 rounded-full border-4 border-card object-cover relative z-10 shadow-2xl bg-muted"
            />
          </div>
          <h3 className="text-3xl font-black text-foreground mb-2">
            Muhammad Farhan
          </h3>
          <p className="text-primary font-bold text-lg mb-6">
            {t("itEnthusiast")}
          </p>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            {t("developerDesc")}
          </p>
          <div className="flex items-center text-sm font-semibold text-muted-foreground bg-muted px-6 py-3 rounded-full shadow-inner border border-border/50">
            {t("madeWith")}{" "}
            <Heart className="w-4 h-4 mx-2 text-red-500 fill-red-500 animate-pulse" />{" "}
            {t("forFamily")}
          </div>
        </div>
      </div>
    </div>
  );
}
