"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-card w-full max-w-md mx-4 rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center text-destructive">
              <div className="bg-destructive/10 p-3 rounded-full mr-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{title}</h3>
            </div>
            <button
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-muted-foreground ml-14">{message}</p>

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl font-bold text-foreground bg-muted/50 hover:bg-muted border border-transparent hover:border-border transition-all active:scale-95"
            >
              {t("cancel")}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-all active:scale-95 flex items-center"
            >
              {confirmText || t("delete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
