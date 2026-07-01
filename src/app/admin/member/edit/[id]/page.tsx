"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useFamily } from "@/context/FamilyContext";
import MemberForm from "@/components/MemberForm";
import { useLanguage } from "@/context/LanguageContext";
import { FamilyMember } from "@/types";
import { ArrowLeft, Edit2 } from "lucide-react";
import toast from "react-hot-toast";

export default function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { members, updateMember } = useFamily();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const { t } = useLanguage();

  const resolvedParams = use(params);
  const id = resolvedParams.id;

  useEffect(() => {
    if (id) {
      const found = members.find((m) => m.id === id);
      if (found) {
        setMember(found);
      } else {
        router.push("/admin"); // Not found, redirect
      }
    }
  }, [id, members, router]);

  const handleSave = async (updatedMember: FamilyMember) => {
    try {
      await updateMember(updatedMember.id, updatedMember);
      toast.success(t("editSuccess"));
      router.push("/admin");
    } catch (error: any) {
      toast.error(error.message || "Error");
    }
  };

  if (!member) return null; // Loading or redirecting

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
        <div>
          <h1 className="text-3xl font-black text-foreground">
            {t("editMember")}
          </h1>
          <p className="text-muted-foreground mt-2">{t("editMemberDesc")}</p>
        </div>
      </div>

      <MemberForm initialData={member} onSave={handleSave} members={members} />
    </div>
  );
}
