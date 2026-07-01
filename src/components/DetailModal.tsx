"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Heart,
  Flower2,
  Clock,
  User as UserIcon,
  Edit2,
  Save,
} from "lucide-react";
import { FamilyMember } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { useFamily } from "../context/FamilyContext";
import { useAuth } from "../context/AuthContext";

interface DetailModalProps {
  member: FamilyMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DetailModal({
  member,
  isOpen,
  onClose,
}: DetailModalProps) {
  const { t } = useLanguage();
  const { members, updateMember } = useFamily();
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<FamilyMember>>({});

  useEffect(() => {
    if (member) {
      setEditForm(member);
      setIsEditing(false);
    }
  }, [member, isOpen]);

  if (!isOpen || !member) return null;

  // Find relationships dynamically from Context
  const father = members.find((m) => m.id === member.father_id);
  const mother = members.find((m) => m.id === member.mother_id);
  const spouse = members.find((m) => m.id === member.spouse_id);
  const children = members.filter(
    (m) => m.father_id === member.id || m.mother_id === member.id,
  );

  const handleSave = () => {
    if (member.id) {
      updateMember(member.id, editForm);
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden relative animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header Background */}
        <div
          className={`h-32 bg-gradient-to-r relative flex items-start justify-between p-4 ${member.gender === "male" ? "from-blue-600 to-blue-400" : "from-pink-600 to-pink-400"}`}
        >
          {user && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors flex items-center shadow-sm"
              title="Edit Data"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          {user && isEditing && (
            <div className="text-white font-bold tracking-wide">
              {t("editModeActive")}
            </div>
          )}
          <button
            onClick={() => {
              setIsEditing(false);
              onClose();
            }}
            className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors ml-auto"
            aria-label={t("close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8 pt-6 relative flex-1 overflow-y-auto">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.full_name}
                  className={`w-32 h-32 rounded-full border-4 object-cover bg-muted shadow-lg ${member.gender === "male" ? "border-blue-500" : "border-pink-500"}`}
                />
              ) : (
                <div
                  className={`w-32 h-32 rounded-full border-4 shadow-lg flex items-center justify-center ${member.gender === "male" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-500" : "border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-500"}`}
                >
                  <UserIcon className="w-16 h-16 opacity-50" />
                </div>
              )}
              {(member.is_deceased || member.death_date) && (
                <div className="absolute -bottom-2 -right-2 bg-slate-800 text-slate-100 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border-2 flex items-center shadow-sm">
                  <Flower2 className="w-3 h-3 mr-1" /> {t("deceasedShort")}
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="w-full mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">
                    {t("fullName")}
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={editForm.full_name || ""}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-border rounded-md bg-background focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">
                    {t("nickname")}
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    value={editForm.nickname || ""}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-border rounded-md bg-background focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      {t("birthDate")}
                    </label>
                    <input
                      type="date"
                      name="birth_date"
                      value={editForm.birth_date || ""}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-border rounded-md bg-background focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase">
                      {t("deathDate")}
                    </label>
                    <input
                      type="date"
                      name="death_date"
                      value={editForm.death_date || ""}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-border rounded-md bg-background focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-black text-foreground text-center mt-4">
                  {member.full_name}
                </h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  "{member.nickname}"
                </p>

                <div className="flex bg-muted rounded-xl p-3 shadow-inner">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                      {t("born")}
                    </span>
                    <span className="text-foreground font-semibold flex items-center">
                      <Heart className="w-4 h-4 mr-1 text-red-500" />{" "}
                      {member.birth_date}
                    </span>
                  </div>
                  {(member.is_deceased || member.death_date) && (
                    <>
                      <div className="w-px h-8 bg-border"></div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
                          {t("died")}
                        </span>
                        <span className="text-foreground font-semibold flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-slate-500" />{" "}
                          {member.death_date || t("unknown")}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="space-y-6">
              <div className="bg-background rounded-xl p-5 border border-border shadow-sm">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2 flex items-center">
                  {t("familyRelations")}
                </h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  <div>
                    <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      {t("parents")}
                    </span>
                    <div className="text-sm font-medium text-foreground">
                      {father ? <p>{father.full_name}</p> : null}
                      {mother ? <p>{mother.full_name}</p> : null}
                      {!father && !mother ? (
                        <p className="text-muted-foreground italic">
                          {t("unknown")}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      {t("spouse")}
                    </span>
                    <div className="text-sm font-medium text-foreground">
                      {spouse ? (
                        <p>{spouse.full_name}</p>
                      ) : (
                        <p className="text-muted-foreground italic">
                          {t("none")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border border-dashed">
                  <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    {t("children")}
                  </span>
                  {children.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {children.map((child) => (
                        <span
                          key={child.id}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${child.gender === "male" ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50" : "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800/50"}`}
                        >
                          {child.full_name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-muted-foreground italic">
                      {t("none")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="p-4 border-t border-border bg-card">
            <button
              onClick={handleSave}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] text-sm tracking-wide uppercase flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" /> {t("saveChanges")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
