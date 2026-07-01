"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFamily } from "@/context/FamilyContext";
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  FileText,
  UserCog,
  Database,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import ContributorsTab from "./ContributorsTab";
import LogsTab from "./LogsTab";

export default function AdminDashboard() {
  const router = useRouter();
  const { members, deleteMember } = useFamily();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "members" | "contributors" | "logs"
  >("members");

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string;
    name: string;
  }>({
    isOpen: false,
    id: "",
    name: "",
  });

  const handleAddClick = () => router.push("/admin/member/add");
  const handleEditClick = (id: string) =>
    router.push(`/admin/member/edit/${id}`);
  const handleDeleteClick = (id: string, name: string) =>
    setDeleteModal({ isOpen: true, id, name });

  const confirmDelete = async () => {
    try {
      await deleteMember(deleteModal.id);
      toast.success(t("deleteSuccess"));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 w-full animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-black text-foreground flex items-center">
          <Database className="w-8 h-8 mr-3 text-primary" />
          {isAdmin ? t("adminDashboard") : "Dashboard Data Keluarga"}
        </h1>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t("addMember")}
        </button>
      </div>

      {/* Tabs specifically for Admins */}
      {isAdmin && (
        <div className="flex space-x-2 mb-6 border-b border-border pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("members")}
            className={`px-4 py-3 font-bold text-sm tracking-wide transition-all flex items-center border-b-2 whitespace-nowrap ${
              activeTab === "members"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <Users className="w-4 h-4 mr-2" /> Data Keluarga
          </button>
          <button
            onClick={() => setActiveTab("contributors")}
            className={`px-4 py-3 font-bold text-sm tracking-wide transition-all flex items-center border-b-2 whitespace-nowrap ${
              activeTab === "contributors"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <UserCog className="w-4 h-4 mr-2" /> Kelola Kontributor
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-3 font-bold text-sm tracking-wide transition-all flex items-center border-b-2 whitespace-nowrap ${
              activeTab === "logs"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <FileText className="w-4 h-4 mr-2" /> Riwayat Log
          </button>
        </div>
      )}

      {/* TABS CONTENT */}
      {activeTab === "members" && (
        <div className="bg-card shadow-lg rounded-xl border border-border overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground text-sm uppercase tracking-wider">
                  <th className="p-4 text-left font-bold">{t("fullName")}</th>
                  <th className="p-4 text-left font-bold">{t("birthDate")}</th>
                  <th className="p-4 text-left font-bold">{t("gender")}</th>
                  <th className="p-4 text-left font-bold">{t("parents")}</th>
                  <th className="p-4 text-left font-bold">{t("spouse")}</th>
                  <th className="p-4 text-right font-bold">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {members.map((member) => {
                  const father = members.find((m) => m.id === member.father_id);
                  const mother = members.find((m) => m.id === member.mother_id);
                  const spouse = members.find((m) => m.id === member.spouse_id);

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="font-bold text-foreground text-lg">
                          {member.full_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          "{member.nickname}"
                        </div>
                      </td>
                      <td className="p-4 text-foreground">
                        <span className="font-medium">{member.birth_date}</span>
                        {member.death_date && (
                          <span className="flex items-center text-xs font-semibold text-slate-500 mt-1 bg-slate-100 dark:bg-slate-800/50 w-fit px-2 py-0.5 rounded-full">
                            {t("died")}: {member.death_date}
                          </span>
                        )}
                        {member.is_deceased && !member.death_date && (
                          <span className="flex items-center text-xs font-semibold text-slate-500 mt-1 bg-slate-100 dark:bg-slate-800/50 w-fit px-2 py-0.5 rounded-full">
                            {t("deceased")}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${member.gender === "male" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"}`}
                        >
                          {member.gender === "male" ? t("male") : t("female")}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-foreground">
                        {father || mother ? (
                          <div className="flex flex-col gap-1.5">
                            {father && (
                              <span className="flex items-center">
                                <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[9px] font-bold mr-1.5">
                                  A
                                </span>{" "}
                                {father.nickname}
                              </span>
                            )}
                            {mother && (
                              <span className="flex items-center">
                                <span className="w-4 h-4 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center text-[9px] font-bold mr-1.5">
                                  I
                                </span>{" "}
                                {mother.nickname}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-xs bg-muted px-2 py-1 rounded">
                            {t("unknownRoot")}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-foreground">
                        {spouse ? (
                          <span className="font-medium">{spouse.nickname}</span>
                        ) : (
                          <span className="text-muted-foreground italic">
                            -
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(member.id)}
                            className="p-2 text-blue-600 bg-blue-600/10 hover:bg-blue-600 hover:text-white rounded-lg transition-all hover:scale-105 active:scale-95 shadow-sm"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() =>
                                handleDeleteClick(member.id, member.full_name)
                              }
                              className="p-2 text-red-600 bg-red-600/10 hover:bg-red-600 hover:text-white rounded-lg transition-all hover:scale-105 active:scale-95 shadow-sm"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {members.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-12 text-center text-muted-foreground text-lg font-medium"
                    >
                      {t("noDataAdmin")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "contributors" && <ContributorsTab />}
      {activeTab === "logs" && <LogsTab />}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={t("delete")}
        message={`${t("confirmDelete")} ${deleteModal.name}? ${t("actionCannotBeUndone")}`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: "", name: "" })}
      />
    </div>
  );
}
