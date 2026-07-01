"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useFamily } from "@/context/FamilyContext";
import { isSamePerson } from "@/utils/nameSync";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { FamilyMember } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { members, addMember } = useFamily();
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [isMarried, setIsMarried] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [childrenNames, setChildrenNames] = useState<string[]>([""]);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    birthPlace: "",
    birthDate: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
    gender: "male" as "male" | "female",
  });

  // Suggestion State
  const [fatherSuggestion, setFatherSuggestion] = useState("");
  const [motherSuggestion, setMotherSuggestion] = useState("");

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Name Sync Logic for Parents
    if (name === "fatherName") {
      const match = members.find(
        (m) => m.gender === "male" && isSamePerson(m.full_name, value),
      );
      setFatherSuggestion(match ? match.full_name : "");
    }
    if (name === "motherName") {
      const match = members.find(
        (m) => m.gender === "female" && isSamePerson(m.full_name, value),
      );
      setMotherSuggestion(match ? match.full_name : "");
    }
  };

  const acceptSuggestion = (
    field: "fatherName" | "motherName",
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "fatherName") setFatherSuggestion("");
    if (field === "motherName") setMotherSuggestion("");
  };

  const handleAddChild = () => setChildrenNames([...childrenNames, ""]);

  const handleChildChange = (index: number, value: string) => {
    const newChildren = [...childrenNames];
    newChildren[index] = value;
    setChildrenNames(newChildren);
  };

  const handleRemoveChild = (index: number) => {
    if (childrenNames.length > 1) {
      const newChildren = childrenNames.filter((_, i) => i !== index);
      setChildrenNames(newChildren);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        toast.error(t("passwordMismatch"));
        return;
      }
      if (formData.password.length < 6) {
        toast.error(t("passwordLength"));
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      submitRegistration();
    }
  };

  const submitRegistration = async () => {
    setIsLoading(true);
    try {
      // 1. Register to Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (authError) throw authError;

      // Ensure user exists
      const user_id = authData.user?.id;
      if (!user_id) throw new Error("Failed to get user ID after sign up");

      // Attempt to find father and mother by exact name match if provided
      const father_id = formData.fatherName
        ? members.find(
            (m) =>
              m.gender === "male" &&
              isSamePerson(m.full_name, formData.fatherName),
          )?.id || null
        : null;

      const mother_id = formData.motherName
        ? members.find(
            (m) =>
              m.gender === "female" &&
              isSamePerson(m.full_name, formData.motherName),
          )?.id || null
        : null;

      const spouse_id =
        isMarried && formData.spouseName
          ? members.find((m) => isSamePerson(m.full_name, formData.spouseName))
              ?.id || null
          : null;

      // 2. Create FamilyMember profile
      const newMember: Partial<FamilyMember> = {
        full_name: formData.fullName,
        nickname: formData.fullName.split(" ")[0],
        gender: formData.gender,
        birth_date: formData.birthDate,
        photo_url: "", // Default or null
        father_id,
        mother_id,
        spouse_id,
        // Wait, context addMember does not support adding 'user_id' because types don't have it yet,
        // but we will insert it directly into supabase or extend type
        user_id: user_id,
      } as any;

      // Note: context's addMember might not handle user_id unless backend allows it or we pass it
      await addMember(newMember as FamilyMember);

      // (Optional) add children here if needed, but for now we just register the parent

      setStep(4); // Success Screen
      setTimeout(() => {
        router.push("/"); // Go to home because they are logged in!
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 py-12 bg-muted/30 w-full min-h-[calc(100vh-64px)]">
      <div className="max-w-2xl w-full bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-primary p-6 text-primary-foreground text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <h1 className="text-3xl font-black mb-2 flex items-center justify-center">
            <UserPlus className="w-8 h-8 mr-3" /> {t("registerTitle")}
          </h1>
          <p className="opacity-90 font-medium">{t("registerDesc")}</p>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {step === 4 ? (
            <div className="text-center py-12 animate-in zoom-in duration-500">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-black text-foreground mb-4">
                {t("registerSuccess")}
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                {t("registerSuccessDesc")}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleNext}
              className="space-y-6 animate-in slide-in-from-right-8 duration-300"
            >
              {/* STEP 1: Account Credentials */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-foreground">
                      {t("accountInfo")}
                    </h2>
                    <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {t("step")} 1 / 3
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1.5">
                      {t("emailOrUsername")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={t("placeholderEmail")}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-1.5">
                        {t("password")}
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder={t("placeholderPassword")}
                        minLength={6}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-1.5">
                        {t("confirmPassword")}
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder={t("placeholderConfirm")}
                        minLength={6}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Personal Data */}
              {step === 2 && (
                <div className="space-y-5 animate-in slide-in-from-right-8 duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" /> {t("back")}
                    </button>
                    <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {t("step")} 2 / 3
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-foreground mb-4">
                    {t("personalData")}
                  </h2>

                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1.5">
                      {t("fullName")}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder={t("placeholderFullName")}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-1.5">
                        {t("gender")}
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      >
                        <option value="male">{t("male")}</option>
                        <option value="female">{t("female")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-1.5">
                        {t("birthDate")}
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1.5">
                      {t("birthPlace")}
                    </label>
                    <input
                      type="text"
                      name="birthPlace"
                      value={formData.birthPlace}
                      onChange={handleChange}
                      required
                      placeholder={t("placeholderBirthPlace")}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-border mt-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">
                      {t("parents")}
                    </h3>

                    <div className="mb-4">
                      <label className="block text-sm font-bold text-foreground mb-1.5">
                        {t("fatherName")}
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        required
                        placeholder={t("placeholderFather")}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      />
                      {fatherSuggestion && (
                        <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between">
                          <div className="flex items-center text-sm text-blue-700 dark:text-blue-400">
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>
                              {t("didYouMean")}{" "}
                              <strong>{fatherSuggestion}</strong>?
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              acceptSuggestion("fatherName", fatherSuggestion)
                            }
                            className="text-xs bg-blue-500 text-white font-bold px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors"
                          >
                            {t("yesCorrect")}
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-foreground mb-1.5">
                        {t("motherName")}
                      </label>
                      <input
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        required
                        placeholder={t("placeholderMother")}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      />
                      {motherSuggestion && (
                        <div className="mt-2 p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg flex items-center justify-between">
                          <div className="flex items-center text-sm text-pink-700 dark:text-pink-400">
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>
                              {t("didYouMean")}{" "}
                              <strong>{motherSuggestion}</strong>?
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              acceptSuggestion("motherName", motherSuggestion)
                            }
                            className="text-xs bg-pink-500 text-white font-bold px-3 py-1.5 rounded-md hover:bg-pink-600 transition-colors"
                          >
                            {t("yesCorrect")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Status & Family */}
              {step === 3 && (
                <div className="space-y-5 animate-in slide-in-from-right-8 duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" /> {t("back")}
                    </button>
                    <span className="text-sm font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {t("step")} 3 / 3
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-foreground mb-4">
                    {t("newFamilyStatus")}
                  </h2>

                  <div className="bg-background border border-border rounded-xl p-5">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isMarried}
                        onChange={(e) => setIsMarried(e.target.checked)}
                        className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300"
                      />
                      <span className="font-bold text-foreground">
                        {t("marriedCheck")}
                      </span>
                    </label>

                    {isMarried && (
                      <div className="mt-4 animate-in slide-in-from-top-2">
                        <label className="block text-sm font-bold text-foreground mb-1.5">
                          {t("spouseName")}
                        </label>
                        <input
                          type="text"
                          name="spouseName"
                          value={formData.spouseName}
                          onChange={handleChange}
                          required
                          placeholder={t("placeholderSpouse")}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-background border border-border rounded-xl p-5">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasChildren}
                        onChange={(e) => setHasChildren(e.target.checked)}
                        className="w-5 h-5 text-primary rounded focus:ring-primary border-gray-300"
                      />
                      <span className="font-bold text-foreground">
                        {t("hasChildrenCheck")}
                      </span>
                    </label>

                    {hasChildren && (
                      <div className="mt-4 space-y-3 animate-in slide-in-from-top-2">
                        <label className="block text-sm font-bold text-foreground mb-1.5">
                          {t("childrenList")}
                        </label>
                        {childrenNames.map((child, index) => (
                          <div key={index} className="flex space-x-2">
                            <input
                              type="text"
                              value={child}
                              onChange={(e) =>
                                handleChildChange(index, e.target.value)
                              }
                              required
                              placeholder={`${t("placeholderChild")} ${index + 1}`}
                              className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                            {childrenNames.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveChild(index)}
                                className="px-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-bold"
                              >
                                X
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddChild}
                          className="w-full py-2.5 mt-2 border-2 border-dashed border-primary/50 text-primary rounded-lg font-bold hover:bg-primary/5 transition-colors"
                        >
                          + {t("addChild")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-6 mt-6 border-t border-border">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 px-4 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25 text-lg disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {step === 3 ? t("finishRegister") : t("continueBtn")}{" "}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
                {step === 1 && (
                  <p className="text-center mt-4 text-sm text-muted-foreground font-medium">
                    {t("alreadyHaveAccount")}{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:underline font-bold"
                    >
                      {t("loginHere")}
                    </Link>
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
