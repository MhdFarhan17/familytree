"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useFamily } from "@/context/FamilyContext";
import MemberForm from "@/components/MemberForm";
import { useLanguage } from "@/context/LanguageContext";
import { FamilyMember } from "@/types";
import { ChevronLeft, UserPlus, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function AddMemberPage() {
  const router = useRouter();
  const { members, addMember } = useFamily();
  const { t } = useLanguage();

  const handleSave = async (member: FamilyMember) => {
    try {
      await addMember(member);
      toast.success(t("addSuccess"));
      router.push("/admin");
    } catch (error: any) {
      toast.error(t("addFailed") || error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 w-full animate-in fade-in duration-300">
      <div className="mb-6">
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t("back")}
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">
          {t("addMemberNew")}
        </h1>
        <p className="text-muted-foreground mt-2">{t("addMemberDesc")}</p>
      </div>

      <MemberForm onSave={handleSave} members={members} />
    </div>
  );
}
