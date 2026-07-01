"use client";

import React, { useState, useEffect } from "react";
import { FamilyMember } from "../types";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Upload, Loader2, Image as ImageIcon, Save } from "lucide-react";
import toast from "react-hot-toast";

import { useLanguage } from "@/context/LanguageContext";

interface MemberFormProps {
  onSave: (member: any) => void;
  initialData?: FamilyMember | null;
  members: FamilyMember[];
}

export default function MemberForm({
  onSave,
  initialData,
  members,
}: MemberFormProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const defaultMember: Partial<FamilyMember> = {
    full_name: "",
    nickname: "",
    birth_date: "",
    gender: "male",
    photo_url: "",
    father_id: null,
    mother_id: null,
    spouse_id: null,
  };

  const [formData, setFormData] =
    useState<Partial<FamilyMember>>(defaultMember);
  const [isDeceased, setIsDeceased] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.is_deceased || initialData.death_date) {
        setIsDeceased(true);
      } else {
        setIsDeceased(false);
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error(t("uploadRequire"));
      }

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, photo_url: data.publicUrl }));
      toast.success(t("uploadSuccess"));
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(t("uploadFailed") + ": " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalData = { ...formData, is_deceased: isDeceased };

      // If they said not deceased, ensure death_date is null
      if (!isDeceased) {
        finalData.death_date = null;
      }
      onSave(finalData);
    } catch (error: any) {
      toast.error(error.message || "Error");
    }
  };

  return (
    <div className="bg-card text-card-foreground w-full rounded-2xl shadow-sm border border-border overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        {/* Personal Info Section */}
        <section>
          <h3 className="text-lg font-bold border-b border-border pb-3 mb-4 text-primary">
            {t("personalInfo")}
          </h3>

          {/* Avatar Upload Area */}
          <div className="mb-6 flex flex-col md:flex-row items-center gap-6 p-4 border border-border border-dashed rounded-xl bg-muted/10">
            <div className="relative w-24 h-24 rounded-full border-4 border-card bg-muted shadow-sm overflow-hidden flex items-center justify-center">
              {formData.photo_url ? (
                <img
                  src={formData.photo_url}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-10 h-10 text-muted-foreground opacity-50" />
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h4 className="font-semibold mb-1">{t("profilePhoto")}</h4>
              <p className="text-xs text-muted-foreground mb-3">
                {t("uploadPhotoInfo")}
              </p>
              <div className="flex flex-col md:flex-row gap-2">
                <label className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm">
                  <Upload className="w-4 h-4 mr-2" />
                  {t("chooseDevice")}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  name="photo_url"
                  value={formData.photo_url || ""}
                  onChange={handleChange}
                  placeholder={t("pasteUrl")}
                  className="flex-1 p-2 text-sm border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("fullName")} <span className="text-destructive">*</span>
              </label>
              <input
                required
                type="text"
                name="full_name"
                value={formData.full_name || ""}
                onChange={handleChange}
                className="w-full p-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("nickname")} <span className="text-destructive">*</span>
              </label>
              <input
                required
                type="text"
                name="nickname"
                value={formData.nickname || ""}
                onChange={handleChange}
                className="w-full p-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("gender")} <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-border rounded-lg flex-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {t("male")}
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-border rounded-lg flex-1 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    className="w-4 h-4 text-pink-600"
                  />
                  <span className="font-medium text-pink-600 dark:text-pink-400">
                    {t("female")}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Life Event Section */}
        <section>
          <h3 className="text-lg font-bold border-b border-border pb-3 mb-4 text-primary">
            {t("lifeEvent")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("birthDate")} <span className="text-destructive">*</span>
              </label>
              <input
                required
                type="date"
                name="birth_date"
                value={formData.birth_date || ""}
                onChange={handleChange}
                className="w-full p-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div className="p-4 border border-border rounded-lg bg-muted/20">
              <label className="block text-sm font-medium mb-3">
                {t("livingStatus")}
              </label>
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!isDeceased}
                    onChange={() => setIsDeceased(false)}
                    className="w-4 h-4 text-primary"
                  />
                  <span>{t("alive")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-500">
                  <input
                    type="radio"
                    checked={isDeceased}
                    onChange={() => setIsDeceased(true)}
                    className="w-4 h-4 text-slate-500"
                  />
                  <span>{t("deceased")}</span>
                </label>
              </div>

              {isDeceased && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium mb-1 text-slate-500">
                    {t("deathDate")}
                  </label>
                  <input
                    type="date"
                    name="death_date"
                    value={formData.death_date || ""}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-background focus:ring-2 focus:ring-slate-500 transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("leaveEmpty")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Family Relationships Section */}
        <section>
          <h3 className="text-lg font-bold border-b border-border pb-3 mb-4 text-primary">
            {t("familyRelations")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("father")}
              </label>
              <select
                name="father_id"
                value={formData.father_id || ""}
                onChange={handleChange}
                className="w-full p-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="">{t("unknownPerson")}</option>
                {members
                  .filter((m) => m.gender === "male" && m.id !== formData.id)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("mother")}
              </label>
              <select
                name="mother_id"
                value={formData.mother_id || ""}
                onChange={handleChange}
                className="w-full p-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="">{t("unknownPerson")}</option>
                {members
                  .filter((m) => m.gender === "female" && m.id !== formData.id)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("spouseLabel")}
              </label>
              <select
                name="spouse_id"
                value={formData.spouse_id || ""}
                onChange={handleChange}
                className="w-full p-2.5 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="">{t("notMarried")}</option>
                {members
                  .filter((m) => m.id !== formData.id)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="pt-6 border-t border-border mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-6 py-3 rounded-xl font-bold border border-border hover:bg-muted transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-8 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {initialData ? t("saveChanges") : t("addMemberNew")}
          </button>
        </div>
      </form>
    </div>
  );
}
